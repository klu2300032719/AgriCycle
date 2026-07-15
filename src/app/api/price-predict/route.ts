import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { priceHistory } from "@/db/schema";
import { predictPriceWithAI } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const wasteType = body.wasteType || "Rice Husk";
    const quantity = Number(body.quantity ?? 10);
    const moisture = Number(body.moisture ?? 12);
    const region = body.region || "Tamil Nadu";
    const season = body.season || "Monsoon exit";

    const prediction = await predictPriceWithAI({
      wasteType,
      quantity,
      moisture,
      region,
      season,
    });

    const history = await db.select().from(priceHistory);

    return NextResponse.json({
      ...prediction,
      history: history.map((h) => ({
        month: h.month,
        price: Number(h.price),
      })),
    });
  } catch (error) {
    console.error("POST /api/price-predict", error);
    return NextResponse.json(
      { error: "Price prediction failed" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const history = await db.select().from(priceHistory);
    return NextResponse.json({
      history: history.map((h) => ({
        month: h.month,
        price: Number(h.price),
      })),
    });
  } catch (error) {
    console.error("GET /api/price-predict", error);
    return NextResponse.json({ history: [] }, { status: 500 });
  }
}
