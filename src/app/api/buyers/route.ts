import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { buyers } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const radius = Number(searchParams.get("radius") || "100");
    const type = searchParams.get("type") || "All";

    let rows = await db.select().from(buyers).orderBy(asc(buyers.distanceKm));

    rows = rows.filter((b) => b.distanceKm <= radius);
    if (type !== "All") {
      rows = rows.filter((b) => b.type === type);
    }

    return NextResponse.json({ buyers: rows });
  } catch (error) {
    console.error("GET /api/buyers", error);
    return NextResponse.json(
      { error: "Failed to load buyers", buyers: [] },
      { status: 500 },
    );
  }
}
