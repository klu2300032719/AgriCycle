"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  Leaf,
  Loader2,
  Package,
  Wallet,
} from "lucide-react";
import {
  Badge,
  Card,
  Section,
  SectionHeading,
  StatCard,
} from "@/components/ui";
import PageShell from "@/components/PageShell";
import { Reveal, RevealItem, RevealStagger, easeOut } from "@/components/motion";
import type { PricePoint, Transaction } from "@/lib/types";

const statusStyle: Record<
  string,
  "green" | "warn" | "default" | "muted" | "outline"
> = {
  completed: "green",
  paid: "default",
  in_transit: "warn",
  pending: "outline",
};

type DashData = {
  stats: {
    totalEarned: number;
    pending: number;
    wasteSold: number;
    co2Avoided: number;
    activeListings: number;
  };
  transactions: Transaction[];
  priceHistory: PricePoint[];
  wasteMix: { name: string; pct: number; color: string }[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageShell className="pb-20 pt-16">
        <Section>
          <p className="flex items-center justify-center gap-2 text-muted">
            <Loader2 className="h-5 w-5 animate-spin text-green" />
            Loading dashboard…
          </p>
        </Section>
      </PageShell>
    );
  }

  const stats = data?.stats || {
    totalEarned: 0,
    pending: 0,
    wasteSold: 0,
    co2Avoided: 0,
    activeListings: 0,
  };
  const transactions = data?.transactions || [];
  const priceHistory = data?.priceHistory || [];
  const wasteMix = data?.wasteMix || [];
  const maxPrice = Math.max(...priceHistory.map((p) => p.price), 1);

  return (
    <PageShell className="relative pb-20 pt-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-radial-green" />
      <Section className="relative">
        <SectionHeading
          eyebrow="Analytics dashboard"
          title="Your farm waste performance"
          subtitle="Track earnings, payments, carbon impact, and what sells best — live from Neon Postgres."
        />

        <RevealStagger className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <RevealItem>
            <StatCard
              label="Gross earnings (YTD)"
              value={`₹${stats.totalEarned.toLocaleString()}`}
              hint="+18% vs last quarter"
            />
          </RevealItem>
          <RevealItem>
            <StatCard
              label="Pending payments"
              value={`₹${stats.pending.toLocaleString()}`}
              hint="Open invoices"
            />
          </RevealItem>
          <RevealItem>
            <StatCard
              label="Waste sold"
              value={`${stats.wasteSold} t`}
              hint={`${stats.activeListings} active listings`}
            />
          </RevealItem>
          <RevealItem>
            <StatCard
              label="CO₂ avoided"
              value={`${stats.co2Avoided} t`}
              hint="vs open burning"
            />
          </RevealItem>
        </RevealStagger>

        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <Card hover={false} className="h-full">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-foreground">
                    Market price index
                  </h3>
                  <p className="text-xs text-muted">
                    Blended agri-waste ₹/kg · last 7 months
                  </p>
                </div>
                <Badge variant="green">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +12%
                </Badge>
              </div>
              <div className="flex h-48 items-end gap-3">
                {priceHistory.map((p, i) => (
                  <div
                    key={p.month}
                    className="group flex flex-1 flex-col items-center gap-2"
                  >
                    <span className="text-[10px] font-medium text-muted opacity-0 transition group-hover:opacity-100">
                      ₹{p.price}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(p.price / maxPrice) * 100}%` }}
                      transition={{
                        delay: 0.2 + i * 0.06,
                        duration: 0.6,
                        ease: easeOut,
                      }}
                      className="w-full min-h-3 rounded-t-lg bg-gradient-to-t from-green-dark to-green shadow-sm shadow-green/20 transition group-hover:to-green-light"
                    />
                    <span className="text-xs text-muted">{p.month}</span>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <Card hover={false} className="h-full">
              <h3 className="font-bold text-foreground">Sales mix</h3>
              <p className="text-xs text-muted">By volume this season</p>
              <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-surface">
                {wasteMix.map((w) => (
                  <div
                    key={w.name}
                    className={`${w.color}`}
                    style={{ width: `${w.pct}%` }}
                    title={`${w.name} ${w.pct}%`}
                  />
                ))}
              </div>
              <ul className="mt-5 space-y-3">
                {wasteMix.map((w) => (
                  <li
                    key={w.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2 text-muted">
                      <span className={`h-2.5 w-2.5 rounded-full ${w.color}`} />
                      {w.name}
                    </span>
                    <span className="font-medium text-foreground">
                      {w.pct}%
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <Card hover={false}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-bold text-foreground">
                  <CreditCard className="h-5 w-5 text-green" />
                  Payment tracking
                </h3>
                <Badge variant="outline">{transactions.length} records</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                      <th className="pb-3 font-medium">ID</th>
                      <th className="pb-3 font-medium">Listing</th>
                      <th className="pb-3 font-medium">Buyer</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-border/60 last:border-0"
                      >
                        <td className="py-3 font-mono text-xs text-muted">
                          {t.id}
                        </td>
                        <td className="py-3 text-foreground">{t.listing}</td>
                        <td className="py-3 text-muted">{t.buyer}</td>
                        <td className="py-3 font-medium text-foreground">
                          ₹{t.amount.toLocaleString()}
                        </td>
                        <td className="py-3">
                          <Badge variant={statusStyle[t.status] ?? "muted"}>
                            {t.status.replace("_", " ")}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </Reveal>

          <div className="space-y-4 lg:col-span-2">
            <Reveal delay={0.08}>
              <Card hover={false}>
                <h3 className="flex items-center gap-2 font-bold text-foreground">
                  <Wallet className="h-5 w-5 text-green" />
                  Wallet snapshot
                </h3>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between rounded-lg bg-surface px-3 py-3 text-sm">
                    <span className="text-muted">Available</span>
                    <span className="font-semibold text-green">
                      ₹{stats.totalEarned.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-surface px-3 py-3 text-sm">
                    <span className="text-muted">In escrow</span>
                    <span className="font-semibold text-foreground">
                      ₹18,000
                    </span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-surface px-3 py-3 text-sm">
                    <span className="text-muted">Awaiting release</span>
                    <span className="font-semibold text-amber-700">
                      ₹{stats.pending.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>
            </Reveal>

            <Reveal delay={0.14}>
              <Card hover={false}>
                <h3 className="mb-3 font-bold text-foreground">
                  Quick insights
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-dim text-green">
                      <Leaf className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-foreground">Rice husk outperforming</p>
                      <p className="text-xs text-muted">
                        +24% rate vs crop residue this month
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-dim text-green">
                      <Package className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-foreground">
                        {stats.activeListings} active listings
                      </p>
                      <p className="text-xs text-muted">
                        Avg. response time under 6 hours
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700">
                      <ArrowDownRight className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-foreground">Bagasse supply rising</p>
                      <p className="text-xs text-muted">
                        Consider listing before peak mill season ends
                      </p>
                    </div>
                  </li>
                </ul>
              </Card>
            </Reveal>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
