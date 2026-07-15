import {
  boolean,
  integer,
  numeric,
  pgTable,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/* ── Better Auth tables ── */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* ── AgriWasteX domain ── */

export const listings = pgTable("listings", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  wasteType: text("waste_type").notNull(),
  quantity: real("quantity").notNull(),
  unit: text("unit").notNull().default("tonnes"),
  pricePerUnit: integer("price_per_unit").notNull(),
  grade: text("grade").notNull().default("B"),
  location: text("location").notNull(),
  distanceKm: real("distance_km").notNull().default(0),
  seller: text("seller").notNull(),
  sellerId: text("seller_id").references(() => user.id, {
    onDelete: "set null",
  }),
  moisture: real("moisture").notNull().default(0),
  purity: real("purity").default(90),
  description: text("description").notNull().default(""),
  status: text("status").notNull().default("available"),
  postedAt: text("posted_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const buyers = pgTable("buyers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  distanceKm: real("distance_km").notNull().default(0),
  lookingFor: text("looking_for").array().notNull(),
  rateRange: text("rate_range").notNull(),
  rating: real("rating").notNull().default(4.5),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  listing: text("listing").notNull(),
  buyer: text("buyer").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("pending"),
  date: text("date").notNull(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const shipments = pgTable("shipments", {
  id: text("id").primaryKey(),
  pickup: text("pickup").notNull(),
  dropoff: text("dropoff").notNull(),
  loadTonnes: real("load_tonnes").notNull(),
  wasteType: text("waste_type").notNull(),
  vehicleId: text("vehicle_id").notNull(),
  vehicleName: text("vehicle_name").notNull(),
  distanceKm: integer("distance_km").notNull(),
  cost: integer("cost").notNull(),
  status: text("status").notNull().default("booked"),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const priceHistory = pgTable("price_history", {
  id: text("id").primaryKey(),
  month: text("month").notNull(),
  price: numeric("price", { precision: 6, scale: 2 }).notNull(),
  year: integer("year").notNull().default(2026),
});
