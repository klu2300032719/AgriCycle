import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { shipments } from "@/db/schema";
import { auth } from "@/lib/auth";

const FLEET: Record<
  string,
  { name: string; ratePerKm: number; capacity: string; eta: string }
> = {
  "TR-01": {
    name: "Mini truck (1–3 t)",
    ratePerKm: 18,
    capacity: "3 tonnes",
    eta: "Same day",
  },
  "TR-02": {
    name: "Medium truck (5–8 t)",
    ratePerKm: 28,
    capacity: "8 tonnes",
    eta: "Next day",
  },
  "TR-03": {
    name: "Heavy truck (10–15 t)",
    ratePerKm: 42,
    capacity: "15 tonnes",
    eta: "1–2 days",
  },
  "TR-04": {
    name: "Tractor-trailer bulk",
    ratePerKm: 55,
    capacity: "25 tonnes",
    eta: "2–3 days",
  },
};

function estimateDistance(pickup: string, drop: string): number {
  // Simple hash-based demo distance; real app would use maps API
  const key = `${pickup}|${drop}`.toLowerCase();
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return 80 + (hash % 220);
}

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(shipments)
      .orderBy(desc(shipments.createdAt))
      .limit(20);

    return NextResponse.json({
      fleet: Object.entries(FLEET).map(([id, v]) => ({
        id,
        name: v.name,
        rate: `₹${v.ratePerKm}/km`,
        eta: v.eta,
        capacity: v.capacity,
        ratePerKm: v.ratePerKm,
      })),
      shipments: rows,
    });
  } catch (error) {
    console.error("GET /api/transport", error);
    return NextResponse.json(
      { error: "Failed to load transport", fleet: [], shipments: [] },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pickup = body.pickup || "Thanjavur";
    const drop = body.drop || body.dropoff || "Coimbatore";
    const load = Number(body.load || body.loadTonnes || 8);
    const wasteType = body.wasteType || "Rice Husk";
    const vehicleId = body.vehicleId || body.selected || "TR-02";
    const vehicle = FLEET[vehicleId] || FLEET["TR-02"];
    const distanceKm = Number(body.distanceKm) || estimateDistance(pickup, drop);
    const cost = distanceKm * vehicle.ratePerKm;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const id = `SHP-${Date.now().toString(36).toUpperCase()}`;

    const [row] = await db
      .insert(shipments)
      .values({
        id,
        pickup,
        dropoff: drop,
        loadTonnes: load,
        wasteType,
        vehicleId,
        vehicleName: vehicle.name,
        distanceKm,
        cost,
        status: "booked",
        userId: session?.user?.id ?? null,
      })
      .returning();

    return NextResponse.json(
      {
        shipment: row,
        steps: [
          { label: "Booked", done: true },
          { label: "Pickup scheduled", done: true },
          { label: "In transit", done: false },
          { label: "Delivered", done: false },
        ],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/transport", error);
    return NextResponse.json(
      { error: "Failed to book transport" },
      { status: 500 },
    );
  }
}
