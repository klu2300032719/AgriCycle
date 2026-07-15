/**
 * AgriCycle — Seed Round Investor Pitch Deck ($1M)
 * Theme: White · Black · Green (matches product UI)
 */
import pptxgen from "pptxgenjs";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "pitch");
fs.mkdirSync(outDir, { recursive: true });

const GREEN = "16A34A";
const GREEN_DARK = "15803D";
const GREEN_DIM = "E8F8EE";
const BLACK = "0A0A0A";
const MUTED = "5C6560";
const BORDER = "E8ECE9";
const WHITE = "FFFFFF";
const SURFACE = "F6F9F7";

const pres = new pptxgen();
pres.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
pres.layout = "WIDE";
pres.author = "AgriCycle";
pres.title = "AgriCycle — Seed Round $1M";
pres.subject = "Investor pitch deck";

function footer(slide, page, total = 14) {
  slide.addText("AgriCycle  ·  Confidential", {
    x: 0.5,
    y: 7.15,
    w: 6,
    h: 0.25,
    fontSize: 10,
    fontFace: "Calibri",
    color: MUTED,
    margin: 0,
  });
  slide.addText(`${page} / ${total}`, {
    x: 11.5,
    y: 7.15,
    w: 1.3,
    h: 0.25,
    fontSize: 10,
    fontFace: "Calibri",
    color: MUTED,
    align: "right",
    margin: 0,
  });
}

function accentBar(slide) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.12,
    h: 7.5,
    fill: { color: GREEN },
    line: { color: GREEN },
  });
}

function sectionLabel(slide, text, y = 0.35) {
  slide.addText(text.toUpperCase(), {
    x: 0.55,
    y,
    w: 12,
    h: 0.28,
    fontSize: 11,
    fontFace: "Calibri",
    color: GREEN,
    bold: true,
    charSpacing: 3,
    margin: 0,
  });
}

// ─── 1. Title ───────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: BLACK },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.18,
    h: 7.5,
    fill: { color: GREEN },
  });
  s.addShape(pres.shapes.OVAL, {
    x: 10.2,
    y: -1.2,
    w: 5,
    h: 5,
    fill: { color: GREEN_DARK },
    shadow: { type: "outer", color: GREEN, blur: 40, opacity: 0.35 },
  });
  s.addShape(pres.shapes.OVAL, {
    x: 11.5,
    y: 4.5,
    w: 3.5,
    h: 3.5,
    fill: { color: "14532D" },
  });

  s.addText("SEED ROUND", {
    x: 0.7,
    y: 1.6,
    w: 8,
    h: 0.35,
    fontSize: 13,
    fontFace: "Calibri",
    color: GREEN,
    bold: true,
    charSpacing: 4,
    margin: 0,
  });
  s.addText("AgriCycle", {
    x: 0.7,
    y: 2.1,
    w: 10,
    h: 1,
    fontSize: 60,
    fontFace: "Georgia",
    color: WHITE,
    margin: 0,
  });
  s.addText("The exchange layer for farm biomass.", {
    x: 0.7,
    y: 3.2,
    w: 10,
    h: 0.5,
    fontSize: 24,
    fontFace: "Georgia",
    color: "A7F3D0",
    italic: true,
    margin: 0,
  });
  s.addText(
    "Turning crop residue into a tradable commodity — for farmers, industries, and cleaner air.",
    {
      x: 0.7,
      y: 3.9,
      w: 9,
      h: 0.7,
      fontSize: 16,
      fontFace: "Calibri",
      color: "D1D5D3",
      margin: 0,
    },
  );
  s.addText("Raising $1,000,000 seed  ·  18-month runway  ·  India first", {
    x: 0.7,
    y: 5.5,
    w: 10,
    h: 0.35,
    fontSize: 14,
    fontFace: "Calibri",
    color: WHITE,
    bold: true,
    margin: 0,
  });
  s.addText("Confidential  ·  2026", {
    x: 0.7,
    y: 6.8,
    w: 6,
    h: 0.25,
    fontSize: 11,
    fontFace: "Calibri",
    color: MUTED,
    margin: 0,
  });
}

// ─── 2. Problem ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: WHITE },
  });
  accentBar(s);
  sectionLabel(s, "The problem");
  s.addText("Every season, farm waste goes up in smoke", {
    x: 0.55,
    y: 0.7,
    w: 12,
    h: 0.7,
    fontSize: 32,
    fontFace: "Georgia",
    color: BLACK,
    margin: 0,
  });

  const cards = [
    {
      t: "350–500 Mt",
      d: "Agricultural residue generated in India every year — much of it burned or dumped.",
    },
    {
      t: "Broken market",
      d: "Farmers lack buyers; mills can't source quality feedstock reliably from fragmented farms.",
    },
    {
      t: "Opaque brokers",
      d: "Cash deals, no moisture grades, no price discovery, no logistics transparency.",
    },
    {
      t: "Air & climate cost",
      d: "Stubble burning drives smog crises and wastes energy that industry is mandated to use.",
    },
  ];
  cards.forEach((c, i) => {
    const x = 0.55 + (i % 2) * 6.3;
    const y = 1.7 + Math.floor(i / 2) * 2.4;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x,
      y,
      w: 6,
      h: 2.15,
      fill: { color: SURFACE },
      line: { color: BORDER },
      rectRadius: 0.12,
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x,
      y,
      w: 0.1,
      h: 2.15,
      fill: { color: GREEN },
    });
    s.addText(c.t, {
      x: x + 0.35,
      y: y + 0.35,
      w: 5.4,
      h: 0.5,
      fontSize: 22,
      fontFace: "Georgia",
      color: BLACK,
      margin: 0,
    });
    s.addText(c.d, {
      x: x + 0.35,
      y: y + 1.0,
      w: 5.4,
      h: 0.9,
      fontSize: 14,
      fontFace: "Calibri",
      color: MUTED,
      margin: 0,
    });
  });
  footer(s, 2);
}

// ─── 3. Solution ────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: WHITE },
  });
  accentBar(s);
  sectionLabel(s, "The solution");
  s.addText("AgriCycle: the farm biomass exchange", {
    x: 0.55,
    y: 0.7,
    w: 12,
    h: 0.6,
    fontSize: 32,
    fontFace: "Georgia",
    color: BLACK,
    margin: 0,
  });
  s.addText(
    "A dedicated marketplace where farmers list residue, AI guides fair prices, industries buy graded feedstock, and logistics + escrow close the deal.",
    {
      x: 0.55,
      y: 1.4,
      w: 12,
      h: 0.7,
      fontSize: 16,
      fontFace: "Calibri",
      color: MUTED,
      margin: 0,
    },
  );

  const steps = [
    { n: "01", t: "List", d: "Estimate volume & grade waste in minutes" },
    { n: "02", t: "Price", d: "AI + market signals suggest fair bands" },
    { n: "03", t: "Match", d: "Nearby mills & farms by type & distance" },
    { n: "04", t: "Deal", d: "Offers → accept → escrow → transport" },
    { n: "05", t: "Settle", d: "Track payments, CO₂ avoided, analytics" },
  ];
  steps.forEach((st, i) => {
    const x = 0.55 + i * 2.5;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x,
      y: 2.4,
      w: 2.35,
      h: 3.6,
      fill: { color: i % 2 === 0 ? GREEN_DIM : SURFACE },
      line: { color: BORDER },
      rectRadius: 0.1,
    });
    s.addText(st.n, {
      x: x + 0.2,
      y: 2.7,
      w: 2,
      h: 0.45,
      fontSize: 20,
      fontFace: "Calibri",
      color: GREEN,
      bold: true,
      margin: 0,
    });
    s.addText(st.t, {
      x: x + 0.2,
      y: 3.4,
      w: 2,
      h: 0.5,
      fontSize: 22,
      fontFace: "Georgia",
      color: BLACK,
      margin: 0,
    });
    s.addText(st.d, {
      x: x + 0.2,
      y: 4.15,
      w: 2,
      h: 1.4,
      fontSize: 13,
      fontFace: "Calibri",
      color: MUTED,
      margin: 0,
    });
  });
  footer(s, 3);
}

// ─── 4. Product ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: WHITE },
  });
  accentBar(s);
  sectionLabel(s, "Product");
  s.addText("Built. Demoable. Extensible.", {
    x: 0.55,
    y: 0.7,
    w: 12,
    h: 0.55,
    fontSize: 32,
    fontFace: "Georgia",
    color: BLACK,
    margin: 0,
  });

  const feats = [
    ["Live marketplace", "Filterable listings by waste type, grade, location"],
    ["AI price prediction", "Groq LLM + regression fallback for ₹/kg bands"],
    ["Sell & grade", "Volume estimate + A/B/C quality scoring"],
    ["Offer pipeline", "Send → accept/reject → demo escrow → complete"],
    ["Transport booking", "Vehicle choice, distance, cost, shipment record"],
    ["Buyer matching", "Geo-aware scoring for industrial demand"],
    ["Auth & roles", "Farmer / buyer / transporter / admin"],
    ["Analytics dashboard", "Earnings, escrow, payments, mix charts"],
  ];
  feats.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.55 + col * 6.35;
    const y = 1.5 + row * 1.2;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x,
      y,
      w: 6.1,
      h: 1.05,
      fill: { color: SURFACE },
      line: { color: BORDER },
      rectRadius: 0.08,
    });
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.2,
      y: y + 0.3,
      w: 0.4,
      h: 0.4,
      fill: { color: GREEN },
    });
    s.addText(f[0], {
      x: x + 0.8,
      y: y + 0.18,
      w: 5,
      h: 0.35,
      fontSize: 15,
      fontFace: "Calibri",
      color: BLACK,
      bold: true,
      margin: 0,
    });
    s.addText(f[1], {
      x: x + 0.8,
      y: y + 0.55,
      w: 5,
      h: 0.35,
      fontSize: 13,
      fontFace: "Calibri",
      color: MUTED,
      margin: 0,
    });
  });
  footer(s, 4);
}

// ─── 5. Market ──────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: WHITE },
  });
  accentBar(s);
  sectionLabel(s, "Market opportunity");
  s.addText("A massive physical commodity with digital plumbing missing", {
    x: 0.55,
    y: 0.7,
    w: 12,
    h: 0.55,
    fontSize: 28,
    fontFace: "Georgia",
    color: BLACK,
    margin: 0,
  });

  const stats = [
    { v: "$2.5–3.5B", l: "India biomass market (2024 est.)" },
    { v: "350–500 Mt", l: "Agri residue generated yearly in India" },
    { v: "$1B+", l: "Illustrative GMV if 50 Mt trades @ ~₹2k/t" },
    { v: "3–8%", l: "Target platform take rate on GMV" },
  ];
  stats.forEach((st, i) => {
    const x = 0.55 + i * 3.15;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x,
      y: 1.6,
      w: 3,
      h: 2.4,
      fill: { color: i === 0 ? GREEN : SURFACE },
      rectRadius: 0.1,
    });
    s.addText(st.v, {
      x: x + 0.15,
      y: 2.0,
      w: 2.7,
      h: 0.7,
      fontSize: 26,
      fontFace: "Georgia",
      color: i === 0 ? WHITE : BLACK,
      align: "center",
      margin: 0,
    });
    s.addText(st.l, {
      x: x + 0.2,
      y: 2.9,
      w: 2.6,
      h: 0.8,
      fontSize: 13,
      fontFace: "Calibri",
      color: i === 0 ? "DCFCE7" : MUTED,
      align: "center",
      margin: 0,
    });
  });

  s.addText(
    "We do not need all of India. Owning dense corridors (paddy, sugar, coconut, manure) at high share + logistics/finance layers compounds to a category-defining company.",
    {
      x: 0.55,
      y: 4.4,
      w: 12.2,
      h: 0.9,
      fontSize: 15,
      fontFace: "Calibri",
      color: MUTED,
      margin: 0,
    },
  );
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.55,
    y: 5.4,
    w: 12.2,
    h: 1.2,
    fill: { color: GREEN_DIM },
    rectRadius: 0.08,
  });
  s.addText(
    "TAM: global agri-biomass & circular feedstock  ·  SAM: India solid biomass trade & logistics  ·  SOM: 2–3 state corridors in 36 months",
    {
      x: 0.8,
      y: 5.7,
      w: 11.7,
      h: 0.6,
      fontSize: 15,
      fontFace: "Calibri",
      color: BLACK,
      margin: 0,
    },
  );
  footer(s, 5);
}

// ─── 6. Why now ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: WHITE },
  });
  accentBar(s);
  sectionLabel(s, "Why now");
  s.addText("Policy, climate, and industry demand converge", {
    x: 0.55,
    y: 0.7,
    w: 12,
    h: 0.55,
    fontSize: 30,
    fontFace: "Georgia",
    color: BLACK,
    margin: 0,
  });

  const why = [
    {
      t: "Anti-burning pressure",
      d: "NCR smog politics force alternatives to open burning of paddy straw.",
    },
    {
      t: "Bioenergy mandates",
      d: "SATAT, co-firing, and renewable targets create industrial offtake for residue.",
    },
    {
      t: "ESG procurement",
      d: "Corporates need auditable supply chains and CO₂ diversion metrics.",
    },
    {
      t: "Digital rails ready",
      d: "UPI, cheap smartphones, and WhatsApp ops make rural marketplaces viable.",
    },
  ];
  why.forEach((w, i) => {
    const y = 1.55 + i * 1.2;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.55,
      y,
      w: 12.2,
      h: 1.05,
      fill: { color: SURFACE },
      rectRadius: 0.08,
    });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.75,
      y: y + 0.28,
      w: 0.5,
      h: 0.5,
      fill: { color: GREEN },
      rectRadius: 0.08,
    });
    s.addText(String(i + 1), {
      x: 0.75,
      y: y + 0.32,
      w: 0.5,
      h: 0.4,
      fontSize: 14,
      fontFace: "Calibri",
      color: WHITE,
      align: "center",
      bold: true,
      margin: 0,
    });
    s.addText(w.t, {
      x: 1.5,
      y: y + 0.15,
      w: 10.8,
      h: 0.35,
      fontSize: 16,
      fontFace: "Calibri",
      color: BLACK,
      bold: true,
      margin: 0,
    });
    s.addText(w.d, {
      x: 1.5,
      y: y + 0.52,
      w: 10.8,
      h: 0.4,
      fontSize: 14,
      fontFace: "Calibri",
      color: MUTED,
      margin: 0,
    });
  });
  footer(s, 6);
}

// ─── 7. Business model ──────────────────────────────────────
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: WHITE },
  });
  accentBar(s);
  sectionLabel(s, "Business model");
  s.addText("Multiple revenue layers on one GMV flywheel", {
    x: 0.55,
    y: 0.7,
    w: 12,
    h: 0.55,
    fontSize: 30,
    fontFace: "Georgia",
    color: BLACK,
    margin: 0,
  });

  const rev = [
    { t: "Marketplace fee", d: "2–5% of GMV on closed deals", p: "Near-term" },
    {
      t: "Buyer subscriptions",
      d: "Verified procurement seats for mills",
      p: "Near-term",
    },
    {
      t: "Logistics margin",
      d: "Transport booking & collection markup",
      p: "Year 1–2",
    },
    {
      t: "Financing spread",
      d: "Advances / invoice discounting (partnered)",
      p: "Year 2+",
    },
    {
      t: "Carbon & ESG",
      d: "Diversion certificates & reporting",
      p: "Year 2+",
    },
    {
      t: "Data / SaaS",
      d: "Price index & procurement tools",
      p: "Year 3+",
    },
  ];
  rev.forEach((r, i) => {
    const x = 0.55 + (i % 3) * 4.2;
    const y = 1.55 + Math.floor(i / 3) * 2.5;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x,
      y,
      w: 4,
      h: 2.25,
      fill: { color: SURFACE },
      line: { color: BORDER },
      rectRadius: 0.1,
    });
    s.addText(r.p, {
      x: x + 0.25,
      y: y + 0.25,
      w: 3.5,
      h: 0.3,
      fontSize: 11,
      fontFace: "Calibri",
      color: GREEN,
      bold: true,
      margin: 0,
    });
    s.addText(r.t, {
      x: x + 0.25,
      y: y + 0.65,
      w: 3.5,
      h: 0.45,
      fontSize: 18,
      fontFace: "Georgia",
      color: BLACK,
      margin: 0,
    });
    s.addText(r.d, {
      x: x + 0.25,
      y: y + 1.25,
      w: 3.5,
      h: 0.7,
      fontSize: 14,
      fontFace: "Calibri",
      color: MUTED,
      margin: 0,
    });
  });
  footer(s, 7);
}

// ─── 8. GTM ─────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: WHITE },
  });
  accentBar(s);
  sectionLabel(s, "Go-to-market");
  s.addText("Density first. WhatsApp-native. One offtake at a time.", {
    x: 0.55,
    y: 0.7,
    w: 12,
    h: 0.55,
    fontSize: 28,
    fontFace: "Georgia",
    color: BLACK,
    margin: 0,
  });

  const gtm = [
    {
      t: "Phase 1 — Beachhead",
      d: "1–2 crop corridors (e.g. TN / South India sugar + rice). 5–15 industrial buyers with weekly offtake. Field agents + WhatsApp onboarding.",
    },
    {
      t: "Phase 2 — Liquidity",
      d: "Repeat GMV, baling partners, transport SLAs, escrow. Target 500+ active sellers and measurable residue diverted.",
    },
    {
      t: "Phase 3 — Expand",
      d: "Replicate playbook to North residue belts. Add financing partner. Launch buyer procurement SaaS.",
    },
  ];
  gtm.forEach((g, i) => {
    const y = 1.55 + i * 1.6;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.55,
      y,
      w: 12.2,
      h: 1.4,
      fill: { color: i === 0 ? GREEN_DIM : SURFACE },
      rectRadius: 0.1,
    });
    s.addText(g.t, {
      x: 0.85,
      y: y + 0.25,
      w: 11.6,
      h: 0.4,
      fontSize: 18,
      fontFace: "Georgia",
      color: BLACK,
      margin: 0,
    });
    s.addText(g.d, {
      x: 0.85,
      y: y + 0.7,
      w: 11.6,
      h: 0.5,
      fontSize: 14,
      fontFace: "Calibri",
      color: MUTED,
      margin: 0,
    });
  });
  footer(s, 8);
}

// ─── 9. Competition ─────────────────────────────────────────
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: WHITE },
  });
  accentBar(s);
  sectionLabel(s, "Competition");
  s.addText("Why AgriCycle wins the residue niche", {
    x: 0.55,
    y: 0.7,
    w: 12,
    h: 0.55,
    fontSize: 30,
    fontFace: "Georgia",
    color: BLACK,
    margin: 0,
  });

  // simple table-like rows
  const rows = [
    ["", "Brokers", "Generic classifieds", "AgriCycle"],
    ["Moisture & grade", "No", "No", "Yes"],
    ["Industrial offtake focus", "Ad hoc", "No", "Yes"],
    ["Logistics for bulk waste", "Cash + call", "Rare", "Built-in"],
    ["AI price guidance", "No", "No", "Yes"],
    ["Escrow / tracking", "No", "Rare", "Yes"],
    ["Carbon narrative", "No", "No", "Yes"],
  ];
  rows.forEach((r, i) => {
    const y = 1.45 + i * 0.7;
    const bg = i === 0 ? GREEN : i % 2 === 0 ? SURFACE : WHITE;
    const tc = i === 0 ? WHITE : BLACK;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.55,
      y,
      w: 12.2,
      h: 0.65,
      fill: { color: bg },
    });
    r.forEach((cell, j) => {
      s.addText(cell, {
        x: 0.7 + j * 3.05,
        y: y + 0.15,
        w: 2.9,
        h: 0.4,
        fontSize: i === 0 ? 13 : 14,
        fontFace: "Calibri",
        color: j === 3 && i > 0 ? GREEN : tc,
        bold: i === 0 || j === 3,
        margin: 0,
      });
    });
  });
  footer(s, 9);
}

// ─── 10. Traction ───────────────────────────────────────────
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: WHITE },
  });
  accentBar(s);
  sectionLabel(s, "Traction & product status");
  s.addText("Working product — ready for pilot deployment", {
    x: 0.55,
    y: 0.7,
    w: 12,
    h: 0.55,
    fontSize: 28,
    fontFace: "Georgia",
    color: BLACK,
    margin: 0,
  });

  const left = [
    "Full-stack Next.js marketplace live in repo",
    "Neon Postgres + Better Auth + Groq AI integrated",
    "Offer → escrow (demo) → settlement workflow",
    "Admin console, roles, password reset, legal pages",
    "Open source on GitHub: klu2300032719/AgriCycle",
  ];
  const right = [
    "Honest stage: pre-revenue software MVP",
    "Seed data + demo flows for investor walkthrough",
    "Next 90 days: 1 pilot district + LOIs from mills",
    "Target: first paid offtake cycles within 6 months",
    "No fake farmer counts — traction will be real GMV",
  ];

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.55,
    y: 1.5,
    w: 6,
    h: 4.8,
    fill: { color: GREEN_DIM },
    rectRadius: 0.12,
  });
  s.addText("What exists today", {
    x: 0.85,
    y: 1.8,
    w: 5.4,
    h: 0.4,
    fontSize: 18,
    fontFace: "Georgia",
    color: BLACK,
    margin: 0,
  });
  left.forEach((t, i) => {
    s.addText("▸  " + t, {
      x: 0.85,
      y: 2.5 + i * 0.65,
      w: 5.4,
      h: 0.55,
      fontSize: 14,
      fontFace: "Calibri",
      color: MUTED,
      margin: 0,
    });
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.8,
    y: 1.5,
    w: 6,
    h: 4.8,
    fill: { color: SURFACE },
    rectRadius: 0.12,
  });
  s.addText("What we tell investors honestly", {
    x: 7.1,
    y: 1.8,
    w: 5.4,
    h: 0.4,
    fontSize: 18,
    fontFace: "Georgia",
    color: BLACK,
    margin: 0,
  });
  right.forEach((t, i) => {
    s.addText("▸  " + t, {
      x: 7.1,
      y: 2.5 + i * 0.65,
      w: 5.4,
      h: 0.55,
      fontSize: 14,
      fontFace: "Calibri",
      color: MUTED,
      margin: 0,
    });
  });
  footer(s, 10);
}

// ─── 11. Roadmap ────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: WHITE },
  });
  accentBar(s);
  sectionLabel(s, "18-month roadmap");
  s.addText("From demo to density to default channel", {
    x: 0.55,
    y: 0.7,
    w: 12,
    h: 0.55,
    fontSize: 28,
    fontFace: "Georgia",
    color: BLACK,
    margin: 0,
  });

  const phases = [
    {
      t: "0–6 mo",
      items: ["Pilot pilot cluster", "Field ops hire", "First LOIs", "WhatsApp layer"],
    },
    {
      t: "6–12 mo",
      items: ["₹1–3 Cr GMV goal*", "UPI/escrow live", "Logistics partners", "Repeat buyers"],
    },
    {
      t: "12–18 mo",
      items: ["2nd state", "Financing pilot", "Carbon pilots", "Series A ready"],
    },
  ];
  phases.forEach((p, i) => {
    const x = 0.55 + i * 4.2;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x,
      y: 1.6,
      w: 4,
      h: 4.6,
      fill: { color: i === 1 ? GREEN : SURFACE },
      rectRadius: 0.12,
    });
    s.addText(p.t, {
      x: x + 0.3,
      y: 1.95,
      w: 3.4,
      h: 0.5,
      fontSize: 22,
      fontFace: "Georgia",
      color: i === 1 ? WHITE : BLACK,
      margin: 0,
    });
    p.items.forEach((it, j) => {
      s.addText("•  " + it, {
        x: x + 0.3,
        y: 2.8 + j * 0.7,
        w: 3.4,
        h: 0.55,
        fontSize: 15,
        fontFace: "Calibri",
        color: i === 1 ? "DCFCE7" : MUTED,
        margin: 0,
      });
    });
  });
  s.addText("*Internal planning targets — not guarantees of performance.", {
    x: 0.55,
    y: 6.4,
    w: 12,
    h: 0.3,
    fontSize: 11,
    fontFace: "Calibri",
    color: MUTED,
    italic: true,
    margin: 0,
  });
  footer(s, 11);
}

// ─── 12. The Ask ────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: WHITE },
  });
  accentBar(s);
  sectionLabel(s, "The ask");
  s.addText("Raising $1,000,000 seed", {
    x: 0.55,
    y: 0.7,
    w: 12,
    h: 0.6,
    fontSize: 34,
    fontFace: "Georgia",
    color: BLACK,
    margin: 0,
  });
  s.addText("18-month runway to prove density, GMV, and unit economics", {
    x: 0.55,
    y: 1.35,
    w: 12,
    h: 0.4,
    fontSize: 16,
    fontFace: "Calibri",
    color: MUTED,
    margin: 0,
  });

  const funds = [
    { pct: "40%", t: "Product & engineering", d: "Payments, mobile/PWA, KYC, ops tools" },
    { pct: "30%", t: "Go-to-market & field", d: "Cluster ops, buyer sales, farmer onboarding" },
    { pct: "15%", t: "Logistics & working capital buffer", d: "Pilot collection pilots, float for deals" },
    { pct: "15%", t: "G&A / legal / contingency", d: "Entity, compliance, runway cushion" },
  ];
  funds.forEach((f, i) => {
    const y = 1.95 + i * 1.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.55,
      y,
      w: 12.2,
      h: 0.95,
      fill: { color: SURFACE },
      rectRadius: 0.08,
    });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.7,
      y: y + 0.2,
      w: 1.3,
      h: 0.55,
      fill: { color: GREEN },
      rectRadius: 0.06,
    });
    s.addText(f.pct, {
      x: 0.7,
      y: y + 0.28,
      w: 1.3,
      h: 0.4,
      fontSize: 16,
      fontFace: "Calibri",
      color: WHITE,
      align: "center",
      bold: true,
      margin: 0,
    });
    s.addText(f.t, {
      x: 2.3,
      y: y + 0.15,
      w: 10,
      h: 0.35,
      fontSize: 16,
      fontFace: "Calibri",
      color: BLACK,
      bold: true,
      margin: 0,
    });
    s.addText(f.d, {
      x: 2.3,
      y: y + 0.5,
      w: 10,
      h: 0.3,
      fontSize: 13,
      fontFace: "Calibri",
      color: MUTED,
      margin: 0,
    });
  });
  footer(s, 12);
}

// ─── 13. Team ───────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: WHITE },
  });
  accentBar(s);
  sectionLabel(s, "Team");
  s.addText("Founders building at the intersection of agri + climate + software", {
    x: 0.55,
    y: 0.7,
    w: 12,
    h: 0.55,
    fontSize: 26,
    fontFace: "Georgia",
    color: BLACK,
    margin: 0,
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.55,
    y: 1.6,
    w: 12.2,
    h: 3.2,
    fill: { color: SURFACE },
    rectRadius: 0.12,
  });
  s.addText("Insert founder bios here", {
    x: 0.9,
    y: 2.0,
    w: 11.5,
    h: 0.45,
    fontSize: 20,
    fontFace: "Georgia",
    color: BLACK,
    margin: 0,
  });
  s.addText(
    "For the live raise: add 2–3 founders/advisors with domain proof — agri operations, B2B sales to mills, full-stack product, and climate policy. Investors fund teams that can execute density in the field, not only ship UI.",
    {
      x: 0.9,
      y: 2.7,
      w: 11.5,
      h: 1.5,
      fontSize: 15,
      fontFace: "Calibri",
      color: MUTED,
      margin: 0,
    },
  );

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.55,
    y: 5.1,
    w: 12.2,
    h: 1.4,
    fill: { color: GREEN_DIM },
    rectRadius: 0.1,
  });
  s.addText(
    "Hiring plan with seed: Head of Field Ops · Full-stack engineer · B2B offtake lead · Part-time finance/legal",
    {
      x: 0.9,
      y: 5.5,
      w: 11.5,
      h: 0.6,
      fontSize: 15,
      fontFace: "Calibri",
      color: BLACK,
      margin: 0,
    },
  );
  footer(s, 13);
}

// ─── 14. Close ──────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: BLACK },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.18,
    h: 7.5,
    fill: { color: GREEN },
  });
  s.addShape(pres.shapes.OVAL, {
    x: -1,
    y: 4.5,
    w: 4,
    h: 4,
    fill: { color: "14532D" },
  });
  s.addShape(pres.shapes.OVAL, {
    x: 10.5,
    y: -1,
    w: 4,
    h: 4,
    fill: { color: GREEN_DARK },
  });

  s.addText("Let's make farm waste a market.", {
    x: 0.8,
    y: 2.0,
    w: 11.5,
    h: 0.9,
    fontSize: 36,
    fontFace: "Georgia",
    color: WHITE,
    margin: 0,
  });
  s.addText(
    "AgriCycle is raising $1M seed to prove local density, close real offtake, and become the default exchange for agricultural biomass.",
    {
      x: 0.8,
      y: 3.1,
      w: 10.5,
      h: 1,
      fontSize: 18,
      fontFace: "Calibri",
      color: "D1D5D3",
      margin: 0,
    },
  );
  s.addText("github.com/klu2300032719/AgriCycle", {
    x: 0.8,
    y: 4.5,
    w: 10,
    h: 0.4,
    fontSize: 16,
    fontFace: "Calibri",
    color: GREEN,
    bold: true,
    margin: 0,
  });
  s.addText("Contact: [your email]  ·  Demo: npm run dev → localhost:3000", {
    x: 0.8,
    y: 5.2,
    w: 11,
    h: 0.4,
    fontSize: 14,
    fontFace: "Calibri",
    color: "A3A3A3",
    margin: 0,
  });
  s.addText("Confidential  ·  AgriCycle 2026", {
    x: 0.8,
    y: 6.7,
    w: 8,
    h: 0.3,
    fontSize: 12,
    fontFace: "Calibri",
    color: MUTED,
    margin: 0,
  });
}

const outPptx = path.join(outDir, "AgriCycle-Seed-Pitch-Deck.pptx");
await pres.writeFile({ fileName: outPptx });
console.log("Wrote", outPptx);
