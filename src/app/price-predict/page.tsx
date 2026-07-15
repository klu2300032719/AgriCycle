"use client";

import { useState } from "react";
import { Brain, Info, Loader2, TrendingUp } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Input,
  Section,
  SectionHeading,
  Select,
  StatCard,
} from "@/components/ui";
import PageShell from "@/components/PageShell";
import { motion, AnimatePresence } from "framer-motion";
import { easeOut } from "@/components/motion";
import { wasteTypes } from "@/data/mock";
import type { PricePoint } from "@/lib/types";

type Result = {
  low: number;
  mid: number;
  high: number;
  confidence: number;
  demand: string;
  reasoning?: string;
  source?: string;
  history?: PricePoint[];
};

export default function PricePredictPage() {
  const [wasteType, setWasteType] = useState("Rice Husk");
  const [quantity, setQuantity] = useState("10");
  const [moisture, setMoisture] = useState("12");
  const [region, setRegion] = useState("Tamil Nadu");
  const [season, setSeason] = useState("Monsoon exit");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function predict() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/price-predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wasteType,
          quantity: Number(quantity),
          moisture: Number(moisture),
          region,
          season,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Prediction failed");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Prediction failed");
    } finally {
      setLoading(false);
    }
  }

  const history = result?.history || [];
  const maxPrice = Math.max(...history.map((p) => p.price), 1);

  return (
    <PageShell className="relative pb-20 pt-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-radial-green" />
      <Section className="relative">
        <SectionHeading
          eyebrow="AI price prediction"
          title="Know your waste’s market value"
          subtitle="Estimate fair rates from waste type, moisture, volume, region, and seasonal demand — powered by Groq + regression models."
        />

        <div className="grid gap-6 lg:grid-cols-5">
          <Card hover={false} className="lg:col-span-2">
            <div className="mb-5 flex items-center gap-2">
              <Brain className="h-5 w-5 text-green" />
              <h3 className="font-semibold text-foreground">Input factors</h3>
            </div>
            <div className="space-y-4">
              <Select
                label="Waste type"
                id="waste"
                value={wasteType}
                onChange={setWasteType}
                options={wasteTypes.map((w) => ({
                  value: w.name,
                  label: w.name,
                }))}
              />
              <Input
                label="Quantity (tonnes)"
                id="qty"
                type="number"
                min={0.1}
                step={0.1}
                value={quantity}
                onChange={setQuantity}
              />
              <Input
                label="Moisture %"
                id="moisture"
                type="number"
                min={0}
                max={100}
                value={moisture}
                onChange={setMoisture}
              />
              <Select
                label="Region"
                id="region"
                value={region}
                onChange={setRegion}
                options={[
                  { value: "Tamil Nadu", label: "Tamil Nadu" },
                  { value: "Karnataka", label: "Karnataka" },
                  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
                  { value: "Punjab / Haryana", label: "Punjab / Haryana" },
                  { value: "Maharashtra", label: "Maharashtra" },
                ]}
              />
              <Select
                label="Season context"
                id="season"
                value={season}
                onChange={setSeason}
                options={[
                  { value: "Peak harvest", label: "Peak harvest (high supply)" },
                  { value: "Monsoon exit", label: "Monsoon exit" },
                  {
                    value: "Off-season scarcity",
                    label: "Off-season scarcity",
                  },
                ]}
              />
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}
              <Button className="w-full" onClick={predict} disabled={loading}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Predicting…
                  </span>
                ) : (
                  "Predict price"
                )}
              </Button>
            </div>
          </Card>

          <div className="space-y-4 lg:col-span-3">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card
                    hover={false}
                    className="flex min-h-[280px] flex-col items-center justify-center text-center"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-dim text-green shadow-inner">
                      <TrendingUp className="h-7 w-7" />
                    </div>
                    <p className="mt-4 font-semibold text-foreground">
                      Run a prediction to see rates
                    </p>
                    <p className="mt-2 max-w-sm text-sm text-muted">
                      Fill in your waste details and we&apos;ll estimate a fair
                      price band with confidence scoring via Groq AI.
                    </p>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: easeOut }}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard
                      label="Low estimate"
                      value={`₹${result.low}/kg`}
                      hint="Conservative"
                    />
                    <StatCard
                      label="Recommended"
                      value={`₹${result.mid}/kg`}
                      hint="Best list price"
                    />
                    <StatCard
                      label="High estimate"
                      value={`₹${result.high}/kg`}
                      hint="Premium grade"
                    />
                  </div>

                  <Card hover={false} className="border-green/20">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="green">
                        Confidence {result.confidence}%
                      </Badge>
                      <Badge variant="outline">Demand: {result.demand}</Badge>
                      <Badge variant="default">{wasteType}</Badge>
                      {result.source && (
                        <Badge variant="outline">
                          via {result.source === "groq" ? "Groq AI" : "regression"}
                        </Badge>
                      )}
                    </div>
                    <h3 className="mt-4 font-serif text-lg text-foreground">
                      Suggested list: ₹
                      {(result.mid * 1000).toLocaleString()}/tonne
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {result.reasoning ||
                        `Based on ${quantity}t at ${moisture}% moisture in ${region} during ${season.toLowerCase()}.`}
                    </p>
                    <div className="mt-4 flex items-start gap-2 rounded-xl bg-green-dim p-3 text-xs font-medium text-green">
                      <Info className="mt-0.5 h-4 w-4 shrink-0" />
                      Uses GROQ_API_KEY with linear regression fallback when
                      offline.
                    </div>
                  </Card>

                  {history.length > 0 && (
                    <Card hover={false}>
                      <h3 className="mb-4 text-sm font-bold text-foreground">
                        7-month price trend (₹/kg sample)
                      </h3>
                      <div className="flex h-40 items-end gap-2">
                        {history.map((p, i) => (
                          <div
                            key={p.month}
                            className="flex flex-1 flex-col items-center gap-2"
                          >
                            <span className="text-[10px] text-muted">
                              {p.price}
                            </span>
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{
                                height: `${(p.price / maxPrice) * 100}%`,
                              }}
                              transition={{
                                delay: i * 0.05,
                                duration: 0.5,
                                ease: easeOut,
                              }}
                              className="w-full min-h-2 rounded-t-md bg-gradient-to-t from-green-dark to-green shadow-sm shadow-green/20"
                            />
                            <span className="text-[10px] text-muted">
                              {p.month}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
