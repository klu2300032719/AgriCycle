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
  // AgriCycle extensions
  role: text("role").notNull().default("farmer"), // farmer | buyer | transporter | admin
  phone: text("phone"),
  company: text("company"),
  location: text("location"),
  lat: real("lat"),
  lng: real("lng"),
  verified: boolean("verified").notNull().default(false),
  bio: text("bio"),
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

/* ── AgriCycle domain ── */

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
  lat: real("lat"),
  lng: real("lng"),
  seller: text("seller").notNull(),
  sellerId: text("seller_id").references(() => user.id, {
    onDelete: "set null",
  }),
  moisture: real("moisture").notNull().default(0),
  purity: real("purity").default(90),
  description: text("description").notNull().default(""),
  status: text("status").notNull().default("available"), // available | reserved | sold | archived
  imageUrl: text("image_url"),
  postedAt: text("posted_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const buyers = pgTable("buyers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  distanceKm: real("distance_km").notNull().default(0),
  lat: real("lat"),
  lng: real("lng"),
  lookingFor: text("looking_for").array().notNull(),
  rateRange: text("rate_range").notNull(),
  rating: real("rating").notNull().default(4.5),
  verified: boolean("verified").notNull().default(false),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const offers = pgTable("offers", {
  id: text("id").primaryKey(),
  listingId: text("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  buyerId: text("buyer_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  buyerName: text("buyer_name").notNull(),
  sellerId: text("seller_id").references(() => user.id, {
    onDelete: "set null",
  }),
  quantity: real("quantity").notNull(),
  pricePerUnit: integer("price_per_unit").notNull(),
  totalAmount: integer("total_amount").notNull(),
  message: text("message").default(""),
  status: text("status").notNull().default("pending"), // pending | accepted | rejected | withdrawn | completed
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  offerId: text("offer_id").references(() => offers.id, {
    onDelete: "cascade",
  }),
  listingId: text("listing_id").references(() => listings.id, {
    onDelete: "cascade",
  }),
  fromUserId: text("from_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  toUserId: text("to_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  listing: text("listing").notNull(),
  listingId: text("listing_id").references(() => listings.id, {
    onDelete: "set null",
  }),
  offerId: text("offer_id").references(() => offers.id, {
    onDelete: "set null",
  }),
  buyer: text("buyer").notNull(),
  buyerId: text("buyer_id").references(() => user.id, { onDelete: "set null" }),
  amount: integer("amount").notNull(),
  platformFee: integer("platform_fee").notNull().default(0),
  escrowAmount: integer("escrow_amount").notNull().default(0),
  status: text("status").notNull().default("pending"), // pending | paid | in_escrow | released | in_transit | completed | refunded | disputed
  paymentMethod: text("payment_method").default("manual"), // manual | upi | bank | razorpay_demo
  date: text("date").notNull(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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
  status: text("status").notNull().default("booked"), // booked | pickup_scheduled | in_transit | delivered | cancelled
  listingId: text("listing_id").references(() => listings.id, {
    onDelete: "set null",
  }),
  offerId: text("offer_id").references(() => offers.id, {
    onDelete: "set null",
  }),
  driverName: text("driver_name"),
  driverPhone: text("driver_phone"),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const priceHistory = pgTable("price_history", {
  id: text("id").primaryKey(),
  month: text("month").notNull(),
  price: numeric("price", { precision: 6, scale: 2 }).notNull(),
  year: integer("year").notNull().default(2026),
});

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  fromUserId: text("from_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  toUserId: text("to_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  offerId: text("offer_id").references(() => offers.id, {
    onDelete: "set null",
  }),
  rating: integer("rating").notNull(),
  comment: text("comment").default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  href: text("href"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
