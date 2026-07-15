export type WasteType =
  | "Crop Residue"
  | "Banana Stems"
  | "Coconut Shells"
  | "Sugarcane Waste"
  | "Rice Husk"
  | "Animal Manure";

export type BuyerType =
  | "Mushroom Farm"
  | "Biofuel Company"
  | "Compost Manufacturer"
  | "Paper Industry"
  | "Dairy Farm";

export type Grade = "A" | "B" | "C";

export interface Listing {
  id: string;
  title: string;
  wasteType: WasteType;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  grade: Grade;
  location: string;
  distanceKm: number;
  seller: string;
  moisture: number;
  description: string;
  status: "available" | "reserved" | "sold";
  postedAt: string;
}

export interface Buyer {
  id: string;
  name: string;
  type: BuyerType;
  location: string;
  distanceKm: number;
  lookingFor: WasteType[];
  rateRange: string;
  rating: number;
  verified: boolean;
}

export interface Transaction {
  id: string;
  listing: string;
  buyer: string;
  amount: number;
  status: "pending" | "paid" | "in_transit" | "completed";
  date: string;
}

export interface PricePoint {
  month: string;
  price: number;
}

export const wasteTypes: {
  name: WasteType;
  icon: string;
  description: string;
  avgPrice: string;
}[] = [
  {
    name: "Crop Residue",
    icon: "🌾",
    description: "Straw, stubble & leftover stalks after harvest",
    avgPrice: "₹1.2–2.5/kg",
  },
  {
    name: "Banana Stems",
    icon: "🍌",
    description: "Pseudostems ideal for fiber & compost",
    avgPrice: "₹0.8–1.5/kg",
  },
  {
    name: "Coconut Shells",
    icon: "🥥",
    description: "Hard shells for charcoal, crafts & biofuel",
    avgPrice: "₹3–6/kg",
  },
  {
    name: "Sugarcane Waste",
    icon: "🎋",
    description: "Bagasse & leaves for energy & paper",
    avgPrice: "₹1–2/kg",
  },
  {
    name: "Rice Husk",
    icon: "🍚",
    description: "Husk for silica, fuel & construction",
    avgPrice: "₹2–4/kg",
  },
  {
    name: "Animal Manure",
    icon: "🐄",
    description: "Organic fertilizer for farms & composters",
    avgPrice: "₹1.5–3/kg",
  },
];

export const buyerTypes: {
  name: BuyerType;
  icon: string;
  needs: string;
}[] = [
  {
    name: "Mushroom Farm",
    icon: "🍄",
    needs: "Crop residue, rice husk, manure",
  },
  {
    name: "Biofuel Company",
    icon: "⚡",
    needs: "Sugarcane waste, coconut shells, husk",
  },
  {
    name: "Compost Manufacturer",
    icon: "♻️",
    needs: "Manure, banana stems, residue",
  },
  {
    name: "Paper Industry",
    icon: "📄",
    needs: "Bagasse, banana stems, straw",
  },
  {
    name: "Dairy Farm",
    icon: "🥛",
    needs: "Crop residue as fodder mix",
  },
];

export const listings: Listing[] = [
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
    description:
      "Well-aged cattle manure ready for compost manufacturers and organic farms.",
    status: "available",
    postedAt: "2026-07-07",
  },
];

export const buyers: Buyer[] = [
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

export const transactions: Transaction[] = [
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

export const priceHistory: PricePoint[] = [
  { month: "Jan", price: 1.8 },
  { month: "Feb", price: 1.9 },
  { month: "Mar", price: 2.1 },
  { month: "Apr", price: 2.4 },
  { month: "May", price: 2.6 },
  { month: "Jun", price: 2.3 },
  { month: "Jul", price: 2.5 },
];

export const features = [
  {
    title: "AI Price Prediction",
    description:
      "Get smart market rates based on season, demand, moisture, and regional trends.",
    href: "/price-predict",
  },
  {
    title: "Nearby Buyers",
    description:
      "Discover verified buyers within your radius — mushroom farms, biofuel plants, and more.",
    href: "/buyers",
  },
  {
    title: "Transportation Booking",
    description:
      "Book pickups and trucks with transparent logistics pricing and live status.",
    href: "/transport",
  },
  {
    title: "Waste Quantity Estimation",
    description:
      "Estimate saleable volume from field size, crop type, and harvest data.",
    href: "/sell",
  },
  {
    title: "Waste Quality Grading",
    description:
      "Automatic A/B/C grading from moisture, purity, and contamination signals.",
    href: "/marketplace",
  },
  {
    title: "Payment Tracking",
    description:
      "Track advances, escrow releases, and settlement history in one place.",
    href: "/dashboard",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Visualize sales, carbon impact, top buyers, and seasonal performance.",
    href: "/dashboard",
  },
];

/** Illustrative targets for pitch decks — not live production metrics */
export const stats = [
  { label: "Pilot district focus", value: "TN first" },
  { label: "Waste types supported", value: "6" },
  { label: "Buyer categories", value: "5" },
  { label: "Platform fee (target)", value: "3%" },
];
