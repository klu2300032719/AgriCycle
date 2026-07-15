import { NextRequest, NextResponse } from "next/server";
import { estimateQuantityWithAI, gradeWaste } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const wasteType = body.wasteType || "Crop Residue";
    const crop = body.crop || "Paddy";
    const acres = Number(body.acres ?? 5);
    const yieldPerAcre = Number(body.yieldPerAcre ?? 2.5);
    const moisture = Number(body.moisture ?? 14);
    const purity = Number(body.purity ?? 90);

    const { tonnes, notes } = await estimateQuantityWithAI({
      wasteType,
      crop,
      acres,
      yieldPerAcre,
      moisture,
      purity,
    });

    const grade = gradeWaste(moisture, purity);
    const pricePerT: Record<string, number> = {
      "Crop Residue": 1800,
      "Banana Stems": 1100,
      "Coconut Shells": 4500,
      "Sugarcane Waste": 1400,
      "Rice Husk": 3000,
      "Animal Manure": 2100,
    };
    let unit = pricePerT[wasteType] ?? 1500;
    if (grade === "A") unit = Math.round(unit * 1.1);
    if (grade === "C") unit = Math.round(unit * 0.8);

    return NextResponse.json({
      tonnes,
      grade,
      unit,
      total: Math.round(tonnes * unit),
      notes,
      model: process.env.AI_CLASSIFICATION_MODEL || "logistic_regression",
    });
  } catch (error) {
    console.error("POST /api/estimate", error);
    return NextResponse.json({ error: "Estimate failed" }, { status: 500 });
  }
}
