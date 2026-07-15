"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button, Card, Input, Section, Select } from "@/components/ui";
import PageShell from "@/components/PageShell";
import Logo from "@/components/Logo";
import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setLoading(true);
    try {
      const res = await signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        callbackURL: "/dashboard",
        role,
        phone: phone || undefined,
        location: location || undefined,
      } as Parameters<typeof signUp.email>[0] & {
        role?: string;
        phone?: string;
        location?: string;
      });
      if (res.error) {
        const msg = res.error.message || "Registration failed";
        if (/origin|csrf|forbidden|failed/i.test(msg)) {
          setError(
            `${msg}. Production fix: set BETTER_AUTH_URL and NEXT_PUBLIC_APP_URL to this site’s HTTPS URL, and run db:push.`,
          );
        } else {
          setError(msg);
        }
        return;
      }
      window.location.href = role === "buyer" ? "/buyers" : "/sell";
      return;
    } catch (err) {
      console.error(err);
      setError(
        "Could not create account. Check /api/health, DATABASE_URL, and auth env vars.",
      );
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
            <h1 className="mt-4 font-serif text-2xl text-foreground">
              Create account
            </h1>
            <p className="text-sm text-muted">
              Join as a farmer, buyer, or transporter
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <Select
              label="I am a"
              id="role"
              value={role}
              onChange={setRole}
              options={[
                { value: "farmer", label: "Farmer / seller" },
                { value: "buyer", label: "Industrial buyer" },
                { value: "transporter", label: "Transporter" },
              ]}
            />
            <Input
              label="Full name / farm / company"
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
              label="Phone (optional)"
              id="phone"
              value={phone}
              onChange={setPhone}
              placeholder="+91 …"
            />
            <Input
              label="Location (optional)"
              id="location"
              value={location}
              onChange={setLocation}
              placeholder="District, State"
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating…" : "Create account"}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-green">
              Sign in
            </Link>
          </p>
          <p className="mt-3 text-center text-[11px] text-muted">
            By joining you agree to our{" "}
            <Link href="/terms" className="text-green">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-green">
              Privacy Policy
            </Link>
            .
          </p>
        </Card>
      </Section>
    </PageShell>
  );
}
