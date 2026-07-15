import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { listings, offers, transactions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { PLATFORM_FEE_PCT } from "@/lib/geo";
import { notify } from "@/lib/notify";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized", offers: [] }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");
    const role = searchParams.get("as") || "all"; // buyer | seller | all

    let rows = await db.select().from(offers).orderBy(desc(offers.createdAt));

    if (listingId) {
      rows = rows.filter((o) => o.listingId === listingId);
    }

    if (role === "buyer") {
      rows = rows.filter((o) => o.buyerId === session.user.id);
    } else if (role === "seller") {
      rows = rows.filter((o) => o.sellerId === session.user.id);
    } else {
      rows = rows.filter(
        (o) => o.buyerId === session.user.id || o.sellerId === session.user.id,
      );
    }

    // attach listing titles
    const allListings = await db.select().from(listings);
    const map = new Map(allListings.map((l) => [l.id, l]));
    const enriched = rows.map((o) => ({
      ...o,
      listingTitle: map.get(o.listingId)?.title ?? o.listingId,
      listingWasteType: map.get(o.listingId)?.wasteType,
      listingLocation: map.get(o.listingId)?.location,
    }));

    return NextResponse.json({ offers: enriched });
  } catch (error) {
    console.error("GET /api/offers", error);
    return NextResponse.json({ error: "Failed", offers: [] }, { status: 500 });
  }
}

const createSchema = z.object({
  listingId: z.string().min(1),
  quantity: z.number().positive(),
  pricePerUnit: z.number().positive(),
  message: z.string().max(1000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const rl = rateLimit(clientKey(request, "offers"), 25, 60_000);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Sign in to send an offer" }, { status: 401 });
    }

    const body = createSchema.parse(await request.json());
    const [listing] = await db
      .select()
      .from(listings)
      .where(eq(listings.id, body.listingId))
      .limit(1);

    if (!listing || listing.status !== "available") {
      return NextResponse.json(
        { error: "Listing not available" },
        { status: 400 },
      );
    }
    if (listing.sellerId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot offer on your own listing" },
        { status: 400 },
      );
    }
    if (body.quantity > listing.quantity) {
      return NextResponse.json(
        { error: `Max quantity is ${listing.quantity} ${listing.unit}` },
        { status: 400 },
      );
    }

    const totalAmount = Math.round(body.quantity * body.pricePerUnit);
    const id = `OFR-${Date.now().toString(36).toUpperCase()}`;

    const [row] = await db
      .insert(offers)
      .values({
        id,
        listingId: listing.id,
        buyerId: session.user.id,
        buyerName: session.user.name,
        sellerId: listing.sellerId,
        quantity: body.quantity,
        pricePerUnit: body.pricePerUnit,
        totalAmount,
        message: body.message || "",
        status: "pending",
      })
      .returning();

    if (listing.sellerId) {
      await notify({
        userId: listing.sellerId,
        title: "New offer received",
        body: `${session.user.name} offered ₹${totalAmount.toLocaleString()} for ${body.quantity}t of ${listing.wasteType}`,
        href: "/offers",
      });
    }

    return NextResponse.json({ offer: row }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message }, { status: 400 });
    }
    console.error("POST /api/offers", error);
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
  }
}

const patchSchema = z.object({
  id: z.string(),
  action: z.enum(["accept", "reject", "withdraw", "pay", "complete", "release_escrow"]),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = patchSchema.parse(await request.json());
    const [offer] = await db
      .select()
      .from(offers)
      .where(eq(offers.id, body.id))
      .limit(1);
    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    const isBuyer = offer.buyerId === session.user.id;
    const isSeller = offer.sellerId === session.user.id;
    const role = (session.user as { role?: string }).role;
    const isAdmin = role === "admin";

    let status = offer.status;
    let txn = null;

    if (body.action === "withdraw") {
      if (!isBuyer && !isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      status = "withdrawn";
    } else if (body.action === "reject") {
      if (!isSeller && !isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      status = "rejected";
      await notify({
        userId: offer.buyerId,
        title: "Offer rejected",
        body: `Your offer ${offer.id} was rejected by the seller.`,
        href: "/offers",
      });
    } else if (body.action === "accept") {
      if (!isSeller && !isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      status = "accepted";
      await db
        .update(listings)
        .set({ status: "reserved", updatedAt: new Date() })
        .where(eq(listings.id, offer.listingId));

      const fee = Math.round(offer.totalAmount * PLATFORM_FEE_PCT);
      const txnId = `TXN-${Date.now().toString(36).toUpperCase()}`;
      const today = new Date().toISOString().slice(0, 10);
      const [listing] = await db
        .select()
        .from(listings)
        .where(eq(listings.id, offer.listingId))
        .limit(1);

      [txn] = await db
        .insert(transactions)
        .values({
          id: txnId,
          listing: listing?.title || offer.listingId,
          listingId: offer.listingId,
          offerId: offer.id,
          buyer: offer.buyerName,
          buyerId: offer.buyerId,
          amount: offer.totalAmount,
          platformFee: fee,
          escrowAmount: 0,
          status: "pending",
          paymentMethod: "manual",
          date: today,
          userId: offer.sellerId,
        })
        .returning();

      await notify({
        userId: offer.buyerId,
        title: "Offer accepted!",
        body: `Pay ₹${offer.totalAmount.toLocaleString()} into escrow to lock the deal.`,
        href: "/offers",
      });
    } else if (body.action === "pay") {
      if (!isBuyer && !isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (offer.status !== "accepted") {
        return NextResponse.json(
          { error: "Offer must be accepted first" },
          { status: 400 },
        );
      }
      // Mark payment into escrow (demo — no real gateway)
      const fee = Math.round(offer.totalAmount * PLATFORM_FEE_PCT);
      const existing = await db
        .select()
        .from(transactions)
        .where(eq(transactions.offerId, offer.id));
      if (existing[0]) {
        [txn] = await db
          .update(transactions)
          .set({
            status: "in_escrow",
            escrowAmount: offer.totalAmount,
            paymentMethod: "razorpay_demo",
            updatedAt: new Date(),
          })
          .where(eq(transactions.id, existing[0].id))
          .returning();
      }
      if (offer.sellerId) {
        await notify({
          userId: offer.sellerId,
          title: "Payment in escrow",
          body: `Buyer paid ₹${offer.totalAmount.toLocaleString()}. Arrange transport and deliver.`,
          href: "/offers",
        });
      }
    } else if (body.action === "release_escrow" || body.action === "complete") {
      if (!isSeller && !isBuyer && !isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      status = "completed";
      await db
        .update(listings)
        .set({ status: "sold", updatedAt: new Date() })
        .where(eq(listings.id, offer.listingId));
      const existing = await db
        .select()
        .from(transactions)
        .where(eq(transactions.offerId, offer.id));
      if (existing[0]) {
        [txn] = await db
          .update(transactions)
          .set({
            status: "completed",
            escrowAmount: 0,
            updatedAt: new Date(),
          })
          .where(eq(transactions.id, existing[0].id))
          .returning();
      }
      await notify({
        userId: offer.buyerId,
        title: "Deal completed",
        body: `Transaction for ${offer.id} is complete.`,
        href: "/dashboard",
      });
      if (offer.sellerId) {
        await notify({
          userId: offer.sellerId,
          title: "Payout released",
          body: `Escrow released for offer ${offer.id}.`,
          href: "/dashboard",
        });
      }
    }

    const [row] = await db
      .update(offers)
      .set({ status, updatedAt: new Date() })
      .where(eq(offers.id, body.id))
      .returning();

    return NextResponse.json({ offer: row, transaction: txn });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message }, { status: 400 });
    }
    console.error("PATCH /api/offers", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
