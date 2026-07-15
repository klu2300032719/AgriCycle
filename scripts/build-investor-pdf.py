"""AgriCycle investor pitch deck as PDF — white / black / green theme."""
from pathlib import Path

from reportlab.lib.colors import Color, HexColor, white, black
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
    Flowable,
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT

OUT = Path(__file__).resolve().parents[1] / "pitch" / "AgriCycle-Seed-Pitch-Deck.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

GREEN = HexColor("#16A34A")
GREEN_DARK = HexColor("#15803D")
GREEN_DIM = HexColor("#E8F8EE")
BLACK = HexColor("#0A0A0A")
MUTED = HexColor("#5C6560")
BORDER = HexColor("#E8ECE9")
SURFACE = HexColor("#F6F9F7")
WHITE = white

PAGE = landscape(A4)  # ~841 x 595
W, H = PAGE


class ColoredBox(Flowable):
    def __init__(self, width, height, fill, radius=8, stroke=None):
        super().__init__()
        self.width = width
        self.height = height
        self.fill = fill
        self.radius = radius
        self.stroke = stroke

    def draw(self):
        self.canv.setFillColor(self.fill)
        if self.stroke:
            self.canv.setStrokeColor(self.stroke)
            self.canv.setLineWidth(0.5)
        else:
            self.canv.setStrokeColor(self.fill)
        self.canv.roundRect(0, 0, self.width, self.height, self.radius, fill=1, stroke=1)


def styles():
    return {
        "eyebrow": ParagraphStyle(
            "eyebrow",
            fontName="Helvetica-Bold",
            fontSize=10,
            textColor=GREEN,
            spaceAfter=6,
            leading=12,
            tracking=1,
        ),
        "h1": ParagraphStyle(
            "h1",
            fontName="Times-Bold",
            fontSize=28,
            textColor=BLACK,
            spaceAfter=10,
            leading=32,
        ),
        "h1w": ParagraphStyle(
            "h1w",
            fontName="Times-Bold",
            fontSize=36,
            textColor=WHITE,
            spaceAfter=10,
            leading=40,
        ),
        "sub": ParagraphStyle(
            "sub",
            fontName="Helvetica",
            fontSize=13,
            textColor=MUTED,
            spaceAfter=12,
            leading=18,
        ),
        "subw": ParagraphStyle(
            "subw",
            fontName="Helvetica",
            fontSize=14,
            textColor=HexColor("#D1D5D3"),
            spaceAfter=10,
            leading=19,
        ),
        "body": ParagraphStyle(
            "body",
            fontName="Helvetica",
            fontSize=11,
            textColor=MUTED,
            leading=15,
        ),
        "card_t": ParagraphStyle(
            "card_t",
            fontName="Times-Bold",
            fontSize=14,
            textColor=BLACK,
            leading=17,
            spaceAfter=4,
        ),
        "card_b": ParagraphStyle(
            "card_b",
            fontName="Helvetica",
            fontSize=10,
            textColor=MUTED,
            leading=13,
        ),
        "stat": ParagraphStyle(
            "stat",
            fontName="Times-Bold",
            fontSize=20,
            textColor=BLACK,
            alignment=TA_CENTER,
            leading=24,
        ),
        "statw": ParagraphStyle(
            "statw",
            fontName="Times-Bold",
            fontSize=20,
            textColor=WHITE,
            alignment=TA_CENTER,
            leading=24,
        ),
        "small": ParagraphStyle(
            "small",
            fontName="Helvetica",
            fontSize=9,
            textColor=MUTED,
            alignment=TA_CENTER,
            leading=12,
        ),
        "smallw": ParagraphStyle(
            "smallw",
            fontName="Helvetica",
            fontSize=9,
            textColor=HexColor("#DCFCE7"),
            alignment=TA_CENTER,
            leading=12,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            fontName="Helvetica",
            fontSize=11,
            textColor=MUTED,
            leading=16,
            leftIndent=8,
        ),
        "footer": ParagraphStyle(
            "footer",
            fontName="Helvetica",
            fontSize=8,
            textColor=MUTED,
        ),
    }


S = styles()
PAGE_NUM = {"n": 0, "total": 14}


def on_page(canvas, doc):
    canvas.saveState()
    # left green bar
    canvas.setFillColor(GREEN)
    canvas.rect(0, 0, 8, H, fill=1, stroke=0)
    PAGE_NUM["n"] += 1
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(28, 16, "AgriCycle  ·  Confidential  ·  Seed $1M")
    canvas.drawRightString(W - 24, 16, f"{PAGE_NUM['n']} / {PAGE_NUM['total']}")
    canvas.restoreState()


def on_page_dark(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BLACK)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setFillColor(GREEN)
    canvas.rect(0, 0, 10, H, fill=1, stroke=0)
    PAGE_NUM["n"] += 1
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(28, 16, "AgriCycle  ·  Confidential")
    canvas.restoreState()


def card_table(cells, col_w, row_h=90):
    """cells: list of (title, body) in row-major for 2 cols"""
    data = []
    row = []
    for i, (t, b) in enumerate(cells):
        inner = [
            Paragraph(f"<b>{t}</b>", S["card_t"]),
            Paragraph(b, S["card_b"]),
        ]
        row.append(inner)
        if len(row) == 2 or i == len(cells) - 1:
            if len(row) == 1:
                row.append("")
            data.append(row)
            row = []
    # convert flowables
    tbl_data = []
    for r in data:
        tbl_row = []
        for cell in r:
            if cell == "":
                tbl_row.append("")
            else:
                tbl_row.append(cell)
        tbl_data.append(tbl_row)

    # Use nested tables for padding
    def wrap(cell):
        if cell == "":
            return ""
        t = Table([[cell[0]], [cell[1]]], colWidths=[col_w - 20])
        t.setStyle(
            TableStyle(
                [
                    ("LEFTPADDING", (0, 0), (-1, -1), 12),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                    ("BACKGROUND", (0, 0), (-1, -1), SURFACE),
                    ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ]
            )
        )
        return t

    outer = [[wrap(c) for c in r] for r in tbl_data]
    t = Table(outer, colWidths=[col_w, col_w])
    t.setStyle(
        TableStyle(
            [
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return t


def build():
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=PAGE,
        leftMargin=28,
        rightMargin=28,
        topMargin=28,
        bottomMargin=36,
    )
    story = []
    content_w = W - 56

    # ========== 1 TITLE (handled with dark page) ==========
    # We'll use multi-build approach: custom canvases per section
    # Simpler: all light pages with title as special first page drawn in first flow

    # Actually rebuild with BaseDocTemplate multi-page types is heavy.
    # Generate as continuous PDF with clear slide-like page breaks.

    # PAGE 1 - Title dark
    story.append(Spacer(1, 80))
    story.append(Paragraph("SEED ROUND", S["eyebrow"]))
    story.append(Paragraph("AgriCycle", S["h1w"]))
    story.append(
        Paragraph(
            "<i>The exchange layer for farm biomass.</i>",
            ParagraphStyle(
                "itag",
                fontName="Times-Italic",
                fontSize=18,
                textColor=HexColor("#A7F3D0"),
                spaceAfter=14,
                leading=22,
            ),
        )
    )
    story.append(
        Paragraph(
            "Turning crop residue into a tradable commodity — for farmers, industries, and cleaner air.",
            S["subw"],
        )
    )
    story.append(Spacer(1, 30))
    story.append(
        Paragraph(
            "<b>Raising $1,000,000 seed  ·  18-month runway  ·  India first</b>",
            ParagraphStyle(
                "ask",
                fontName="Helvetica-Bold",
                fontSize=13,
                textColor=WHITE,
                spaceAfter=8,
            ),
        )
    )
    story.append(
        Paragraph(
            "Confidential · 2026 · github.com/klu2300032719/AgriCycle",
            ParagraphStyle(
                "c", fontName="Helvetica", fontSize=10, textColor=MUTED
            ),
        )
    )
    story.append(PageBreak())

    # PAGE 2 Problem
    story.append(Paragraph("THE PROBLEM", S["eyebrow"]))
    story.append(
        Paragraph("Every season, farm waste goes up in smoke", S["h1"])
    )
    story.append(
        card_table(
            [
                (
                    "350–500 Mt / year",
                    "Agricultural residue generated in India — much of it burned or dumped.",
                ),
                (
                    "Broken market",
                    "Farmers lack buyers; mills can't source quality feedstock from fragmented farms.",
                ),
                (
                    "Opaque brokers",
                    "Cash deals, no moisture grades, no price discovery, no logistics transparency.",
                ),
                (
                    "Air & climate cost",
                    "Stubble burning drives smog crises and wastes energy industry is mandated to use.",
                ),
            ],
            content_w / 2 - 8,
        )
    )
    story.append(PageBreak())

    # PAGE 3 Solution
    story.append(Paragraph("THE SOLUTION", S["eyebrow"]))
    story.append(Paragraph("AgriCycle: the farm biomass exchange", S["h1"]))
    story.append(
        Paragraph(
            "Farmers list residue. AI guides fair prices. Industries buy graded feedstock. Logistics and escrow close the deal.",
            S["sub"],
        )
    )
    steps = [
        ("01 List", "Estimate volume & grade waste in minutes"),
        ("02 Price", "AI + market signals suggest fair ₹ bands"),
        ("03 Match", "Nearby mills by waste type & distance"),
        ("04 Deal", "Offers → accept → escrow → transport"),
        ("05 Settle", "Payments, CO₂ avoided, analytics"),
    ]
    step_cells = []
    for t, b in steps:
        box = Table(
            [[Paragraph(f"<b>{t}</b>", S["card_t"])], [Paragraph(b, S["card_b"])]],
            colWidths=[content_w / 5 - 12],
        )
        box.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), GREEN_DIM),
                    ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
                    ("LEFTPADDING", (0, 0), (-1, -1), 8),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ]
            )
        )
        step_cells.append(box)
    story.append(Table([step_cells], colWidths=[content_w / 5] * 5))
    story.append(PageBreak())

    # PAGE 4 Product
    story.append(Paragraph("PRODUCT", S["eyebrow"]))
    story.append(Paragraph("Built. Demoable. Extensible.", S["h1"]))
    feats = [
        ("Live marketplace", "Filter listings by type, grade, location"),
        ("AI price prediction", "Groq LLM + regression fallback"),
        ("Sell & grade", "Volume estimate + A/B/C scoring"),
        ("Offer pipeline", "Send → accept → demo escrow → complete"),
        ("Transport booking", "Vehicle, distance, cost, shipment IDs"),
        ("Buyer matching", "Geo-aware industrial demand scoring"),
        ("Auth & roles", "Farmer / buyer / transporter / admin"),
        ("Analytics dashboard", "Earnings, escrow, payments, mix"),
    ]
    story.append(card_table(feats, content_w / 2 - 8))
    story.append(PageBreak())

    # PAGE 5 Market
    story.append(Paragraph("MARKET OPPORTUNITY", S["eyebrow"]))
    story.append(
        Paragraph(
            "Massive commodity. Missing digital plumbing.", S["h1"]
        )
    )
    stats = [
        ("$2.5–3.5B", "India biomass market (2024 est.)", True),
        ("350–500 Mt", "Agri residue generated yearly", False),
        ("$1B+", "Illustrative GMV if 50 Mt @ ~₹2k/t", False),
        ("3–8%", "Target platform take rate on GMV", False),
    ]
    row = []
    for v, l, hi in stats:
        inner = Table(
            [
                [
                    Paragraph(
                        v, S["statw"] if hi else S["stat"]
                    )
                ],
                [Paragraph(l, S["smallw"] if hi else S["small"])],
            ],
            colWidths=[content_w / 4 - 14],
        )
        inner.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), GREEN if hi else SURFACE),
                    ("BOX", (0, 0), (-1, -1), 0.5, GREEN if hi else BORDER),
                    ("TOPPADDING", (0, 0), (-1, -1), 18),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ]
            )
        )
        row.append(inner)
    story.append(Table([row], colWidths=[content_w / 4] * 4))
    story.append(Spacer(1, 16))
    story.append(
        Paragraph(
            "We do not need all of India. Owning dense corridors (paddy, sugar, coconut, manure) at high share — plus logistics and finance layers — compounds to a category-defining company.",
            S["body"],
        )
    )
    story.append(Spacer(1, 12))
    note = Table(
        [
            [
                Paragraph(
                    "<b>TAM:</b> global agri-biomass & circular feedstock &nbsp;·&nbsp; "
                    "<b>SAM:</b> India solid biomass trade & logistics &nbsp;·&nbsp; "
                    "<b>SOM:</b> 2–3 state corridors in 36 months",
                    S["body"],
                )
            ]
        ],
        colWidths=[content_w],
    )
    note.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), GREEN_DIM),
                ("LEFTPADDING", (0, 0), (-1, -1), 14),
                ("RIGHTPADDING", (0, 0), (-1, -1), 14),
                ("TOPPADDING", (0, 0), (-1, -1), 12),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
            ]
        )
    )
    story.append(note)
    story.append(PageBreak())

    # PAGE 6 Why now
    story.append(Paragraph("WHY NOW", S["eyebrow"]))
    story.append(
        Paragraph("Policy, climate, and industry demand converge", S["h1"])
    )
    whys = [
        (
            "1. Anti-burning pressure",
            "NCR smog politics force alternatives to open burning of paddy straw.",
        ),
        (
            "2. Bioenergy mandates",
            "SATAT, co-firing, and renewable targets create industrial offtake for residue.",
        ),
        (
            "3. ESG procurement",
            "Corporates need auditable supply chains and CO₂ diversion metrics.",
        ),
        (
            "4. Digital rails ready",
            "UPI, smartphones, and WhatsApp ops make rural marketplaces viable.",
        ),
    ]
    for t, b in whys:
        box = Table(
            [[Paragraph(f"<b>{t}</b>", S["card_t"])], [Paragraph(b, S["card_b"])]],
            colWidths=[content_w - 16],
        )
        box.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), SURFACE),
                    ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
                    ("LEFTPADDING", (0, 0), (-1, -1), 12),
                    ("TOPPADDING", (0, 0), (-1, -1), 8),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ]
            )
        )
        story.append(box)
        story.append(Spacer(1, 8))
    story.append(PageBreak())

    # PAGE 7 Business model
    story.append(Paragraph("BUSINESS MODEL", S["eyebrow"]))
    story.append(
        Paragraph("Multiple revenue layers on one GMV flywheel", S["h1"])
    )
    revs = [
        ("Marketplace fee", "2–5% of GMV on closed deals", "Near-term"),
        ("Buyer subscriptions", "Verified procurement seats for mills", "Near-term"),
        ("Logistics margin", "Transport & collection markup", "Year 1–2"),
        ("Financing spread", "Advances / invoice discounting (partners)", "Year 2+"),
        ("Carbon & ESG", "Diversion certificates & reporting", "Year 2+"),
        ("Data / SaaS", "Price index & procurement tools", "Year 3+"),
    ]
    story.append(
        card_table(
            [(f"{a} · {c}", b) for a, b, c in revs],
            content_w / 2 - 8,
        )
    )
    story.append(PageBreak())

    # PAGE 8 GTM
    story.append(Paragraph("GO-TO-MARKET", S["eyebrow"]))
    story.append(
        Paragraph(
            "Density first. WhatsApp-native. One offtake at a time.", S["h1"]
        )
    )
    gtms = [
        (
            "Phase 1 — Beachhead",
            "1–2 crop corridors (e.g. South India sugar + rice). 5–15 industrial buyers with weekly offtake. Field agents + WhatsApp onboarding.",
        ),
        (
            "Phase 2 — Liquidity",
            "Repeat GMV, baling partners, transport SLAs, escrow. Target 500+ active sellers and measurable residue diverted.",
        ),
        (
            "Phase 3 — Expand",
            "Replicate to North residue belts. Financing partner. Buyer procurement SaaS. Series A narrative.",
        ),
    ]
    for t, b in gtms:
        box = Table(
            [[Paragraph(f"<b>{t}</b>", S["card_t"])], [Paragraph(b, S["card_b"])]],
            colWidths=[content_w - 16],
        )
        box.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), GREEN_DIM if "Phase 1" in t else SURFACE),
                    ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
                    ("LEFTPADDING", (0, 0), (-1, -1), 14),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 14),
                ]
            )
        )
        story.append(box)
        story.append(Spacer(1, 10))
    story.append(PageBreak())

    # PAGE 9 Competition
    story.append(Paragraph("COMPETITION", S["eyebrow"]))
    story.append(Paragraph("Why AgriCycle wins the residue niche", S["h1"]))
    header = ["Capability", "Brokers", "Classifieds", "AgriCycle"]
    rows = [
        header,
        ["Moisture & grade", "No", "No", "Yes"],
        ["Industrial offtake focus", "Ad hoc", "No", "Yes"],
        ["Bulk logistics", "Cash + call", "Rare", "Built-in"],
        ["AI price guidance", "No", "No", "Yes"],
        ["Escrow / tracking", "No", "Rare", "Yes"],
        ["Carbon narrative", "No", "No", "Yes"],
    ]
    t = Table(rows, colWidths=[content_w * 0.28, content_w * 0.24, content_w * 0.24, content_w * 0.24])
    style_cmds = [
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("BACKGROUND", (0, 0), (-1, 0), GREEN),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("TEXTCOLOR", (3, 1), (3, -1), GREEN_DARK),
        ("FONTNAME", (3, 1), (3, -1), "Helvetica-Bold"),
        ("ALIGN", (1, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("GRID", (0, 0), (-1, -1), 0.4, BORDER),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ]
    for i in range(1, len(rows)):
        if i % 2 == 0:
            style_cmds.append(("BACKGROUND", (0, i), (-1, i), SURFACE))
    t.setStyle(TableStyle(style_cmds))
    story.append(t)
    story.append(PageBreak())

    # PAGE 10 Traction
    story.append(Paragraph("TRACTION & STATUS", S["eyebrow"]))
    story.append(
        Paragraph("Working product — ready for pilot deployment", S["h1"])
    )
    left = [
        "Full-stack Next.js marketplace in production-ready repo",
        "Neon Postgres + Better Auth + Groq AI integrated",
        "Offer → escrow (demo) → settlement workflow",
        "Admin console, roles, password reset, legal pages",
        "Open source: github.com/klu2300032719/AgriCycle",
    ]
    right = [
        "Honest stage: pre-revenue software MVP",
        "Seed data + demo flows for walkthroughs",
        "Next 90 days: 1 pilot district + mill LOIs",
        "Target: first paid offtake within 6 months",
        "No fake farmer counts — traction will be real GMV",
    ]
    def list_box(title, items, bg):
        lines = [Paragraph(f"<b>{title}</b>", S["card_t"])]
        for it in items:
            lines.append(Paragraph(f"• {it}", S["bullet"]))
        data = [[x] for x in lines]
        tb = Table(data, colWidths=[content_w / 2 - 20])
        tb.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), bg),
                    ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
                    ("LEFTPADDING", (0, 0), (-1, -1), 12),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ]
            )
        )
        return tb

    story.append(
        Table(
            [[list_box("What exists today", left, GREEN_DIM), list_box("Honest positioning", right, SURFACE)]],
            colWidths=[content_w / 2, content_w / 2],
        )
    )
    story.append(PageBreak())

    # PAGE 11 Roadmap
    story.append(Paragraph("18-MONTH ROADMAP", S["eyebrow"]))
    story.append(
        Paragraph("From demo to density to default channel", S["h1"])
    )
    phases = [
        ("0–6 mo", ["Launch pilot cluster", "Field ops hire", "First LOIs", "WhatsApp layer"], False),
        ("6–12 mo", ["₹1–3 Cr GMV goal*", "UPI / escrow live", "Logistics partners", "Repeat buyers"], True),
        ("12–18 mo", ["2nd state", "Financing pilot", "Carbon pilots", "Series A ready"], False),
    ]
    title_hi = ParagraphStyle(
        "ctw", fontName="Times-Bold", fontSize=14, textColor=WHITE, leading=17, spaceAfter=4
    )
    bullet_hi = ParagraphStyle(
        "bw",
        fontName="Helvetica",
        fontSize=11,
        textColor=HexColor("#DCFCE7"),
        leading=16,
        leftIndent=8,
    )
    prow = []
    for title, items, hi in phases:
        lines = [Paragraph(f"<b>{title}</b>", title_hi if hi else S["card_t"])]
        for it in items:
            lines.append(Paragraph(f"• {it}", bullet_hi if hi else S["bullet"]))
        data = [[x] for x in lines]
        tb = Table(data, colWidths=[content_w / 3 - 16])
        tb.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), GREEN if hi else SURFACE),
                    ("BOX", (0, 0), (-1, -1), 0.5, GREEN if hi else BORDER),
                    ("LEFTPADDING", (0, 0), (-1, -1), 12),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ]
            )
        )
        prow.append(tb)
    story.append(Table([prow], colWidths=[content_w / 3] * 3))
    story.append(Spacer(1, 10))
    story.append(
        Paragraph(
            "*Internal planning targets — not guarantees of performance.",
            ParagraphStyle(
                "disc",
                fontName="Helvetica-Oblique",
                fontSize=9,
                textColor=MUTED,
            ),
        )
    )
    story.append(PageBreak())

    # PAGE 12 Ask
    story.append(Paragraph("THE ASK", S["eyebrow"]))
    story.append(Paragraph("Raising $1,000,000 seed", S["h1"]))
    story.append(
        Paragraph(
            "18-month runway to prove density, GMV, and unit economics after truck cost.",
            S["sub"],
        )
    )
    funds = [
        ("40%", "Product & engineering", "Payments, mobile/PWA, KYC, ops tools"),
        ("30%", "Go-to-market & field", "Cluster ops, buyer sales, farmer onboarding"),
        ("15%", "Logistics & WC buffer", "Collection pilots, float for early deals"),
        ("15%", "G&A / legal / contingency", "Entity, compliance, runway cushion"),
    ]
    for pct, t, d in funds:
        row = Table(
            [
                [
                    Paragraph(f"<b>{pct}</b>", ParagraphStyle("p", fontName="Helvetica-Bold", fontSize=12, textColor=WHITE, alignment=TA_CENTER)),
                    Paragraph(f"<b>{t}</b><br/>{d}", S["card_b"]),
                ]
            ],
            colWidths=[60, content_w - 70],
        )
        row.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (0, 0), GREEN),
                    ("BACKGROUND", (1, 0), (1, 0), SURFACE),
                    ("BOX", (0, 0), (-1, -1), 0.4, BORDER),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 10),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ]
            )
        )
        story.append(row)
        story.append(Spacer(1, 8))
    story.append(PageBreak())

    # PAGE 13 Team
    story.append(Paragraph("TEAM", S["eyebrow"]))
    story.append(
        Paragraph(
            "Founders at agri + climate + software intersection", S["h1"]
        )
    )
    box = Table(
        [
            [
                Paragraph(
                    "<b>Insert founder bios before sending</b><br/><br/>"
                    "Add 2–3 founders/advisors with proof in: agri operations, B2B sales to mills, "
                    "full-stack product, and climate policy. Investors fund teams that can execute "
                    "density in the field — not only ship UI.<br/><br/>"
                    "<b>Hiring with seed:</b> Head of Field Ops · Full-stack engineer · B2B offtake lead · Part-time finance/legal",
                    S["body"],
                )
            ]
        ],
        colWidths=[content_w],
    )
    box.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), SURFACE),
                ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
                ("LEFTPADDING", (0, 0), (-1, -1), 16),
                ("RIGHTPADDING", (0, 0), (-1, -1), 16),
                ("TOPPADDING", (0, 0), (-1, -1), 16),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 16),
            ]
        )
    )
    story.append(box)
    story.append(PageBreak())

    # PAGE 14 Close
    story.append(Spacer(1, 60))
    story.append(
        Paragraph("Let's make farm waste a market.", S["h1w"])
    )
    story.append(
        Paragraph(
            "AgriCycle is raising $1M seed to prove local density, close real offtake, and become the default exchange for agricultural biomass.",
            S["subw"],
        )
    )
    story.append(Spacer(1, 20))
    story.append(
        Paragraph(
            "<b>github.com/klu2300032719/AgriCycle</b>",
            ParagraphStyle(
                "g",
                fontName="Helvetica-Bold",
                fontSize=14,
                textColor=GREEN,
                spaceAfter=10,
            ),
        )
    )
    story.append(
        Paragraph(
            "Contact: [your email]  ·  Demo: npm run dev → localhost:3000  ·  Deck: pitch/",
            ParagraphStyle(
                "c2", fontName="Helvetica", fontSize=11, textColor=HexColor("#A3A3A3")
            ),
        )
    )

    def first_page(canvas, doc):
        on_page_dark(canvas, doc)

    def later_pages(canvas, doc):
        # pages after first: if last page also dark? For simplicity all after first are light
        # Close page is last - make dark only for page 1 and we can't easily know last
        on_page(canvas, doc)

    # Reset counter - reportlab calls first then later
    PAGE_NUM["n"] = 0
    PAGE_NUM["total"] = 14

    doc.build(story, onFirstPage=first_page, onLaterPages=later_pages)
    print("Wrote", OUT)


if __name__ == "__main__":
    build()
