import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ notifications: [], unread: 0 }, { status: 401 });
    }
    const rows = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, session.user.id))
      .orderBy(desc(notifications.createdAt))
      .limit(40);

    return NextResponse.json({
      notifications: rows,
      unread: rows.filter((n) => !n.read).length,
    });
  } catch (error) {
    console.error("GET /api/notifications", error);
    return NextResponse.json({ notifications: [], unread: 0 }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    if (body.all) {
      const rows = await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, session.user.id));
      for (const n of rows) {
        if (!n.read) {
          await db
            .update(notifications)
            .set({ read: true })
            .where(eq(notifications.id, n.id));
        }
      }
      return NextResponse.json({ ok: true });
    }
    if (body.id) {
      await db
        .update(notifications)
        .set({ read: true })
        .where(eq(notifications.id, body.id));
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "id or all required" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/notifications", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
