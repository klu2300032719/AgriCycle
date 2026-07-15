import { NextRequest, NextResponse } from "next/server";
import { desc, ilike, or } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { listings } from "@/db/schema";
import { auth } from "@/lib/auth";
import { gradeWaste } from "@/lib/ai";
import { resolveCoords } from "@/lib/geo";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const waste = searchParams.get("waste") || "All";
    const grade = searchParams.get("grade") || "All";
    const mine = searchParams.get("mine") === "1";
    const status = searchParams.get("status");

    let rows = await db.select().from(listings).orderBy(desc(listings.createdAt));

    if (mine) {
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized", listings: [] }, { status: 401 });
      }
      rows = rows.filter((r) => r.sellerId === session.user.id);
    }

    if (q) {
      const pattern = `%${q}%`;
      rows = await db
        .select()
        .from(listings)
        .where(
          or(
            ilike(listings.title, pattern),
            ilike(listings.location, pattern),
            ilike(listings.seller, pattern),
            ilike(listings.wasteType, pattern),
          ),
        )
        .orderBy(desc(listings.createdAt));
      if (mine) {
        const session = await auth.api.getSession({ headers: await headers() });
        rows = rows.filter((r) => r.sellerId === session?.user?.id);
      }
    }

    if (waste !== "All") rows = rows.filter((r) => r.wasteType === waste);
    if (grade !== "All") rows = rows.filter((r) => r.grade === grade);
    if (status) rows = rows.filter((r) => r.status === status);
    else if (!mine) rows = rows.filter((r) => r.status !== "archived");

    return NextResponse.json({ listings: rows });
  } catch (error) {
    console.error("GET /api/listings", error);
    return NextResponse.json(
      { error: "Failed to load listings", listings: [] },
      { status: 500 },
    );
  }
}

const createSchema = z.object({
  wasteType: z.string().min(1).max(80),
  crop: z.string().optional(),
  acres: z.number().optional(),
  yieldPerAcre: z.number().optional(),
  moisture: z.number().min(0).max(100).optional(),
  purity: z.number().min(0).max(100).optional(),
  location: z.string().min(1).max(200),
  notes: z.string().max(2000).optional(),
  title: z.string().max(200).optional(),
  quantity: z.number().positive().optional(),
  pricePerUnit: z.number().positive().optional(),
  seller: z.string().max(120).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const rl = rateLimit(clientKey(request, "listings-post"), 20, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Too many requests. Retry in ${rl.retryAfter}s` },
        { status: 429 },
      );
    }

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json(
        { error: "Please sign in to publish a listing" },
        { status: 401 },
      );
    }

    const body = createSchema.parse(await request.json());
    const m = body.moisture ?? 14;
    const p = body.purity ?? 90;
    const grade = gradeWaste(m, p);

    const residueRatio: Record<string, number> = {
      Paddy: 1.2,
      Wheat: 1.0,
      Sugarcane: 0.3,
      Banana: 0.8,
      Coconut: 0.25,
      Mixed: 0.9,
    };
    const ratio = residueRatio[body.crop ?? ""] ?? 1;
    const tonnes =
      body.quantity != null
        ? body.quantity
        : Math.round((body.acres ?? 5) * (body.yieldPerAcre ?? 2.5) * ratio * 10) /
          10;

    const priceMap: Record<string, number> = {
      "Crop Residue": 1800,
      "Banana Stems": 1100,
      "Coconut Shells": 4500,
      "Sugarcane Waste": 1400,
      "Rice Husk": 3000,
      "Animal Manure": 2100,
    };
    let unit = body.pricePerUnit || priceMap[body.wasteType] || 1500;
    if (grade === "A") unit = Math.round(unit * 1.1);
    if (grade === "C") unit = Math.round(unit * 0.8);

    const coords = resolveCoords(body.location);
    const id = `LST-${Date.now().toString(36).toUpperCase()}`;
    const today = new Date().toISOString().slice(0, 10);

    const [row] = await db
      .insert(listings)
      .values({
        id,
        title:
          body.title ||
          `${body.wasteType} – ${tonnes}t from ${body.location}`,
        wasteType: body.wasteType,
        quantity: tonnes,
        unit: "tonnes",
        pricePerUnit: unit,
        grade,
        location: body.location,
        distanceKm: 0,
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
        seller: body.seller || session.user.name || "Local Farmer",
        sellerId: session.user.id,
        moisture: m,
        purity: p,
        description:
          body.notes ||
          `${grade}-grade ${body.wasteType}. Moisture ${m}%, purity ${p}%. Ready for industrial buyers.`,
        status: "available",
        postedAt: today,
      })
      .returning();

    return NextResponse.json({ listing: row }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }
    console.error("POST /api/listings", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 },
    );
  }
}
