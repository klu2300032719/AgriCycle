"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Leaf,
  ShieldCheck,
  Sparkles,
  Truck,
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
      <div className="relative overflow-hidden bg-white">
        <Section className="relative pb-16 pt-14 sm:pb-24 sm:pt-20 lg:pt-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="relative z-10 max-w-xl"
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
                AgriCycle connects farmers selling crop residue, banana stems,
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

            {/* Hero image — foreground, not background */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.15, ease: easeOut }}
              className="relative mx-auto w-full max-w-lg lg:max-w-none"
            >
              <div className="relative aspect-[4/5] w-full sm:aspect-[5/6] lg:aspect-[4/5]">
                <Image
                  src="/gardener-hero.jpg"
                  alt="The Gardener — illustration of tending the land"
                  fill
                  priority
                  className="object-contain object-center drop-shadow-none"
                  sizes="(max-width: 1024px) 90vw, 48vw"
                />
              </div>
            </motion.div>
          </div>
        </Section>

        {/* Marquee */}
        <div className="relative border-y border-border bg-white py-4">
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

      {/* Problem / Solution / Care — each illustration once, transparent bg */}
      <Section className="pb-16 sm:pb-20">
        <div className="grid gap-5 lg:grid-cols-3">
          <Reveal>
            <Card
              hover={false}
              className="flex h-full flex-col overflow-hidden border-border bg-white !p-0"
            >
              <div className="relative flex h-56 w-full items-center justify-center bg-transparent px-4 pt-6 sm:h-64">
                <Image
                  src="/illust-farmer.png"
                  alt="Farmer carrying a basket of harvest"
                  width={400}
                  height={560}
                  className="mx-auto h-full w-auto max-h-56 max-w-full object-contain sm:max-h-60"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                />
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <Badge variant="outline">The problem</Badge>
                <h3 className="mt-4 text-lg font-bold text-foreground sm:text-xl">
                  Residue goes up in smoke
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  No easy market means stubble burning, dumped waste, and money
                  left on the field.
                </p>
                <ul className="mt-5 space-y-2.5 text-sm text-muted">
                  {[
                    "Stubble burning & dumping",
                    "No local buyer discovery",
                    "Uncertain prices & transport",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-[10px] text-red-500">
                        ✕
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.08}>
            <Card
              hover={false}
              className="flex h-full flex-col overflow-hidden border-green/25 bg-white !p-0"
            >
              <div className="relative flex h-56 w-full items-center justify-center bg-transparent px-4 pt-6 sm:h-64">
                <Image
                  src="/illust-harvest.png"
                  alt="Harvest carried to market"
                  width={400}
                  height={400}
                  className="mx-auto h-full w-auto max-h-56 max-w-full object-contain sm:max-h-60"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <Badge variant="green">The solution</Badge>
                <h3 className="mt-4 text-lg font-bold text-foreground sm:text-xl">
                  A farm waste exchange
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  List waste, get AI price guidance, match buyers, book
                  transport, and track payments.
                </p>
                <ul className="mt-5 space-y-2.5 text-sm text-muted">
                  {[
                    "Sell residue instead of burning",
                    "Fair AI-assisted rates",
                    "Logistics + payout tracking",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green text-[10px] text-white">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.16}>
            <Card
              hover={false}
              className="flex h-full flex-col overflow-hidden border-border bg-white !p-0"
            >
              <div className="relative flex h-56 w-full items-center justify-center bg-transparent px-4 pt-6 sm:h-64">
                <Image
                  src="/illust-garden.png"
                  alt="Tending plants and growing value from the land"
                  width={360}
                  height={560}
                  className="mx-auto h-full w-auto max-h-56 max-w-full object-contain sm:max-h-60"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <Badge variant="default">The impact</Badge>
                <h3 className="mt-4 text-lg font-bold text-foreground sm:text-xl">
                  Grow income, not smoke
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Turn leftover biomass into feedstock for industry — cleaner
                  air, circular farms, extra rural income.
                </p>
                <ul className="mt-5 space-y-2.5 text-sm text-muted">
                  {[
                    "Less open burning",
                    "Circular agri-economy",
                    "Extra farmer earnings",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-dim text-[10px] font-bold text-green">
                        ·
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
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
            subtitle="From field leftovers to animal manure — if industry can use it, AgriCycle can move it."
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
                Why AgriCycle is unique
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
                  View analytics
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
            <div className="pointer-events-none absolute inset-0 opacity-40">
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
