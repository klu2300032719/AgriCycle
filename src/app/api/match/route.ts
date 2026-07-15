import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { buyers, listings } from "@/db/schema";
import { haversineKm, resolveCoords } from "@/lib/geo";

/** Match listings to buyers by waste type + distance */
export async function GET(request: NextRequest) {
  try {
    const listingId = new URL(request.url).searchParams.get("listingId");
    if (!listingId) {
      return NextResponse.json({ error: "listingId required" }, { status: 400 });
    }
    const [listing] = await db
      .select()
      .from(listings)
      .where(eq(listings.id, listingId))
      .limit(1);
    if (!listing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const allBuyers = await db.select().from(buyers);
    const listingCoords =
      listing.lat != null && listing.lng != null
        ? { lat: listing.lat, lng: listing.lng }
        : resolveCoords(listing.location);

    const matches = allBuyers
      .filter((b) => b.lookingFor.includes(listing.wasteType))
      .map((b) => {
        const bCoords =
          b.lat != null && b.lng != null
            ? { lat: b.lat, lng: b.lng }
            : resolveCoords(b.location);
        let distanceKm = b.distanceKm;
        if (listingCoords && bCoords) {
          distanceKm = haversineKm(listingCoords, bCoords);
        }
        const score =
          (b.verified ? 20 : 0) +
          b.rating * 10 +
          Math.max(0, 40 - distanceKm / 5);
        return { ...b, distanceKm, matchScore: Math.round(score) };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 8);

    return NextResponse.json({ listingId, matches });
  } catch (error) {
    console.error("GET /api/match", error);
    return NextResponse.json({ matches: [] }, { status: 500 });
  }
}
