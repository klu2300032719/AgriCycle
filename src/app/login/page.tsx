"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Section } from "@/components/ui";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
        callbackURL: "/dashboard",
      });
      if (res.error) {
        setError(res.error.message || "Invalid email or password");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Could not reach the auth server. Is the app running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell className="pb-20 pt-12">
      <Section>
        <Card hover={false} className="mx-auto max-w-md border-green/15">
          <div className="mb-6">
            <Logo size={44} compact href={null} />
            <h1 className="mt-4 font-serif text-2xl text-foreground">Sign in</h1>
            <p className="text-sm text-muted">Access your AgriCycle account</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
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
              placeholder="••••••••"
            />
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-green hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted">
            No account?{" "}
            <Link href="/register" className="font-semibold text-green">
              Create one
            </Link>
          </p>
        </Card>
      </Section>
    </PageShell>
  );
}
