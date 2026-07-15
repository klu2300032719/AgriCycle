"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  MessageSquare,
  Send,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  GradeBadge,
  Input,
  Section,
} from "@/components/ui";
import PageShell from "@/components/PageShell";
import { useSession } from "@/lib/auth-client";
import type { Grade, Listing } from "@/lib/types";

type Match = {
  id: string;
  name: string;
  type: string;
  location: string;
  distanceKm: number;
  matchScore: number;
  verified: boolean;
  rateRange: string;
};

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/listings/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.listing) {
          setListing(d.listing);
          setQty(String(d.listing.quantity));
          setPrice(String(d.listing.pricePerUnit));
        }
      })
      .finally(() => setLoading(false));
    fetch(`/api/match?listingId=${id}`)
      .then((r) => r.json())
      .then((d) => setMatches(d.matches || []));
  }, [id]);

  async function sendOffer(e: FormEvent) {
    e.preventDefault();
    if (!session?.user) {
      router.push("/login");
      return;
    }
    setSubmitting(true);
    setError("");
    setStatus("");
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: id,
          quantity: Number(qty),
          pricePerUnit: Number(price),
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("Offer sent! Track it under Offers.");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function contactSeller(e: FormEvent) {
    e.preventDefault();
    if (!session?.user) {
      router.push("/login");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: id, body: contactMsg }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("Message sent to seller.");
      setContactMsg("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <PageShell className="py-20">
        <Section>
          <p className="flex justify-center gap-2 text-muted">
            <Loader2 className="h-5 w-5 animate-spin text-green" /> Loading…
          </p>
        </Section>
      </PageShell>
    );
  }

  if (!listing) {
    return (
      <PageShell className="py-20">
        <Section>
          <p className="text-center text-muted">Listing not found</p>
          <div className="mt-4 text-center">
            <Link href="/marketplace" className="text-green">
              Back to marketplace
            </Link>
          </div>
        </Section>
      </PageShell>
    );
  }

  return (
    <PageShell className="relative pb-20 pt-10">
      <Section>
        <Link
          href="/marketplace"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-green"
        >
          <ArrowLeft className="h-4 w-4" /> Marketplace
        </Link>

        <div className="grid gap-6 lg:grid-cols-5">
          <Card hover={false} className="lg:col-span-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="green">{listing.wasteType}</Badge>
              <Badge variant={listing.status === "available" ? "default" : "warn"}>
                {listing.status}
              </Badge>
              <GradeBadge grade={listing.grade as Grade} />
            </div>
            <h1 className="mt-4 font-serif text-3xl text-foreground">
              {listing.title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {listing.description}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Quantity", `${listing.quantity} ${listing.unit}`],
                ["Price", `₹${listing.pricePerUnit.toLocaleString()}/t`],
                ["Moisture", `${listing.moisture}%`],
                ["Seller", listing.seller],
                ["Posted", listing.postedAt],
                [
                  "Location",
                  `${listing.location}${listing.distanceKm ? ` · ${listing.distanceKm} km` : ""}`,
                ],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-surface px-4 py-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted">
                    {k}
                  </p>
                  <p className="mt-0.5 font-medium text-foreground">{v}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-1 text-sm text-muted">
              <MapPin className="h-4 w-4 text-green" />
              Geo-tagged for distance matching when available
            </p>
          </Card>

          <div className="space-y-4 lg:col-span-2">
            <Card hover={false} className="border-green/20">
              <h2 className="flex items-center gap-2 font-semibold text-foreground">
                <Send className="h-4 w-4 text-green" />
                Send offer
              </h2>
              <form onSubmit={sendOffer} className="mt-4 space-y-3">
                <Input
                  label="Quantity (tonnes)"
                  id="qty"
                  type="number"
                  value={qty}
                  onChange={setQty}
                />
                <Input
                  label="Price per tonne (₹)"
                  id="price"
                  type="number"
                  value={price}
                  onChange={setPrice}
                />
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-green/50"
                    placeholder="Pickup window, payment terms…"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {session?.user ? "Submit offer" : "Sign in to offer"}
                </Button>
              </form>
            </Card>

            <Card hover={false}>
              <h2 className="flex items-center gap-2 font-semibold text-foreground">
                <MessageSquare className="h-4 w-4 text-green" />
                Contact seller
              </h2>
              <form onSubmit={contactSeller} className="mt-4 space-y-3">
                <textarea
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  rows={3}
                  required
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-green/50"
                  placeholder="Ask about moisture, bale size, ready date…"
                />
                <Button type="submit" variant="outline" className="w-full" disabled={submitting}>
                  Send message
                </Button>
              </form>
            </Card>

            {(error || status) && (
              <p
                className={`rounded-lg px-3 py-2 text-sm ${
                  error ? "bg-red-50 text-red-600" : "bg-green-dim text-green"
                }`}
              >
                {error || status}
              </p>
            )}
          </div>
        </div>

        {matches.length > 0 && (
          <div className="mt-10">
            <h2 className="font-serif text-2xl text-foreground">
              Matched buyers
            </h2>
            <p className="mt-1 text-sm text-muted">
              Ranked by waste fit, distance, and verification
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {matches.map((m) => (
                <Card key={m.id} hover={false}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{m.name}</p>
                      <p className="text-xs text-muted">{m.type}</p>
                    </div>
                    <Badge variant="green">Score {m.matchScore}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {m.location} · {m.distanceKm} km · {m.rateRange}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Section>
    </PageShell>
  );
}
