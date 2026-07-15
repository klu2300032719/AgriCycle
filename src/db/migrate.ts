import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

const sql = neon(connectionString);

async function main() {
  console.log("Applying AgriCycle schema…");

  // Drop domain tables first (FK order)
  await sql`DROP TABLE IF EXISTS "password_reset_tokens" CASCADE`;
  await sql`DROP TABLE IF EXISTS "notifications" CASCADE`;
  await sql`DROP TABLE IF EXISTS "reviews" CASCADE`;
  await sql`DROP TABLE IF EXISTS "messages" CASCADE`;
  await sql`DROP TABLE IF EXISTS "shipments" CASCADE`;
  await sql`DROP TABLE IF EXISTS "transactions" CASCADE`;
  await sql`DROP TABLE IF EXISTS "offers" CASCADE`;
  await sql`DROP TABLE IF EXISTS "listings" CASCADE`;
  await sql`DROP TABLE IF EXISTS "buyers" CASCADE`;
  await sql`DROP TABLE IF EXISTS "price_history" CASCADE`;
  await sql`DROP TABLE IF EXISTS "session" CASCADE`;
  await sql`DROP TABLE IF EXISTS "account" CASCADE`;
  await sql`DROP TABLE IF EXISTS "verification" CASCADE`;
  await sql`DROP TABLE IF EXISTS "user" CASCADE`;

  await sql`
    CREATE TABLE "user" (
      id text PRIMARY KEY,
      name text NOT NULL,
      email text NOT NULL UNIQUE,
      email_verified boolean NOT NULL DEFAULT false,
      image text,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now(),
      role text NOT NULL DEFAULT 'farmer',
      phone text,
      company text,
      location text,
      lat real,
      lng real,
      verified boolean NOT NULL DEFAULT false,
      bio text
    )
  `;

  await sql`
    CREATE TABLE "session" (
      id text PRIMARY KEY,
      expires_at timestamp NOT NULL,
      token text NOT NULL UNIQUE,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now(),
      ip_address text,
      user_agent text,
      user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
    )
  `;

  await sql`
    CREATE TABLE "account" (
      id text PRIMARY KEY,
      account_id text NOT NULL,
      provider_id text NOT NULL,
      user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      access_token text,
      refresh_token text,
      id_token text,
      access_token_expires_at timestamp,
      refresh_token_expires_at timestamp,
      scope text,
      password text,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE "verification" (
      id text PRIMARY KEY,
      identifier text NOT NULL,
      value text NOT NULL,
      expires_at timestamp NOT NULL,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE "listings" (
      id text PRIMARY KEY,
      title text NOT NULL,
      waste_type text NOT NULL,
      quantity real NOT NULL,
      unit text NOT NULL DEFAULT 'tonnes',
      price_per_unit integer NOT NULL,
      grade text NOT NULL DEFAULT 'B',
      location text NOT NULL,
      distance_km real NOT NULL DEFAULT 0,
      lat real,
      lng real,
      seller text NOT NULL,
      seller_id text REFERENCES "user"(id) ON DELETE SET NULL,
      moisture real NOT NULL DEFAULT 0,
      purity real DEFAULT 90,
      description text NOT NULL DEFAULT '',
      status text NOT NULL DEFAULT 'available',
      image_url text,
      posted_at text NOT NULL,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE "buyers" (
      id text PRIMARY KEY,
      name text NOT NULL,
      type text NOT NULL,
      location text NOT NULL,
      distance_km real NOT NULL DEFAULT 0,
      lat real,
      lng real,
      looking_for text[] NOT NULL,
      rate_range text NOT NULL,
      rating real NOT NULL DEFAULT 4.5,
      verified boolean NOT NULL DEFAULT false,
      user_id text REFERENCES "user"(id) ON DELETE SET NULL,
      contact_email text,
      contact_phone text,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE "offers" (
      id text PRIMARY KEY,
      listing_id text NOT NULL REFERENCES "listings"(id) ON DELETE CASCADE,
      buyer_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      buyer_name text NOT NULL,
      seller_id text REFERENCES "user"(id) ON DELETE SET NULL,
      quantity real NOT NULL,
      price_per_unit integer NOT NULL,
      total_amount integer NOT NULL,
      message text DEFAULT '',
      status text NOT NULL DEFAULT 'pending',
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE "messages" (
      id text PRIMARY KEY,
      offer_id text REFERENCES "offers"(id) ON DELETE CASCADE,
      listing_id text REFERENCES "listings"(id) ON DELETE CASCADE,
      from_user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      to_user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      body text NOT NULL,
      read boolean NOT NULL DEFAULT false,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE "transactions" (
      id text PRIMARY KEY,
      listing text NOT NULL,
      listing_id text REFERENCES "listings"(id) ON DELETE SET NULL,
      offer_id text REFERENCES "offers"(id) ON DELETE SET NULL,
      buyer text NOT NULL,
      buyer_id text REFERENCES "user"(id) ON DELETE SET NULL,
      amount integer NOT NULL,
      platform_fee integer NOT NULL DEFAULT 0,
      escrow_amount integer NOT NULL DEFAULT 0,
      status text NOT NULL DEFAULT 'pending',
      payment_method text DEFAULT 'manual',
      date text NOT NULL,
      user_id text REFERENCES "user"(id) ON DELETE SET NULL,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE "shipments" (
      id text PRIMARY KEY,
      pickup text NOT NULL,
      dropoff text NOT NULL,
      load_tonnes real NOT NULL,
      waste_type text NOT NULL,
      vehicle_id text NOT NULL,
      vehicle_name text NOT NULL,
      distance_km integer NOT NULL,
      cost integer NOT NULL,
      status text NOT NULL DEFAULT 'booked',
      listing_id text REFERENCES "listings"(id) ON DELETE SET NULL,
      offer_id text REFERENCES "offers"(id) ON DELETE SET NULL,
      driver_name text,
      driver_phone text,
      user_id text REFERENCES "user"(id) ON DELETE SET NULL,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE "price_history" (
      id text PRIMARY KEY,
      month text NOT NULL,
      price numeric(6, 2) NOT NULL,
      year integer NOT NULL DEFAULT 2026
    )
  `;

  await sql`
    CREATE TABLE "reviews" (
      id text PRIMARY KEY,
      from_user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      to_user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      offer_id text REFERENCES "offers"(id) ON DELETE SET NULL,
      rating integer NOT NULL,
      comment text DEFAULT '',
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE "notifications" (
      id text PRIMARY KEY,
      user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      title text NOT NULL,
      body text NOT NULL,
      href text,
      read boolean NOT NULL DEFAULT false,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE "password_reset_tokens" (
      id text PRIMARY KEY,
      user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      token text NOT NULL UNIQUE,
      expires_at timestamp NOT NULL,
      used boolean NOT NULL DEFAULT false,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;

  console.log("Schema applied successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
