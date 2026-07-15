import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  buyers,
  listings,
  priceHistory,
  shipments,
  transactions,
} from "./schema";

const connectionString =
  process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

const db = drizzle(neon(connectionString));

const seedListings = [
  {
    id: "LST-1001",
    title: "Premium Rice Husk – Dry Season Stock",
    wasteType: "Rice Husk",
    quantity: 12,
    unit: "tonnes",
    pricePerUnit: 3200,
    grade: "A",
    location: "Thanjavur, Tamil Nadu",
    distanceKm: 18,
    seller: "Karthik Farms",
    moisture: 8,
    purity: 94,
    description:
      "Clean, low-moisture rice husk from paddy mill. Suitable for biofuel and silica extraction.",
    status: "available",
    postedAt: "2026-07-12",
  },
  {
    id: "LST-1002",
    title: "Fresh Banana Stem Bundle",
    wasteType: "Banana Stems",
    quantity: 5,
    unit: "tonnes",
    pricePerUnit: 1100,
    grade: "B",
    location: "Theni, Tamil Nadu",
    distanceKm: 42,
    seller: "Green Valley Plantation",
    moisture: 72,
    purity: 80,
    description:
      "Freshly cut banana stems. Ideal for fiber extraction and mushroom substrate.",
    status: "available",
    postedAt: "2026-07-11",
  },
  {
    id: "LST-1003",
    title: "Sugarcane Bagasse – Bulk Lot",
    wasteType: "Sugarcane Waste",
    quantity: 40,
    unit: "tonnes",
    pricePerUnit: 1400,
    grade: "A",
    location: "Erode, Tamil Nadu",
    distanceKm: 65,
    seller: "Sakthi Agro Mills",
    moisture: 45,
    purity: 88,
    description:
      "Industrial bagasse from crushing season. Paper mills and biofuel plants preferred.",
    status: "available",
    postedAt: "2026-07-10",
  },
  {
    id: "LST-1004",
    title: "Coconut Shells – Charcoal Grade",
    wasteType: "Coconut Shells",
    quantity: 8,
    unit: "tonnes",
    pricePerUnit: 4800,
    grade: "A",
    location: "Pollachi, Tamil Nadu",
    distanceKm: 28,
    seller: "Coastal Coir Co-op",
    moisture: 12,
    purity: 96,
    description:
      "Hard coconut shells sorted for charcoal and craft industries. Low ash content.",
    status: "reserved",
    postedAt: "2026-07-09",
  },
  {
    id: "LST-1005",
    title: "Paddy Straw Bales",
    wasteType: "Crop Residue",
    quantity: 25,
    unit: "tonnes",
    pricePerUnit: 1800,
    grade: "B",
    location: "Nagapattinam, Tamil Nadu",
    distanceKm: 55,
    seller: "Delta Growers Collective",
    moisture: 14,
    purity: 82,
    description:
      "Balanced paddy straw. Good for mushroom farms and dairy fodder mix.",
    status: "available",
    postedAt: "2026-07-08",
  },
  {
    id: "LST-1006",
    title: "Composted Cattle Manure",
    wasteType: "Animal Manure",
    quantity: 15,
    unit: "tonnes",
    pricePerUnit: 2200,
    grade: "A",
    location: "Salem, Tamil Nadu",
    distanceKm: 35,
    seller: "Hillside Dairy",
    moisture: 35,
    purity: 90,
    description:
      "Well-aged cattle manure ready for compost manufacturers and organic farms.",
    status: "available",
    postedAt: "2026-07-07",
  },
];

const seedBuyers = [
  {
    id: "BUY-201",
    name: "MycoGrow Mushrooms",
    type: "Mushroom Farm",
    location: "Coimbatore",
    distanceKm: 12,
    lookingFor: ["Crop Residue", "Rice Husk", "Animal Manure"],
    rateRange: "₹1.5–3.2/kg",
    rating: 4.8,
    verified: true,
  },
  {
    id: "BUY-202",
    name: "GreenFlame Biofuels",
    type: "Biofuel Company",
    location: "Chennai",
    distanceKm: 48,
    lookingFor: ["Sugarcane Waste", "Coconut Shells", "Rice Husk"],
    rateRange: "₹2–5/kg",
    rating: 4.6,
    verified: true,
  },
  {
    id: "BUY-203",
    name: "EarthCycle Compost",
    type: "Compost Manufacturer",
    location: "Madurai",
    distanceKm: 22,
    lookingFor: ["Animal Manure", "Banana Stems", "Crop Residue"],
    rateRange: "₹1–2.5/kg",
    rating: 4.5,
    verified: true,
  },
  {
    id: "BUY-204",
    name: "South Paper Mills",
    type: "Paper Industry",
    location: "Tirupur",
    distanceKm: 38,
    lookingFor: ["Sugarcane Waste", "Banana Stems", "Crop Residue"],
    rateRange: "₹1.2–2.8/kg",
    rating: 4.3,
    verified: false,
  },
  {
    id: "BUY-205",
    name: "Amul Local Dairy Hub",
    type: "Dairy Farm",
    location: "Namakkal",
    distanceKm: 30,
    lookingFor: ["Crop Residue", "Rice Husk"],
    rateRange: "₹1–2/kg",
    rating: 4.7,
    verified: true,
  },
  {
    id: "BUY-206",
    name: "BioChar Tamil Nadu",
    type: "Biofuel Company",
    location: "Tuticorin",
    distanceKm: 90,
    lookingFor: ["Coconut Shells", "Rice Husk"],
    rateRange: "₹3–6/kg",
    rating: 4.4,
    verified: true,
  },
];

const seedTxns = [
  {
    id: "TXN-901",
    listing: "Rice Husk – 8t",
    buyer: "GreenFlame Biofuels",
    amount: 25600,
    status: "completed",
    date: "2026-07-05",
  },
  {
    id: "TXN-902",
    listing: "Banana Stems – 3t",
    buyer: "EarthCycle Compost",
    amount: 3300,
    status: "in_transit",
    date: "2026-07-08",
  },
  {
    id: "TXN-903",
    listing: "Paddy Straw – 10t",
    buyer: "MycoGrow Mushrooms",
    amount: 18000,
    status: "paid",
    date: "2026-07-10",
  },
  {
    id: "TXN-904",
    listing: "Cattle Manure – 5t",
    buyer: "EarthCycle Compost",
    amount: 11000,
    status: "pending",
    date: "2026-07-12",
  },
  {
    id: "TXN-905",
    listing: "Coconut Shells – 2t",
    buyer: "BioChar Tamil Nadu",
    amount: 9600,
    status: "completed",
    date: "2026-07-01",
  },
];

const seedPrices = [
  { id: "PH-01", month: "Jan", price: "1.80", year: 2026 },
  { id: "PH-02", month: "Feb", price: "1.90", year: 2026 },
  { id: "PH-03", month: "Mar", price: "2.10", year: 2026 },
  { id: "PH-04", month: "Apr", price: "2.40", year: 2026 },
  { id: "PH-05", month: "May", price: "2.60", year: 2026 },
  { id: "PH-06", month: "Jun", price: "2.30", year: 2026 },
  { id: "PH-07", month: "Jul", price: "2.50", year: 2026 },
];

async function main() {
  console.log("Seeding AgriWasteX database…");

  await db.delete(shipments);
  await db.delete(transactions);
  await db.delete(listings);
  await db.delete(buyers);
  await db.delete(priceHistory);

  await db.insert(listings).values(seedListings);
  await db.insert(buyers).values(seedBuyers);
  await db.insert(transactions).values(seedTxns);
  await db.insert(priceHistory).values(seedPrices);

  console.log("Seed complete:", {
    listings: seedListings.length,
    buyers: seedBuyers.length,
    transactions: seedTxns.length,
    priceHistory: seedPrices.length,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
