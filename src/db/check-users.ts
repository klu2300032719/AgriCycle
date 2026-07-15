import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL!);

async function main() {
  const users = await sql`
    SELECT id, email, name, role, created_at
    FROM "user"
    ORDER BY created_at DESC
    LIMIT 20
  `;
  console.log("users:", users.length);
  console.log(users);

  const accounts = await sql`
    SELECT id, provider_id, account_id, user_id,
           (password IS NOT NULL) AS has_password
    FROM account
    ORDER BY created_at DESC
    LIMIT 20
  `;
  console.log("accounts:", accounts.length);
  console.log(accounts);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
