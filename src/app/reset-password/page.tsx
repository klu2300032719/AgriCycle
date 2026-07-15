"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, Input, Section } from "@/components/ui";
import PageShell from "@/components/PageShell";

function ResetForm() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/password-reset", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setOk(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <p className="text-sm text-red-600">
        Missing token. Request a new link from{" "}
        <Link href="/forgot-password" className="underline">
          forgot password
        </Link>
        .
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <Input
        label="New password"
        id="password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="Min. 8 characters"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {ok && (
        <p className="text-sm text-green">Password updated — redirecting…</p>
      )}
      <Button type="submit" className="w-full" disabled={loading || ok}>
        {loading ? "Saving…" : "Update password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <PageShell className="pb-20 pt-12">
      <Section>
        <Card hover={false} className="mx-auto max-w-md">
          <h1 className="font-serif text-2xl text-foreground">
            Choose a new password
          </h1>
          <Suspense fallback={<p className="mt-4 text-sm text-muted">Loading…</p>}>
            <ResetForm />
          </Suspense>
        </Card>
      </Section>
    </PageShell>
  );
}
