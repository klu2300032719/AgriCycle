"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button, Card, Input, Section } from "@/components/ui";
import PageShell from "@/components/PageShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");
    setResetUrl("");
    try {
      const res = await fetch("/api/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMsg(data.message);
      if (data.resetUrl) setResetUrl(data.resetUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell className="pb-20 pt-12">
      <Section>
        <Card hover={false} className="mx-auto max-w-md">
          <h1 className="font-serif text-2xl text-foreground">
            Reset password
          </h1>
          <p className="mt-1 text-sm text-muted">
            Enter your account email. In production this would email a link; in
            demo mode the link is shown here.
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={setEmail}
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            {msg && <p className="text-sm text-green">{msg}</p>}
            {resetUrl && (
              <p className="break-all rounded-lg bg-green-dim p-3 text-xs text-foreground">
                <Link href={resetUrl} className="font-semibold text-green underline">
                  Open reset link
                </Link>
                <br />
                {resetUrl}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending…" : "Send reset link"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted">
            <Link href="/login" className="text-green">
              Back to sign in
            </Link>
          </p>
        </Card>
      </Section>
    </PageShell>
  );
}
