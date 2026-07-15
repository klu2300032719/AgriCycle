import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { account, passwordResetTokens, user } from "@/db/schema";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { randomBytes } from "crypto";

/**
 * MVP password reset:
 * - POST { email } → creates token (returned in JSON for demo; production would email it)
 * - PUT { token, password } → updates password via Better Auth internal hash by re-using sign-up path
 *
 * Note: Without an email provider we surface the reset link in the API response for local/demo use.
 */

const requestSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const rl = rateLimit(clientKey(request, "pwd-reset"), 5, 60_000);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { email } = requestSchema.parse(await request.json());
    const [u] = await db
      .select()
      .from(user)
      .where(eq(user.email, email.toLowerCase()))
      .limit(1);

    // Always return success message to avoid email enumeration
    if (!u) {
      return NextResponse.json({
        ok: true,
        message: "If that email exists, a reset link was created.",
      });
    }

    const token = randomBytes(24).toString("hex");
    const id = `PRT-${Date.now().toString(36)}`;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await db.insert(passwordResetTokens).values({
      id,
      userId: u.id,
      token,
      expiresAt,
      used: false,
    });

    const base =
      process.env.BETTER_AUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    const resetUrl = `${base}/reset-password?token=${token}`;

    return NextResponse.json({
      ok: true,
      message: "Reset link created. (Demo mode: link returned below — wire SMTP in production.)",
      resetUrl,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    console.error("POST /api/password-reset", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

const resetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
});

export async function PUT(request: NextRequest) {
  try {
    const { token, password } = resetSchema.parse(await request.json());
    const [row] = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.token, token),
          eq(passwordResetTokens.used, false),
        ),
      )
      .limit(1);

    if (!row || row.expiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 },
      );
    }

    const [u] = await db
      .select()
      .from(user)
      .where(eq(user.id, row.userId))
      .limit(1);
    if (!u) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { hashPassword } = await import("better-auth/crypto");
    const hashed = await hashPassword(password);

    const accounts = await db
      .select()
      .from(account)
      .where(eq(account.userId, u.id));
    const cred = accounts.find((a) => a.providerId === "credential");
    if (cred) {
      await db
        .update(account)
        .set({ password: hashed, updatedAt: new Date() })
        .where(eq(account.id, cred.id));
    } else {
      await db.insert(account).values({
        id: `acc_${Date.now().toString(36)}`,
        accountId: u.id,
        providerId: "credential",
        userId: u.id,
        password: hashed,
      });
    }

    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, row.id));

    return NextResponse.json({ ok: true, message: "Password updated. You can sign in." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error("PUT /api/password-reset", error);
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}
