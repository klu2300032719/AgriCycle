/**
 * Create or reset a demo login for investor walkthroughs.
 * Usage: npx tsx src/db/seed-demo-user.ts
 * Login: demo@agricycle.app / AgriCycle@2026
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { hashPassword } from "better-auth/crypto";

const EMAIL = "demo@agricycle.app";
const PASSWORD = "AgriCycle@2026";
const NAME = "AgriCycle Demo";

const sql = neon(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL!);

async function main() {
  const hashed = await hashPassword(PASSWORD);
  const existing = await sql`
    SELECT id FROM "user" WHERE lower(email) = ${EMAIL} LIMIT 1
  `;

  let userId: string;
  if (existing.length) {
    userId = (existing[0] as { id: string }).id;
    console.log("Demo user already exists:", userId);
  } else {
    userId = `user_demo_${Date.now().toString(36)}`;
    await sql`
      INSERT INTO "user" (id, name, email, email_verified, role, verified, created_at, updated_at)
      VALUES (${userId}, ${NAME}, ${EMAIL}, true, 'farmer', true, now(), now())
    `;
    console.log("Created demo user:", userId);
  }

  const acc = await sql`
    SELECT id FROM account WHERE user_id = ${userId} AND provider_id = 'credential' LIMIT 1
  `;
  if (acc.length) {
    await sql`
      UPDATE account SET password = ${hashed}, updated_at = now()
      WHERE id = ${(acc[0] as { id: string }).id}
    `;
  } else {
    const accId = `acc_demo_${Date.now().toString(36)}`;
    await sql`
      INSERT INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at)
      VALUES (${accId}, ${userId}, 'credential', ${userId}, ${hashed}, now(), now())
    `;
  }

  console.log("\nDemo login ready:");
  console.log("  Email:   ", EMAIL);
  console.log("  Password:", PASSWORD);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
