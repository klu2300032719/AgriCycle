"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button, Card, Input, Section } from "@/components/ui";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
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
        const code = (res.error as { code?: string }).code || "";
        const msg = res.error.message || "Invalid email or password";

        if (/origin|csrf|forbidden/i.test(msg)) {
          setError(
            `${msg}. Set BETTER_AUTH_URL and NEXT_PUBLIC_APP_URL to this site’s HTTPS URL, then redeploy.`,
          );
        } else if (
          code === "INVALID_EMAIL_OR_PASSWORD" ||
          /invalid email or password/i.test(msg)
        ) {
          setError(
            "No account matches this email + password. Use Create account if you’re new, or Forgot password to reset. Demo: demo@agricycle.app / AgriCycle@2026 (after running seed-demo-user).",
          );
        } else {
          setError(msg);
        }
        return;
      }
      window.location.href = "/dashboard";
      return;
    } catch (err) {
      console.error(err);
      setError(
        "Could not reach the auth server. Open /api/health on this domain to diagnose.",
      );
    } finally {
      setLoading(false);
    }
  }

  function fillDemo() {
    setEmail("demo@agricycle.app");
    setPassword("AgriCycle@2026");
    setError("");
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
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={fillDemo}
                className="text-xs font-medium text-muted underline-offset-2 hover:text-green hover:underline"
              >
                Use demo login
              </button>
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
          <p className="mt-3 rounded-lg bg-surface px-3 py-2 text-center text-[11px] leading-relaxed text-muted">
            New production deploys start with an empty user table. Register once,
            or run{" "}
            <code className="text-foreground">npm run db:demo-user</code> then
            sign in with the demo credentials.
          </p>
        </Card>
      </Section>
    </PageShell>
  );
}
