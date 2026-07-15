/**
 * Reset a user's password in Neon (dev / emergency ops).
 * Usage: npx tsx src/db/reset-password.ts you@email.com "NewPassword1"
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { hashPassword } from "better-auth/crypto";

const email = (process.argv[2] || "").trim().toLowerCase();
const password = process.argv[3] || "";

if (!email || password.length < 8) {
  console.error(
    'Usage: npx tsx src/db/reset-password.ts you@email.com "NewPassword1"',
  );
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL!);

async function main() {
  const users = await sql`
    SELECT id, email, name FROM "user" WHERE lower(email) = ${email} LIMIT 1
  `;
  if (!users.length) {
    console.error("No user found for", email);
    console.error("Create an account via /register first, or seed a demo user.");
    process.exit(1);
  }
  const u = users[0] as { id: string; email: string; name: string };
  const hashed = await hashPassword(password);

  const accounts = await sql`
    SELECT id FROM account
    WHERE user_id = ${u.id} AND provider_id = 'credential'
    LIMIT 1
  `;

  if (accounts.length) {
    await sql`
      UPDATE account
      SET password = ${hashed}, updated_at = now()
      WHERE id = ${(accounts[0] as { id: string }).id}
    `;
    console.log("Updated password for existing credential account:", u.email);
  } else {
    const id = `acc_${Date.now().toString(36)}`;
    await sql`
      INSERT INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at)
      VALUES (${id}, ${u.id}, 'credential', ${u.id}, ${hashed}, now(), now())
    `;
    console.log("Created credential account + password for:", u.email);
  }

  console.log("OK. Sign in with:");
  console.log("  email:", u.email);
  console.log("  password: (the one you passed)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
