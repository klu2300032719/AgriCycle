import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getServerSession() {
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getServerSession();
  if (!session?.user) {
    return { session: null, error: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}

export function isAdmin(role?: string | null) {
  return role === "admin";
}
