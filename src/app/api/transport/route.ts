import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { shipments } from "@/db/schema";
import { auth } from "@/lib/auth";
import { distanceBetweenLocations } from "@/lib/geo";

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

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    let rows = await db
      .select()
      .from(shipments)
      .orderBy(desc(shipments.createdAt))
      .limit(20);

    if (session?.user) {
      const role = (session.user as { role?: string }).role;
      if (role !== "admin") {
        rows = rows.filter((s) => s.userId === session.user.id);
      }
    }

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

const bookSchema = z.object({
  pickup: z.string().min(1).max(200),
  drop: z.string().min(1).max(200).optional(),
  dropoff: z.string().min(1).max(200).optional(),
  load: z.number().positive().optional(),
  loadTonnes: z.number().positive().optional(),
  wasteType: z.string().min(1),
  vehicleId: z.string().optional(),
  selected: z.string().optional(),
  listingId: z.string().optional(),
  offerId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json(
        { error: "Sign in to book transport" },
        { status: 401 },
      );
    }

    const body = bookSchema.parse(await request.json());
    const pickup = body.pickup;
    const drop = body.drop || body.dropoff || "Coimbatore";
    const load = body.load || body.loadTonnes || 8;
    const wasteType = body.wasteType;
    const vehicleId = body.vehicleId || body.selected || "TR-02";
    const vehicle = FLEET[vehicleId] || FLEET["TR-02"];
    const distanceKm = distanceBetweenLocations(pickup, drop);
    const cost = distanceKm * vehicle.ratePerKm;

    const id = `SHP-${Date.now().toString(36).toUpperCase()}`;
    const drivers = [
      { name: "Ravi Kumar", phone: "+91 98xxx 12001" },
      { name: "Senthil N", phone: "+91 98xxx 12002" },
      { name: "Anitha R", phone: "+91 98xxx 12003" },
    ];
    const driver = drivers[Math.floor(Math.random() * drivers.length)];

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
        listingId: body.listingId ?? null,
        offerId: body.offerId ?? null,
        driverName: driver.name,
        driverPhone: driver.phone,
        userId: session.user.id,
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
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message }, { status: 400 });
    }
    console.error("POST /api/transport", error);
    return NextResponse.json(
      { error: "Failed to book transport" },
      { status: 500 },
    );
  }
}
