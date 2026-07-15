"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, Loader2, MapPin, Search } from "lucide-react";
import {
  Badge,
  Card,
  GradeBadge,
  Section,
  SectionHeading,
} from "@/components/ui";
import PageShell from "@/components/PageShell";
import { easeOut } from "@/components/motion";
import type { Grade, Listing, WasteType } from "@/lib/types";

const wasteFilters: Array<"All" | WasteType> = [
  "All",
  "Crop Residue",
  "Banana Stems",
  "Coconut Shells",
  "Sugarcane Waste",
  "Rice Husk",
  "Animal Manure",
];

const gradeFilters: Array<"All" | Grade> = ["All", "A", "B", "C"];

export default function MarketplacePage() {
  const [query, setQuery] = useState("");
  const [waste, setWaste] = useState<"All" | WasteType>("All");
  const [grade, setGrade] = useState<"All" | Grade>("All");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (waste !== "All") params.set("waste", waste);
      if (grade !== "All") params.set("grade", grade);
      const res = await fetch(`/api/listings?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setListings(data.listings || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load listings");
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [query, waste, grade]);

  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <PageShell className="relative pb-20 pt-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-radial-green" />
      <Section className="relative">
        <SectionHeading
          eyebrow="Marketplace"
          title="Live waste listings"
          subtitle="Browse graded agricultural waste near you. Filter by type, quality, and location."
        />

        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-white/90 p-4 shadow-[var(--shadow-soft)] backdrop-blur sm:p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by crop, location, or seller…"
              className="w-full rounded-xl border border-border bg-white py-3 pl-11 pr-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted/50 focus:border-green/50 focus:ring-2 focus:ring-green/15"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted" />
            {wasteFilters.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWaste(w)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition active:scale-95 ${
                  waste === w
                    ? "bg-green text-white shadow-md shadow-green/25"
                    : "bg-surface text-muted hover:text-foreground"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted">Grade:</span>
            {gradeFilters.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition active:scale-95 ${
                  grade === g
                    ? "bg-foreground text-white shadow-md"
                    : "bg-surface text-muted hover:text-foreground"
                }`}
              >
                {g === "All" ? "All grades" : `Grade ${g}`}
              </button>
            ))}
          </div>
        </div>

        <p className="mb-4 flex items-center gap-2 text-sm text-muted">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-green" />
              Loading listings…
            </>
          ) : (
            <>
              Showing{" "}
              <span className="font-medium text-foreground">
                {listings.length}
              </span>{" "}
              listing{listings.length !== 1 ? "s" : ""}
            </>
          )}
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {listings.map((l, i) => (
              <motion.div
                key={l.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.35,
                  delay: Math.min(i * 0.04, 0.2),
                  ease: easeOut,
                }}
              >
                <Card className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="green">{l.wasteType}</Badge>
                        <Badge
                          variant={
                            l.status === "available"
                              ? "default"
                              : l.status === "reserved"
                                ? "warn"
                                : "muted"
                          }
                        >
                          {l.status}
                        </Badge>
                      </div>
                      <h3 className="mt-3 font-semibold leading-snug text-foreground">
                        {l.title}
                      </h3>
                    </div>
                    <GradeBadge grade={l.grade as Grade} />
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm text-muted">
                    {l.description}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-surface px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wider text-muted">
                        Quantity
                      </p>
                      <p className="font-medium text-foreground">
                        {l.quantity} {l.unit}
                      </p>
                    </div>
                    <div className="rounded-lg bg-surface px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wider text-muted">
                        Price
                      </p>
                      <p className="font-medium text-green">
                        ₹{l.pricePerUnit.toLocaleString()}/
                        {l.unit?.slice(0, -1) || "t"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-surface px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wider text-muted">
                        Moisture
                      </p>
                      <p className="font-medium text-foreground">
                        {l.moisture}%
                      </p>
                    </div>
                    <div className="rounded-lg bg-surface px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wider text-muted">
                        Seller
                      </p>
                      <p className="truncate font-medium text-foreground">
                        {l.seller}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-green" />
                      {l.location} · {l.distanceKm} km
                    </span>
                    <span>{l.postedAt}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-primary mt-3 w-full !rounded-xl disabled:opacity-40"
                    disabled={l.status !== "available"}
                  >
                    {l.status === "available"
                      ? "Contact seller"
                      : "Unavailable"}
                  </button>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!loading && listings.length === 0 && !error && (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface/50 py-16 text-center">
            <p className="font-medium text-foreground">
              No listings match your filters
            </p>
            <p className="mt-1 text-sm text-muted">
              Try another waste type or clear the search
            </p>
          </div>
        )}
      </Section>
    </PageShell>
  );
}
