import { db } from "@/db";
import { notifications } from "@/db/schema";

export async function notify(input: {
  userId: string;
  title: string;
  body: string;
  href?: string;
}) {
  if (!input.userId) return;
  const id = `NTF-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  await db.insert(notifications).values({
    id,
    userId: input.userId,
    title: input.title,
    body: input.body,
    href: input.href ?? null,
  });
}
