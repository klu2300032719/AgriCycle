import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { listings, messages } from "@/db/schema";
import { auth } from "@/lib/auth";
import { notify } from "@/lib/notify";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized", messages: [] }, { status: 401 });
    }
    const listingId = new URL(request.url).searchParams.get("listingId");
    let rows = await db
      .select()
      .from(messages)
      .orderBy(desc(messages.createdAt))
      .limit(100);

    rows = rows.filter(
      (m) =>
        m.fromUserId === session.user.id || m.toUserId === session.user.id,
    );
    if (listingId) rows = rows.filter((m) => m.listingId === listingId);

    return NextResponse.json({ messages: rows.reverse() });
  } catch (error) {
    console.error("GET /api/messages", error);
    return NextResponse.json({ messages: [] }, { status: 500 });
  }
}

const schema = z.object({
  listingId: z.string(),
  body: z.string().min(1).max(2000),
  toUserId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Sign in to message" }, { status: 401 });
    }
    const body = schema.parse(await request.json());
    const [listing] = await db
      .select()
      .from(listings)
      .where(eq(listings.id, body.listingId))
      .limit(1);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const toUserId =
      body.toUserId ||
      (listing.sellerId === session.user.id ? null : listing.sellerId);
    if (!toUserId) {
      return NextResponse.json(
        { error: "No recipient (listing has no seller account)" },
        { status: 400 },
      );
    }

    const id = `MSG-${Date.now().toString(36).toUpperCase()}`;
    const [row] = await db
      .insert(messages)
      .values({
        id,
        listingId: listing.id,
        fromUserId: session.user.id,
        toUserId,
        body: body.body,
        read: false,
      })
      .returning();

    await notify({
      userId: toUserId,
      title: "New message",
      body: body.body.slice(0, 120),
      href: `/marketplace/${listing.id}`,
    });

    return NextResponse.json({ message: row }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message }, { status: 400 });
    }
    console.error("POST /api/messages", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
