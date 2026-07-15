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
  wasteType: WasteType | string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  grade: Grade | string;
  location: string;
  distanceKm: number;
  seller: string;
  moisture: number;
  description: string;
  status: "available" | "reserved" | "sold" | string;
  postedAt: string;
}

export interface Buyer {
  id: string;
  name: string;
  type: BuyerType | string;
  location: string;
  distanceKm: number;
  lookingFor: string[];
  rateRange: string;
  rating: number;
  verified: boolean;
}

export interface Transaction {
  id: string;
  listing: string;
  buyer: string;
  amount: number;
  status: "pending" | "paid" | "in_transit" | "completed" | string;
  date: string;
}

export interface PricePoint {
  month: string;
  price: number;
}

export interface Shipment {
  id: string;
  pickup: string;
  dropoff: string;
  loadTonnes: number;
  wasteType: string;
  vehicleId: string;
  vehicleName: string;
  distanceKm: number;
  cost: number;
  status: string;
  createdAt?: string;
}
