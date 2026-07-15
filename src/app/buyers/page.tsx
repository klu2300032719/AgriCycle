"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Loader2, MapPin, Star } from "lucide-react";
import {
  Badge,
  Card,
  Section,
  SectionHeading,
  Select,
} from "@/components/ui";
import PageShell from "@/components/PageShell";
import { easeOut } from "@/components/motion";
import type { Buyer } from "@/lib/types";

export default function BuyersPage() {
  const [radius, setRadius] = useState("100");
  const [type, setType] = useState("All");
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ radius, type });
      const res = await fetch(`/api/buyers?${params}`);
      const data = await res.json();
      setBuyers(data.buyers || []);
    } catch {
      setBuyers([]);
    } finally {
      setLoading(false);
    }
  }, [radius, type]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <PageShell className="relative pb-20 pt-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-radial-green" />
      <Section className="relative">
        <SectionHeading
          eyebrow="Nearby buyers"
          title="Industrial demand near your farm"
          subtitle="Verified mushroom farms, biofuel companies, compost manufacturers, paper mills, and dairy hubs looking for feedstock."
        />

        <div className="mb-8 grid gap-4 rounded-2xl border border-border bg-white/90 p-4 shadow-[var(--shadow-soft)] backdrop-blur sm:grid-cols-2 sm:p-5">
          <Select
            label="Search radius"
            id="radius"
            value={radius}
            onChange={setRadius}
            options={[
              { value: "25", label: "Within 25 km" },
              { value: "50", label: "Within 50 km" },
              { value: "100", label: "Within 100 km" },
              { value: "200", label: "Within 200 km" },
            ]}
          />
          <Select
            label="Buyer type"
            id="type"
            value={type}
            onChange={setType}
            options={[
              { value: "All", label: "All types" },
              { value: "Mushroom Farm", label: "Mushroom Farm" },
              { value: "Biofuel Company", label: "Biofuel Company" },
              { value: "Compost Manufacturer", label: "Compost Manufacturer" },
              { value: "Paper Industry", label: "Paper Industry" },
              { value: "Dairy Farm", label: "Dairy Farm" },
            ]}
          />
        </div>

        {loading && (
          <p className="mb-4 flex items-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin text-green" />
            Loading buyers…
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {buyers.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: easeOut }}
            >
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {b.name}
                      </h3>
                      {b.verified && (
                        <span className="inline-flex items-center gap-1 text-xs text-green">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted">{b.type}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg bg-surface px-2 py-1 text-sm text-foreground">
                    <Star className="h-3.5 w-3.5 fill-green text-green" />
                    {b.rating}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-green" />
                    {b.location} · {b.distanceKm} km
                  </span>
                  <Badge variant="outline">{b.rateRange}</Badge>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-xs uppercase tracking-wider text-muted">
                    Looking for
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(b.lookingFor || []).map((w) => (
                      <Badge key={w} variant="green">
                        {w}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    className="btn-primary flex-1 !rounded-xl"
                  >
                    Send offer
                  </button>
                  <button
                    type="button"
                    className="btn-ghost !rounded-xl !px-4"
                  >
                    Profile
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {!loading && buyers.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-surface/50 py-16 text-center">
            <p className="font-medium text-foreground">
              No buyers in this radius
            </p>
            <p className="mt-1 text-sm text-muted">
              Expand the search radius or change buyer type
            </p>
          </div>
        )}
      </Section>
    </PageShell>
  );
}
