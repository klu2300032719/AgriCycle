"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Section,
  SectionHeading,
} from "@/components/ui";
import PageShell from "@/components/PageShell";
import { useSession } from "@/lib/auth-client";

type Offer = {
  id: string;
  listingId: string;
  listingTitle?: string;
  buyerName: string;
  buyerId: string;
  sellerId: string | null;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  message: string | null;
  status: string;
};

export default function OffersPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/offers");
      const data = await res.json();
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      setOffers(data.offers || []);
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

  async function act(id: string, action: string) {
    setBusy(id + action);
    setError("");
    try {
      const res = await fetch("/api/offers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  }

  const uid = session?.user?.id;

  return (
    <PageShell className="pb-20 pt-10">
      <Section>
        <SectionHeading
          eyebrow="Deal pipeline"
          title="Offers & escrow"
          subtitle="Accept, pay into escrow (demo), and complete deals. Full payment gateway can replace the demo pay step."
        />
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        {loading ? (
          <p className="flex items-center gap-2 text-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading offers…
          </p>
        ) : offers.length === 0 ? (
          <Card hover={false} className="py-12 text-center">
            <p className="font-medium text-foreground">No offers yet</p>
            <p className="mt-1 text-sm text-muted">
              Browse the marketplace and send an offer on a listing.
            </p>
            <Link href="/marketplace" className="btn-primary mt-4 inline-flex">
              Open marketplace
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {offers.map((o) => {
              const isBuyer = o.buyerId === uid;
              const isSeller = o.sellerId === uid;
              return (
                <Card key={o.id} hover={false}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{o.id}</Badge>
                        <Badge
                          variant={
                            o.status === "completed"
                              ? "green"
                              : o.status === "pending"
                                ? "warn"
                                : "default"
                          }
                        >
                          {o.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <h3 className="mt-2 font-semibold text-foreground">
                        <Link
                          href={`/marketplace/${o.listingId}`}
                          className="hover:text-green"
                        >
                          {o.listingTitle || o.listingId}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-muted">
                        Buyer: {o.buyerName} · {o.quantity}t @ ₹
                        {o.pricePerUnit.toLocaleString()}/t ={" "}
                        <span className="font-semibold text-foreground">
                          ₹{o.totalAmount.toLocaleString()}
                        </span>
                      </p>
                      {o.message && (
                        <p className="mt-1 text-xs text-muted">“{o.message}”</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {isSeller && o.status === "pending" && (
                        <>
                          <Button
                            onClick={() => act(o.id, "accept")}
                            disabled={!!busy}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => act(o.id, "reject")}
                            disabled={!!busy}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {isBuyer && o.status === "pending" && (
                        <Button
                          variant="outline"
                          onClick={() => act(o.id, "withdraw")}
                          disabled={!!busy}
                        >
                          Withdraw
                        </Button>
                      )}
                      {isBuyer && o.status === "accepted" && (
                        <Button
                          onClick={() => act(o.id, "pay")}
                          disabled={!!busy}
                        >
                          Pay to escrow (demo)
                        </Button>
                      )}
                      {(isBuyer || isSeller) && o.status === "accepted" && (
                        <Button
                          variant="secondary"
                          onClick={() => act(o.id, "complete")}
                          disabled={!!busy}
                        >
                          Mark complete / release
                        </Button>
                      )}
                      {isSeller && o.status === "accepted" && (
                        <Link
                          href="/transport"
                          className="btn-ghost !rounded-full !px-4 !py-2 text-sm"
                        >
                          Book transport
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
