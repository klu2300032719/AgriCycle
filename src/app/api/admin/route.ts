import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { buyers, listings, offers, transactions, user } from "@/db/schema";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    // bootstrap: if no admins exist, promote first requester with ?bootstrap=1 handled separately
    return { error: NextResponse.json({ error: "Admin only" }, { status: 403 }), session };
  }
  return { session, error: null };
}

export async function GET() {
  try {
    const gate = await requireAdmin();
    if (gate.error && !gate.session) return gate.error;

    // Allow non-admin to see if they can bootstrap
    const users = await db.select().from(user).orderBy(desc(user.createdAt));
    const hasAdmin = users.some((u) => u.role === "admin");

    if (gate.error && hasAdmin) return gate.error;
    if (gate.error && !hasAdmin) {
      return NextResponse.json({
        needsBootstrap: true,
        message: "No admin yet. POST { action: 'bootstrap' } while signed in to become admin.",
        stats: null,
      });
    }

    const [allListings, allOffers, allTxns, allBuyers] = await Promise.all([
      db.select().from(listings),
      db.select().from(offers),
      db.select().from(transactions),
      db.select().from(buyers),
    ]);

    return NextResponse.json({
      needsBootstrap: false,
      stats: {
        users: users.length,
        listings: allListings.length,
        available: allListings.filter((l) => l.status === "available").length,
        offers: allOffers.length,
        pendingOffers: allOffers.filter((o) => o.status === "pending").length,
        transactions: allTxns.length,
        buyers: allBuyers.length,
        volume: allTxns
          .filter((t) => t.status === "completed")
          .reduce((s, t) => s + t.amount, 0),
      },
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        verified: u.verified,
        createdAt: u.createdAt,
      })),
      listings: allListings.slice(0, 50),
      offers: allOffers.slice(0, 50),
      transactions: allTxns.slice(0, 50),
    });
  } catch (error) {
    console.error("GET /api/admin", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

const actionSchema = z.object({
  action: z.enum([
    "bootstrap",
    "set_role",
    "verify_user",
    "archive_listing",
    "set_listing_status",
  ]),
  userId: z.string().optional(),
  role: z.enum(["farmer", "buyer", "transporter", "admin"]).optional(),
  listingId: z.string().optional(),
  status: z.string().optional(),
  verified: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = actionSchema.parse(await request.json());
    const users = await db.select().from(user);
    const hasAdmin = users.some((u) => u.role === "admin");
    const myRole = (session.user as { role?: string }).role;

    if (body.action === "bootstrap") {
      if (hasAdmin) {
        return NextResponse.json(
          { error: "Admin already exists" },
          { status: 400 },
        );
      }
      await db
        .update(user)
        .set({ role: "admin", verified: true, updatedAt: new Date() })
        .where(eq(user.id, session.user.id));
      return NextResponse.json({ ok: true, role: "admin" });
    }

    if (myRole !== "admin") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    if (body.action === "set_role" && body.userId && body.role) {
      await db
        .update(user)
        .set({ role: body.role, updatedAt: new Date() })
        .where(eq(user.id, body.userId));
      return NextResponse.json({ ok: true });
    }

    if (body.action === "verify_user" && body.userId) {
      await db
        .update(user)
        .set({
          verified: body.verified ?? true,
          updatedAt: new Date(),
        })
        .where(eq(user.id, body.userId));
      return NextResponse.json({ ok: true });
    }

    if (body.action === "archive_listing" && body.listingId) {
      await db
        .update(listings)
        .set({ status: "archived", updatedAt: new Date() })
        .where(eq(listings.id, body.listingId));
      return NextResponse.json({ ok: true });
    }

    if (body.action === "set_listing_status" && body.listingId && body.status) {
      await db
        .update(listings)
        .set({ status: body.status, updatedAt: new Date() })
        .where(eq(listings.id, body.listingId));
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message }, { status: 400 });
    }
    console.error("POST /api/admin", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
