/**
 * Resolve the public site origin for Better Auth in local + Vercel + custom domain deploys.
 * Prefer explicit env; fall back to Vercel system vars so previews work without manual setup.
 */
export function getAuthBaseURL(): string {
  const explicit =
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL;

  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  // Vercel production custom domain
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(
      /\/$/,
      "",
    )}`;
  }

  // Vercel deployment URL (preview or production)
  if (process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL.replace(/\/$/, "");
    return host.startsWith("http") ? host : `https://${host}`;
  }

  return "http://localhost:3000";
}

export function getTrustedOrigins(): string[] {
  const origins = new Set<string>();

  const add = (value?: string | null) => {
    if (!value) return;
    const cleaned = value.replace(/\/$/, "");
    if (!cleaned) return;
    origins.add(cleaned);
    // also accept without trailing path
    try {
      const u = new URL(cleaned.startsWith("http") ? cleaned : `https://${cleaned}`);
      origins.add(u.origin);
    } catch {
      /* ignore */
    }
  };

  add(getAuthBaseURL());
  add(process.env.BETTER_AUTH_URL);
  add(process.env.NEXT_PUBLIC_APP_URL);
  add(process.env.NEXT_PUBLIC_BETTER_AUTH_URL);

  if (process.env.VERCEL_URL) {
    add(`https://${process.env.VERCEL_URL}`);
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }
  if (process.env.VERCEL_BRANCH_URL) {
    add(`https://${process.env.VERCEL_BRANCH_URL}`);
  }

  // Local dev
  add("http://localhost:3000");
  add("http://127.0.0.1:3000");
  add("http://localhost:3001");

  // Extra comma-separated allowlist: BETTER_AUTH_TRUSTED_ORIGINS=https://a.com,https://b.com
  const extra = process.env.BETTER_AUTH_TRUSTED_ORIGINS;
  if (extra) {
    for (const part of extra.split(",")) {
      add(part.trim());
    }
  }

  return Array.from(origins);
}

export function isProductionRuntime(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.VERCEL_ENV === "preview"
  );
}
