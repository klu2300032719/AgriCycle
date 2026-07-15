import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import {
  listings,
  offers,
  priceHistory,
  shipments,
  transactions,
} from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;
    const role = (session?.user as { role?: string } | undefined)?.role;

    const [allTxns, history, allListings, allShipments, allOffers] =
      await Promise.all([
        db.select().from(transactions).orderBy(desc(transactions.date)),
        db.select().from(priceHistory),
        db.select().from(listings),
        db.select().from(shipments).orderBy(desc(shipments.createdAt)).limit(10),
        db.select().from(offers).orderBy(desc(offers.createdAt)),
      ]);

    // Scope to user when logged in (admins see market overview + own)
    let txns = allTxns;
    let myListings = allListings;
    let myShipments = allShipments;
    let myOffers = allOffers;
    let scoped = false;

    if (userId && role !== "admin") {
      scoped = true;
      txns = allTxns.filter(
        (t) => t.userId === userId || t.buyerId === userId,
      );
      myListings = allListings.filter((l) => l.sellerId === userId);
      myShipments = allShipments.filter((s) => s.userId === userId);
      myOffers = allOffers.filter(
        (o) => o.buyerId === userId || o.sellerId === userId,
      );
      // If user has no data yet, show market demo sample for empty charts
      if (txns.length === 0 && myListings.length === 0) {
        scoped = false;
        txns = allTxns;
        myListings = allListings;
      }
    }

    const totalEarned = txns
      .filter((t) => t.status === "completed" || t.status === "paid")
      .reduce((s, t) => s + t.amount, 0);

    const pending = txns
      .filter((t) => t.status === "pending")
      .reduce((s, t) => s + t.amount, 0);

    const inEscrow = txns
      .filter((t) => t.status === "in_escrow" || t.status === "in_transit")
      .reduce((s, t) => s + (t.escrowAmount || t.amount), 0);

    const wasteSold = myListings
      .filter((l) => l.status === "sold" || l.status === "reserved")
      .reduce((s, l) => s + l.quantity, 0);

    const mixMap = new Map<string, number>();
    for (const l of myListings) {
      mixMap.set(l.wasteType, (mixMap.get(l.wasteType) || 0) + l.quantity);
    }
    const totalVol = [...mixMap.values()].reduce((a, b) => a + b, 0) || 1;
    const colors = [
      "bg-green",
      "bg-green-light",
      "bg-green-dark",
      "bg-neutral-400",
      "bg-neutral-300",
    ];
    const wasteMix = [...mixMap.entries()]
      .map(([name, qty], i) => ({
        name,
        pct: Math.round((qty / totalVol) * 100),
        color: colors[i % colors.length],
      }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 5);

    const co2Avoided = Math.round(wasteSold * 0.33 * 10) / 10;

    return NextResponse.json({
      scoped,
      user: session?.user
        ? { id: session.user.id, name: session.user.name, role }
        : null,
      stats: {
        totalEarned,
        pending,
        inEscrow,
        wasteSold: Math.round(wasteSold * 10) / 10 || (scoped ? 0 : 28.5),
        co2Avoided: co2Avoided || (scoped ? 0 : 9.4),
        activeListings: myListings.filter((l) => l.status === "available")
          .length,
        openOffers: myOffers.filter((o) => o.status === "pending").length,
      },
      transactions: txns,
      priceHistory: history.map((h) => ({
        month: h.month,
        price: Number(h.price),
      })),
      wasteMix: wasteMix.length
        ? wasteMix
        : [
            { name: "Rice Husk", pct: 32, color: "bg-green" },
            { name: "Crop Residue", pct: 24, color: "bg-green-light" },
            { name: "Sugarcane", pct: 18, color: "bg-green-dark" },
            { name: "Manure", pct: 14, color: "bg-neutral-400" },
            { name: "Other", pct: 12, color: "bg-neutral-300" },
          ],
      recentShipments: myShipments,
      offers: myOffers.slice(0, 10),
    });
  } catch (error) {
    console.error("GET /api/dashboard", error);
    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 },
    );
  }
}
