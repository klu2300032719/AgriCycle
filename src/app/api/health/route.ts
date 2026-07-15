import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { getAuthBaseURL, getTrustedOrigins } from "@/lib/auth-url";

export const runtime = "nodejs";

/** Lightweight diagnostics for production auth setup (no secrets exposed). */
export async function GET() {
  let dbOk = false;
  let dbError: string | null = null;
  try {
    await db.select({ id: user.id }).from(user).limit(1);
    dbOk = true;
  } catch (e) {
    dbError = e instanceof Error ? e.message : "db error";
  }

  const secret = process.env.BETTER_AUTH_SECRET;
  const baseURL = getAuthBaseURL();

  const secretOk = Boolean(secret && secret.length >= 32);
  const baseLooksProd =
    !process.env.VERCEL || !baseURL.includes("localhost");
  const healthy = dbOk && secretOk && baseLooksProd;

  return NextResponse.json({
    ok: healthy,
    auth: {
      baseURL,
      trustedOrigins: getTrustedOrigins(),
      secretConfigured: Boolean(secret && secret.length >= 16),
      secretLengthOk: secretOk,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV || null,
      hasDatabaseUrl: Boolean(
        process.env.DATABASE_URL || process.env.NEON_DATABASE_URL,
      ),
    },
    database: {
      ok: dbOk,
      error: dbError,
    },
    hints: [
      !secretOk
        ? "Set BETTER_AUTH_SECRET to a random string ≥ 32 chars"
        : null,
      process.env.VERCEL && baseURL.includes("localhost")
        ? "Set BETTER_AUTH_URL and NEXT_PUBLIC_APP_URL to your production HTTPS URL (not localhost), then redeploy"
        : null,
      !dbOk
        ? "Database unreachable or tables missing — run npm run db:push against production DATABASE_URL"
        : null,
    ].filter(Boolean),
  });
}
