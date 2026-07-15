"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Shield } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Section,
  SectionHeading,
  StatCard,
} from "@/components/ui";
import PageShell from "@/components/PageShell";
import { useSession } from "@/lib/auth-client";

export default function AdminPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [data, setData] = useState<{
    needsBootstrap?: boolean;
    message?: string;
    stats?: Record<string, number>;
    users?: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
      verified: boolean;
    }>;
    listings?: Array<{ id: string; title: string; status: string }>;
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin");
      const json = await res.json();
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.status === 403 && !json.needsBootstrap) {
        setError("Admin access required");
        setData(null);
        return;
      }
      setData(json);
      setError("");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
      return;
    }
    if (session?.user) load();
  }, [session, isPending, load, router]);

  async function bootstrap() {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "bootstrap" }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Failed");
      return;
    }
    await load();
  }

  async function setRole(userId: string, role: string) {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "set_role", userId, role }),
    });
    await load();
  }

  async function verify(userId: string, verified: boolean) {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify_user", userId, verified }),
    });
    await load();
  }

  async function archive(listingId: string) {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "archive_listing", listingId }),
    });
    await load();
  }

  return (
    <PageShell className="pb-20 pt-10">
      <Section>
        <SectionHeading
          eyebrow="Operations"
          title="Admin console"
          subtitle="Moderate users, listings, and bootstrap the first admin on a fresh database."
        />
        {loading && (
          <p className="flex items-center gap-2 text-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </p>
        )}
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        {data?.needsBootstrap && (
          <Card hover={false} className="mb-6 border-amber-200 bg-amber-50/50">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-amber-700" />
              <div>
                <p className="font-semibold text-foreground">
                  No admin configured
                </p>
                <p className="mt-1 text-sm text-muted">{data.message}</p>
                <Button className="mt-4" onClick={bootstrap}>
                  Make me admin
                </Button>
              </div>
            </div>
          </Card>
        )}
        {data?.stats && (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Users" value={String(data.stats.users)} />
              <StatCard label="Listings" value={String(data.stats.listings)} />
              <StatCard
                label="Pending offers"
                value={String(data.stats.pendingOffers)}
              />
              <StatCard
                label="Completed volume"
                value={`₹${(data.stats.volume || 0).toLocaleString()}`}
              />
            </div>
            <Card hover={false} className="mb-6">
              <h3 className="font-bold text-foreground">Users</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase text-muted">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Email</th>
                      <th className="pb-2">Role</th>
                      <th className="pb-2">Verified</th>
                      <th className="pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.users || []).map((u) => (
                      <tr key={u.id} className="border-b border-border/50">
                        <td className="py-2">{u.name}</td>
                        <td className="py-2 text-muted">{u.email}</td>
                        <td className="py-2">
                          <Badge variant="outline">{u.role}</Badge>
                        </td>
                        <td className="py-2">
                          {u.verified ? "Yes" : "No"}
                        </td>
                        <td className="py-2">
                          <div className="flex flex-wrap gap-1">
                            {["farmer", "buyer", "admin"].map((r) => (
                              <button
                                key={r}
                                type="button"
                                className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-medium hover:bg-green-dim"
                                onClick={() => setRole(u.id, r)}
                              >
                                →{r}
                              </button>
                            ))}
                            <button
                              type="button"
                              className="rounded-full bg-green-dim px-2 py-0.5 text-[10px] font-medium text-green"
                              onClick={() => verify(u.id, !u.verified)}
                            >
                              {u.verified ? "Unverify" : "Verify"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <Card hover={false}>
              <h3 className="font-bold text-foreground">Listings</h3>
              <ul className="mt-4 space-y-2">
                {(data.listings || []).slice(0, 20).map((l) => (
                  <li
                    key={l.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span>
                      <span className="font-mono text-xs text-muted">
                        {l.id}
                      </span>{" "}
                      {l.title}{" "}
                      <Badge variant="outline">{l.status}</Badge>
                    </span>
                    {l.status !== "archived" && (
                      <button
                        type="button"
                        className="text-xs text-red-600"
                        onClick={() => archive(l.id)}
                      >
                        Archive
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}
      </Section>
    </PageShell>
  );
}
