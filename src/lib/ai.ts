import Groq from "groq-sdk";

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const model =
  process.env.GROQ_MODEL ||
  process.env.PRIMARY_LLM_MODEL ||
  "openai/gpt-oss-120b";

/** Deterministic grade from moisture + purity (classification model stand-in). */
export function gradeWaste(
  moisture: number,
  purity: number,
): "A" | "B" | "C" {
  // Logistic-style scoring: lower moisture + higher purity → better grade
  const score =
    1 / (1 + Math.exp(-(0.08 * (purity - 75) - 0.06 * (moisture - 20))));
  if (score >= 0.72 && moisture <= 15 && purity >= 85) return "A";
  if (score < 0.4 || moisture > 40 || purity < 65) return "C";
  return "B";
}

/** Linear-regression style base price (₹/kg) before AI refinement. */
export function regressPrice(input: {
  wasteType: string;
  moisture: number;
  quantity: number;
  region: string;
  season: string;
}): number {
  const base: Record<string, number> = {
    "Crop Residue": 1.8,
    "Banana Stems": 1.1,
    "Coconut Shells": 4.5,
    "Sugarcane Waste": 1.5,
    "Rice Husk": 2.8,
    "Animal Manure": 2.0,
  };
  let price = base[input.wasteType] ?? 2;
  // moisture coefficient
  price += (15 - input.moisture) * 0.012;
  // volume premium
  price += Math.min(input.quantity, 50) * 0.004;
  if (input.season === "Peak harvest") price *= 0.92;
  if (input.season === "Off-season scarcity") price *= 1.15;
  if (input.region === "Punjab / Haryana") price *= 0.95;
  if (input.region === "Tamil Nadu") price *= 1.02;
  return Math.max(0.5, Math.round(price * 100) / 100);
}

export type PricePrediction = {
  low: number;
  mid: number;
  high: number;
  confidence: number;
  demand: string;
  reasoning: string;
  source: "groq" | "regression";
};

export async function predictPriceWithAI(input: {
  wasteType: string;
  quantity: number;
  moisture: number;
  region: string;
  season: string;
}): Promise<PricePrediction> {
  const mid = regressPrice(input);
  const fallback: PricePrediction = {
    low: Math.round(mid * 0.9 * 100) / 100,
    mid,
    high: Math.round(mid * 1.12 * 100) / 100,
    confidence: input.moisture < 20 && input.quantity >= 5 ? 82 : 70,
    demand: mid > 2.5 ? "High" : mid > 1.5 ? "Moderate" : "Soft",
    reasoning: `Linear regression baseline for ${input.wasteType} at ${input.moisture}% moisture in ${input.region} (${input.season}).`,
    source: "regression",
  };

  if (!groq) return fallback;

  try {
    const completion = await groq.chat.completions.create({
      model,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an agricultural waste market analyst for India.
Return ONLY valid JSON with keys:
low (number ₹/kg), mid (number ₹/kg), high (number ₹/kg),
confidence (0-100 integer), demand ("High"|"Moderate"|"Soft"),
reasoning (short string, max 2 sentences).
Base mid near ${mid} ₹/kg unless market factors justify a clear shift.
Prices in INR per kg for farm-gate agri-waste.`,
        },
        {
          role: "user",
          content: JSON.stringify(input),
        },
      ],
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) return fallback;

    const parsed = JSON.parse(text) as Partial<PricePrediction>;
    return {
      low: Number(parsed.low) || fallback.low,
      mid: Number(parsed.mid) || fallback.mid,
      high: Number(parsed.high) || fallback.high,
      confidence: Math.min(99, Math.max(50, Number(parsed.confidence) || fallback.confidence)),
      demand: parsed.demand || fallback.demand,
      reasoning: parsed.reasoning || fallback.reasoning,
      source: "groq",
    };
  } catch {
    return fallback;
  }
}

export async function estimateQuantityWithAI(input: {
  wasteType: string;
  crop: string;
  acres: number;
  yieldPerAcre: number;
  moisture: number;
  purity: number;
}): Promise<{ tonnes: number; notes: string }> {
  const residueRatio: Record<string, number> = {
    Paddy: 1.2,
    Wheat: 1.0,
    Sugarcane: 0.3,
    Banana: 0.8,
    Coconut: 0.25,
    Mixed: 0.9,
  };
  const ratio = residueRatio[input.crop] ?? 1;
  let tonnes =
    Math.round(input.acres * input.yieldPerAcre * ratio * 10) / 10;

  if (!groq) {
    return {
      tonnes,
      notes: `Estimated from ${input.crop} residue ratio ${ratio}× yield.`,
    };
  }

  try {
    const completion = await groq.chat.completions.create({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Estimate saleable agricultural waste volume in tonnes for Indian farms.
Return JSON: { "tonnes": number, "notes": string }.
Heuristic baseline is ${tonnes} tonnes — refine slightly if justified.`,
        },
        {
          role: "user",
          content: JSON.stringify(input),
        },
      ],
    });
    const text = completion.choices[0]?.message?.content;
    if (!text) {
      return {
        tonnes,
        notes: `Estimated from ${input.crop} residue ratio ${ratio}× yield.`,
      };
    }
    const parsed = JSON.parse(text) as { tonnes?: number; notes?: string };
    return {
      tonnes: Number(parsed.tonnes) || tonnes,
      notes:
        parsed.notes ||
        `Estimated from ${input.crop} residue ratio ${ratio}× yield.`,
    };
  } catch {
    return {
      tonnes,
      notes: `Estimated from ${input.crop} residue ratio ${ratio}× yield.`,
    };
  }
}
