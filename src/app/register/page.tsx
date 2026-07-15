"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";
import { Button, Card, Input, Section } from "@/components/ui";
import PageShell from "@/components/PageShell";
import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await signUp.email({ name, email, password });
      if (res.error) {
        setError(res.error.message || "Registration failed");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell className="pb-20 pt-12">
      <Section>
        <Card hover={false} className="mx-auto max-w-md border-green/15">
          <div className="mb-6 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green to-green-dark text-white">
              <Leaf className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-serif text-2xl text-foreground">
                Create account
              </h1>
              <p className="text-sm text-muted">
                Join the farm waste exchange
              </p>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label="Full name"
              id="name"
              value={name}
              onChange={setName}
              placeholder="Your name or farm name"
            />
            <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="farmer@example.com"
            />
            <Input
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Min. 8 characters"
            />
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <Button className="w-full" disabled={loading}>
              {loading ? "Creating…" : "Create account"}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-green">
              Sign in
            </Link>
          </p>
        </Card>
      </Section>
    </PageShell>
  );
}
