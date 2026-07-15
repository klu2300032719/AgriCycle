"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Leaf,
  MapPin,
  Recycle,
  ShieldCheck,
  Sparkles,
  Truck,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  Badge,
  Card,
  Section,
  SectionHeading,
  StatCard,
} from "@/components/ui";
import {
  Reveal,
  RevealItem,
  RevealStagger,
  easeOut,
  fadeUp,
  stagger,
} from "@/components/motion";
import {
  buyerTypes,
  features,
  stats,
  wasteTypes,
} from "@/data/mock";

const marqueeItems = [
  "Crop Residue",
  "Banana Stems",
  "Coconut Shells",
  "Sugarcane Waste",
  "Rice Husk",
  "Animal Manure",
  "Biofuel Feedstock",
  "Mushroom Substrate",
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-mesh">
        <div className="pointer-events-none absolute inset-0 bg-grid" />
        <div className="orb orb-green -left-20 top-10 h-72 w-72 opacity-60" />
        <div
          className="orb orb-lime right-0 top-40 h-64 w-64 opacity-50"
          style={{ animationDelay: "-4s" }}
        />

        <Section className="relative pb-16 pt-14 sm:pb-24 sm:pt-20 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="relative z-10"
            >
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-green shadow-sm backdrop-blur">
                  <span className="live-dot" />
                  Live marketplace · AI-powered rates
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mt-6 font-serif text-4xl tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]"
              >
                Farm waste is not trash —{" "}
                <span className="text-gradient-green">it&apos;s a market.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
              >
                AgriWasteX connects farmers selling crop residue, banana stems,
                coconut shells, rice husk and manure with mushroom farms,
                biofuel plants, compost makers, and paper industries.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Link href="/sell" className="btn-primary">
                  List your waste
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/marketplace" className="btn-ghost">
                  Browse marketplace
                </Link>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted"
              >
                {[
                  { icon: ShieldCheck, label: "Verified buyers" },
                  { icon: Brain, label: "AI price guidance" },
                  { icon: Truck, label: "Doorstep logistics" },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-dim text-green">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    {label}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero visual */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-green/15 via-transparent to-green/5 blur-2xl" />

              <motion.div
                initial={{ opacity: 0, y: 40, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
                className="relative space-y-3"
              >
                <motion.div
                  className="animate-float shine-border rounded-2xl border border-green/15 bg-white/90 p-5 shadow-[var(--shadow-lift)] backdrop-blur-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="live-dot" />
                        <p className="text-xs font-medium text-muted">
                          Live listing
                        </p>
                      </div>
                      <p className="mt-2 text-lg font-bold text-foreground">
                        Rice Husk · 12 tonnes
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        Thanjavur · Grade A · 8% moisture
                      </p>
                    </div>
                    <Badge variant="green">₹3,200/t</Badge>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-green" /> 18 km away
                    </span>
                    <span className="font-medium text-green">
                      3 buyers interested
                    </span>
                  </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45, duration: 0.55, ease: easeOut }}
                    className="animate-float-slow rounded-2xl border border-border bg-white p-4 shadow-[var(--shadow-soft)]"
                  >
                    <TrendingUp className="h-5 w-5 text-green" />
                    <p className="mt-3 text-2xl font-bold text-foreground">
                      +24%
                    </p>
                    <p className="text-xs text-muted">Price vs last season</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55, duration: 0.55, ease: easeOut }}
                    className="rounded-2xl border border-border bg-white p-4 shadow-[var(--shadow-soft)]"
                    style={{ animationDelay: "-2s" }}
                  >
                    <Recycle className="h-5 w-5 text-green" />
                    <p className="mt-3 text-2xl font-bold text-foreground">
                      2.4 t
                    </p>
                    <p className="text-xs text-muted">CO₂ saved this week</p>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.55, ease: easeOut }}
                  className="rounded-2xl border border-green/25 bg-gradient-to-r from-green-dim to-white p-4 shadow-[var(--shadow-soft)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green text-white shadow-lg shadow-green/30">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        AI suggests: sell rice husk now
                      </p>
                      <p className="text-xs text-muted">
                        Peak demand from biofuel plants this week
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* Marquee */}
        <div className="relative border-y border-border/80 bg-white/60 py-4 backdrop-blur">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />
          <div className="flex overflow-hidden">
            <div className="animate-marquee flex min-w-full shrink-0 items-center gap-8 pr-8">
              {[...marqueeItems, ...marqueeItems].map((item, i) => (
                <span
                  key={item + i}
                  className="flex shrink-0 items-center gap-2 text-sm font-medium text-muted"
                >
                  <Leaf className="h-3.5 w-3.5 text-green" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <Section className="py-16 sm:py-20">
        <RevealStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <RevealItem key={s.label}>
              <StatCard label={s.label} value={s.value} />
            </RevealItem>
          ))}
        </RevealStagger>
      </Section>

      {/* Problem / Solution */}
      <Section className="pb-16 sm:pb-20">
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <Card
              hover={false}
              className="h-full overflow-hidden bg-gradient-to-br from-white to-surface"
            >
              <Badge variant="outline">The problem</Badge>
              <h3 className="mt-4 text-xl font-bold text-foreground sm:text-2xl">
                Every season, residue goes up in smoke
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                Farmers burn crop residue or dump organic waste because there is
                no easy market. That poisons air quality, wastes nutrients, and
                leaves money on the field.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted">
                {[
                  "Stubble burning & illegal dumping",
                  "No local buyer discovery",
                  "Uncertain prices & transport costs",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs text-red-500">
                      ✕
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
          <Reveal delay={0.12}>
            <Card
              hover={false}
              className="h-full overflow-hidden border-green/25 bg-gradient-to-br from-green-dim via-white to-white"
            >
              <Badge variant="green">The solution</Badge>
              <h3 className="mt-4 text-xl font-bold text-foreground sm:text-2xl">
                A dedicated exchange for agricultural waste
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                List waste in minutes, get AI price guidance, match with nearby
                industrial buyers, book transport, grade quality, and track
                payments — all in one platform built for farms.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted">
                {[
                  "Sell residue instead of burning it",
                  "Fair rates powered by AI & demand",
                  "Logistics + payments + analytics",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green text-xs text-white">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* Waste catalog */}
      <Section className="pb-16 sm:pb-20">
        <Reveal>
          <SectionHeading
            eyebrow="Waste catalog"
            title="What farmers can sell"
            subtitle="From field leftovers to animal manure — if industry can use it, AgriWasteX can move it."
          />
        </Reveal>
        <RevealStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wasteTypes.map((w) => (
            <RevealItem key={w.name}>
              <Card className="group h-full">
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-2xl transition group-hover:scale-110 group-hover:bg-green-dim">
                    {w.icon}
                  </span>
                  <Badge variant="green">{w.avgPrice}</Badge>
                </div>
                <h3 className="mt-4 font-bold text-foreground">{w.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {w.description}
                </p>
              </Card>
            </RevealItem>
          ))}
        </RevealStagger>
      </Section>

      {/* Buyers */}
      <Section className="pb-16 sm:pb-20">
        <Reveal>
          <SectionHeading
            eyebrow="Demand side"
            title="Who buys farm waste"
            subtitle="Industries that turn organic waste into value — energy, food, packaging, and fertilizer."
          />
        </Reveal>
        <RevealStagger
          fast
          className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        >
          {buyerTypes.map((b) => (
            <RevealItem key={b.name}>
              <Card className="h-full text-center sm:text-left">
                <span className="text-2xl sm:text-3xl" aria-hidden>
                  {b.icon}
                </span>
                <h3 className="mt-3 text-sm font-bold text-foreground">
                  {b.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {b.needs}
                </p>
              </Card>
            </RevealItem>
          ))}
        </RevealStagger>
        <Reveal delay={0.15} className="mt-6">
          <Link
            href="/buyers"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-green transition hover:gap-2.5"
          >
            Explore nearby buyers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </Section>

      {/* Features */}
      <div className="relative overflow-hidden bg-surface py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
        <Section className="relative" id="features">
          <Reveal>
            <SectionHeading
              eyebrow="Platform features"
              title="Everything from listing to payout"
              subtitle="Built specifically for agricultural waste — not a generic marketplace bolted onto farms."
            />
          </Reveal>
          <RevealStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <RevealItem key={f.title}>
                <Link href={f.href} className="block h-full">
                  <Card className="group relative h-full overflow-hidden">
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-green/5 transition group-hover:bg-green/10" />
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green to-green-dark text-xs font-bold text-white shadow-md shadow-green/25">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="font-bold text-foreground">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {f.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-green transition group-hover:gap-2">
                      Open tool <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Card>
                </Link>
              </RevealItem>
            ))}
          </RevealStagger>
        </Section>
      </div>

      {/* Why unique */}
      <Section className="py-16 sm:py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-green/20 bg-gradient-to-br from-green-dim via-white to-surface p-8 shadow-[var(--shadow-soft)] sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-green/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-green/5 blur-2xl" />
            <div className="relative max-w-2xl">
              <Badge variant="green">
                <Sparkles className="mr-1.5 inline h-3 w-3" />
                Why AgriWasteX is unique
              </Badge>
              <h2 className="mt-5 font-serif text-2xl tracking-tight text-foreground sm:text-3xl md:text-4xl">
                Almost nobody builds software just for farm waste — yet
                investment in reducing agri-waste is surging.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                Generic classifieds ignore moisture grades, seasonal demand, and
                bulk logistics. We treat residue as a first-class commodity with
                AI pricing, quality scoring, and industrial buyer networks.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/dashboard" className="btn-primary">
                  View analytics demo
                </Link>
                <Link href="/price-predict" className="btn-ghost">
                  Try AI pricing
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Final CTA */}
      <Section className="pb-20 sm:pb-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-foreground px-6 py-14 text-center text-white sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute inset-0 opacity-30">
              <div className="absolute left-1/4 top-0 h-40 w-40 rounded-full bg-green blur-3xl" />
              <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-green-light blur-3xl" />
            </div>
            <Leaf className="relative mx-auto h-10 w-10 text-green-light" />
            <h2 className="relative mt-5 font-serif text-2xl tracking-tight sm:text-3xl md:text-4xl">
              Ready to monetize your next harvest leftovers?
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-sm text-white/70 sm:text-base">
              Create a listing in under two minutes. Get matched with buyers,
              book transport, and track payments.
            </p>
            <Link
              href="/sell"
              className="btn-primary relative mt-8 !bg-white !text-foreground hover:!shadow-xl"
            >
              Start selling waste
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
