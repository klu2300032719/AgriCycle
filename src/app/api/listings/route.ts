import { NextRequest, NextResponse } from "next/server";
import { desc, ilike, or } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { listings } from "@/db/schema";
import { auth } from "@/lib/auth";
import { gradeWaste } from "@/lib/ai";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const waste = searchParams.get("waste") || "All";
    const grade = searchParams.get("grade") || "All";

    let rows = await db.select().from(listings).orderBy(desc(listings.createdAt));

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
    }

    if (waste !== "All") {
      rows = rows.filter((r) => r.wasteType === waste);
    }
    if (grade !== "All") {
      rows = rows.filter((r) => r.grade === grade);
    }

    return NextResponse.json({ listings: rows });
  } catch (error) {
    console.error("GET /api/listings", error);
    return NextResponse.json(
      { error: "Failed to load listings", listings: [] },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      wasteType,
      crop,
      acres,
      yieldPerAcre,
      moisture,
      purity,
      location,
      notes,
      title,
      quantity,
      pricePerUnit,
      seller,
    } = body;

    const m = Number(moisture ?? 14);
    const p = Number(purity ?? 90);
    const grade = gradeWaste(m, p);

    const residueRatio: Record<string, number> = {
      Paddy: 1.2,
      Wheat: 1.0,
      Sugarcane: 0.3,
      Banana: 0.8,
      Coconut: 0.25,
      Mixed: 0.9,
    };
    const ratio = residueRatio[crop as string] ?? 1;
    const tonnes =
      quantity != null
        ? Number(quantity)
        : Math.round(Number(acres) * Number(yieldPerAcre) * ratio * 10) / 10;

    const priceMap: Record<string, number> = {
      "Crop Residue": 1800,
      "Banana Stems": 1100,
      "Coconut Shells": 4500,
      "Sugarcane Waste": 1400,
      "Rice Husk": 3000,
      "Animal Manure": 2100,
    };
    let unit = Number(pricePerUnit) || priceMap[wasteType as string] || 1500;
    if (grade === "A") unit = Math.round(unit * 1.1);
    if (grade === "C") unit = Math.round(unit * 0.8);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const id = `LST-${Date.now().toString(36).toUpperCase()}`;
    const today = new Date().toISOString().slice(0, 10);
    const listingTitle =
      title ||
      `${wasteType} – ${tonnes}t from ${location || "farm"}`;

    const [row] = await db
      .insert(listings)
      .values({
        id,
        title: listingTitle,
        wasteType: wasteType || "Crop Residue",
        quantity: tonnes,
        unit: "tonnes",
        pricePerUnit: unit,
        grade,
        location: location || "Tamil Nadu",
        distanceKm: Math.round(10 + Math.random() * 40),
        seller: seller || session?.user?.name || "Local Farmer",
        sellerId: session?.user?.id ?? null,
        moisture: m,
        purity: p,
        description:
          notes ||
          `${grade}-grade ${wasteType}. Moisture ${m}%, purity ${p}%. Ready for industrial buyers.`,
        status: "available",
        postedAt: today,
      })
      .returning();

    return NextResponse.json({ listing: row }, { status: 201 });
  } catch (error) {
    console.error("POST /api/listings", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 },
    );
  }
}
