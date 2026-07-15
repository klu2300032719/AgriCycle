import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { listings, offers } from "@/db/schema";
import { auth } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const [row] = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
    if (!row) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    const offerCount = await db
      .select()
      .from(offers)
      .where(eq(offers.listingId, id));

    return NextResponse.json({
      listing: row,
      offerCount: offerCount.length,
      openOffers: offerCount.filter((o) => o.status === "pending").length,
    });
  } catch (error) {
    console.error("GET /api/listings/[id]", error);
    return NextResponse.json({ error: "Failed to load listing" }, { status: 500 });
  }
}

const patchSchema = z.object({
  status: z.enum(["available", "reserved", "sold", "archived"]).optional(),
  pricePerUnit: z.number().positive().optional(),
  quantity: z.number().positive().optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  location: z.string().max(200).optional(),
});

export async function PATCH(request: NextRequest, ctx: Ctx) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await ctx.params;
    const [existing] = await db
      .select()
      .from(listings)
      .where(eq(listings.id, id))
      .limit(1);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const role = (session.user as { role?: string }).role;
    if (existing.sellerId !== session.user.id && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = patchSchema.parse(await request.json());
    const [row] = await db
      .update(listings)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(listings.id, id))
      .returning();

    return NextResponse.json({ listing: row });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message }, { status: 400 });
    }
    console.error("PATCH /api/listings/[id]", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await ctx.params;
    const [existing] = await db
      .select()
      .from(listings)
      .where(eq(listings.id, id))
      .limit(1);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const role = (session.user as { role?: string }).role;
    if (existing.sellerId !== session.user.id && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Soft delete
    const [row] = await db
      .update(listings)
      .set({ status: "archived", updatedAt: new Date() })
      .where(eq(listings.id, id))
      .returning();

    return NextResponse.json({ listing: row, deleted: true });
  } catch (error) {
    console.error("DELETE /api/listings/[id]", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
