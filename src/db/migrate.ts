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
  console.log("Applying AgriWasteX schema…");

  await sql`
    CREATE TABLE IF NOT EXISTS "user" (
      id text PRIMARY KEY,
      name text NOT NULL,
      email text NOT NULL UNIQUE,
      email_verified boolean NOT NULL DEFAULT false,
      image text,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "session" (
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
    CREATE TABLE IF NOT EXISTS "account" (
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
    CREATE TABLE IF NOT EXISTS "verification" (
      id text PRIMARY KEY,
      identifier text NOT NULL,
      value text NOT NULL,
      expires_at timestamp NOT NULL,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "listings" (
      id text PRIMARY KEY,
      title text NOT NULL,
      waste_type text NOT NULL,
      quantity real NOT NULL,
      unit text NOT NULL DEFAULT 'tonnes',
      price_per_unit integer NOT NULL,
      grade text NOT NULL DEFAULT 'B',
      location text NOT NULL,
      distance_km real NOT NULL DEFAULT 0,
      seller text NOT NULL,
      seller_id text REFERENCES "user"(id) ON DELETE SET NULL,
      moisture real NOT NULL DEFAULT 0,
      purity real DEFAULT 90,
      description text NOT NULL DEFAULT '',
      status text NOT NULL DEFAULT 'available',
      posted_at text NOT NULL,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "buyers" (
      id text PRIMARY KEY,
      name text NOT NULL,
      type text NOT NULL,
      location text NOT NULL,
      distance_km real NOT NULL DEFAULT 0,
      looking_for text[] NOT NULL,
      rate_range text NOT NULL,
      rating real NOT NULL DEFAULT 4.5,
      verified boolean NOT NULL DEFAULT false,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "transactions" (
      id text PRIMARY KEY,
      listing text NOT NULL,
      buyer text NOT NULL,
      amount integer NOT NULL,
      status text NOT NULL DEFAULT 'pending',
      date text NOT NULL,
      user_id text REFERENCES "user"(id) ON DELETE SET NULL,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "shipments" (
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
      user_id text REFERENCES "user"(id) ON DELETE SET NULL,
      created_at timestamp NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "price_history" (
      id text PRIMARY KEY,
      month text NOT NULL,
      price numeric(6, 2) NOT NULL,
      year integer NOT NULL DEFAULT 2026
    )
  `;

  console.log("Schema applied successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
