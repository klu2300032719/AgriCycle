"use client";

import { useEffect, useState } from "react";
import { Calculator, CheckCircle2, Leaf, Loader2 } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  GradeBadge,
  Input,
  Section,
  SectionHeading,
  Select,
} from "@/components/ui";
import PageShell from "@/components/PageShell";
import { motion } from "framer-motion";
import { easeOut } from "@/components/motion";
import type { Grade } from "@/lib/types";

type Estimate = {
  tonnes: number;
  grade: Grade;
  unit: number;
  total: number;
  notes?: string;
};

export default function SellPage() {
  const [wasteType, setWasteType] = useState("Crop Residue");
  const [crop, setCrop] = useState("Paddy");
  const [acres, setAcres] = useState("5");
  const [yieldPerAcre, setYieldPerAcre] = useState("2.5");
  const [moisture, setMoisture] = useState("14");
  const [purity, setPurity] = useState("90");
  const [location, setLocation] = useState("Thanjavur, Tamil Nadu");
  const [notes, setNotes] = useState("");
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(async () => {
      setEstimating(true);
      try {
        const res = await fetch("/api/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wasteType,
            crop,
            acres: Number(acres),
            yieldPerAcre: Number(yieldPerAcre),
            moisture: Number(moisture),
            purity: Number(purity),
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setEstimate({
            tonnes: data.tonnes,
            grade: data.grade,
            unit: data.unit,
            total: data.total,
            notes: data.notes,
          });
        }
      } catch {
        /* keep last estimate */
      } finally {
        setEstimating(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [wasteType, crop, acres, yieldPerAcre, moisture, purity]);

  async function publish() {
    if (!estimate) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wasteType,
          crop,
          acres: Number(acres),
          yieldPerAcre: Number(yieldPerAcre),
          moisture: Number(moisture),
          purity: Number(purity),
          location,
          notes,
          quantity: estimate.tonnes,
          pricePerUnit: estimate.unit,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publish failed");
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to publish");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted && estimate) {
    return (
      <PageShell className="pb-20 pt-16">
        <Section>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            <Card
              hover={false}
              className="mx-auto max-w-lg border-green/30 py-12 text-center shadow-[var(--shadow-lift)]"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 16,
                  delay: 0.1,
                }}
              >
                <CheckCircle2 className="mx-auto h-14 w-14 text-green" />
              </motion.div>
              <h2 className="mt-4 font-serif text-2xl text-foreground">
                Listing submitted
              </h2>
              <p className="mt-2 text-sm text-muted">
                Your {estimate.tonnes}t of {wasteType} (Grade {estimate.grade})
                is live on the marketplace. Nearby buyers will be notified.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a href="/marketplace" className="btn-primary">
                  View marketplace
                </a>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="btn-ghost"
                >
                  List another
                </button>
              </div>
            </Card>
          </motion.div>
        </Section>
      </PageShell>
    );
  }

  const e = estimate || {
    tonnes: 0,
    grade: "B" as Grade,
    unit: 0,
    total: 0,
  };

  return (
    <PageShell className="relative pb-20 pt-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-radial-green" />
      <Section className="relative">
        <SectionHeading
          eyebrow="List waste"
          title="Estimate quantity & list for sale"
          subtitle="Tell us about your field leftovers. We estimate saleable volume, grade quality, and suggest a list price."
        />

        <div className="grid gap-6 lg:grid-cols-5">
          <Card hover={false} className="space-y-4 lg:col-span-3">
            <h3 className="flex items-center gap-2 font-semibold text-foreground">
              <Leaf className="h-5 w-5 text-green" />
              Waste details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Waste type"
                id="wasteType"
                value={wasteType}
                onChange={setWasteType}
                options={[
                  { value: "Crop Residue", label: "Crop Residue" },
                  { value: "Banana Stems", label: "Banana Stems" },
                  { value: "Coconut Shells", label: "Coconut Shells" },
                  { value: "Sugarcane Waste", label: "Sugarcane Waste" },
                  { value: "Rice Husk", label: "Rice Husk" },
                  { value: "Animal Manure", label: "Animal Manure" },
                ]}
              />
              <Select
                label="Primary crop / source"
                id="crop"
                value={crop}
                onChange={setCrop}
                options={[
                  { value: "Paddy", label: "Paddy" },
                  { value: "Wheat", label: "Wheat" },
                  { value: "Sugarcane", label: "Sugarcane" },
                  { value: "Banana", label: "Banana" },
                  { value: "Coconut", label: "Coconut" },
                  { value: "Mixed", label: "Mixed / Other" },
                ]}
              />
              <Input
                label="Field area (acres)"
                id="acres"
                type="number"
                min={0.1}
                step={0.1}
                value={acres}
                onChange={setAcres}
              />
              <Input
                label="Est. crop yield (t/acre)"
                id="yield"
                type="number"
                min={0.1}
                step={0.1}
                value={yieldPerAcre}
                onChange={setYieldPerAcre}
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
              <Input
                label="Purity / cleanliness %"
                id="purity"
                type="number"
                min={0}
                max={100}
                value={purity}
                onChange={setPurity}
              />
            </div>
            <Input
              label="Location"
              id="location"
              value={location}
              onChange={setLocation}
            />
            <div>
              <label
                htmlFor="notes"
                className="mb-1.5 block text-xs font-medium text-muted"
              >
                Notes for buyers (optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(ev) => setNotes(ev.target.value)}
                placeholder="e.g. baled, covered storage, ready for pickup…"
                className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted/60 focus:border-green/50 focus:ring-1 focus:ring-green/30"
              />
            </div>
          </Card>

          <div className="space-y-4 lg:col-span-2">
            <Card
              hover={false}
              className="border-green/25 bg-gradient-to-br from-green-dim via-white to-white shadow-[var(--shadow-soft)]"
            >
              <h3 className="flex items-center gap-2 font-bold text-foreground">
                <Calculator className="h-5 w-5 text-green" />
                Quantity & quality
                {estimating && (
                  <Loader2 className="ml-auto h-4 w-4 animate-spin text-green" />
                )}
              </h3>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">
                    Estimated saleable volume
                  </p>
                  <motion.p
                    key={e.tonnes}
                    initial={{ opacity: 0.4, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 font-serif text-3xl text-foreground"
                  >
                    {e.tonnes}{" "}
                    <span className="text-lg font-medium text-muted">
                      tonnes
                    </span>
                  </motion.p>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">
                      Quality grade
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <GradeBadge grade={e.grade} />
                      <span className="text-sm text-foreground">
                        Grade {e.grade}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-white/90 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Suggested price</span>
                    <span className="font-medium text-green">
                      ₹{e.unit.toLocaleString()}/t
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-muted">Potential earnings</span>
                    <span className="font-bold text-foreground">
                      ₹{e.total.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Moisture {moisture}%</Badge>
                  <Badge variant="outline">Purity {purity}%</Badge>
                  <Badge variant="green">{wasteType}</Badge>
                </div>
                {estimate?.notes && (
                  <p className="text-xs leading-relaxed text-muted">
                    {estimate.notes}
                  </p>
                )}
              </div>
            </Card>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <Button
              className="w-full"
              onClick={publish}
              disabled={submitting || !estimate}
            >
              {submitting ? "Publishing…" : "Publish listing"}
            </Button>
            <p className="text-center text-xs text-muted">
              Saves to Neon Postgres · grading via AI classification model
            </p>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
