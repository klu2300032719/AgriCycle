import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";
import {
  getAuthBaseURL,
  getTrustedOrigins,
  isProductionRuntime,
} from "@/lib/auth-url";

const baseURL = getAuthBaseURL();
const trustedOrigins = getTrustedOrigins();
const production = isProductionRuntime();

// Fail fast in production if secret is missing / too short
const secret = process.env.BETTER_AUTH_SECRET;
if (production && (!secret || secret.length < 32)) {
  console.error(
    "[auth] BETTER_AUTH_SECRET must be set and at least 32 characters in production.",
  );
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "farmer",
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      company: {
        type: "string",
        required: false,
        input: true,
      },
      location: {
        type: "string",
        required: false,
        input: true,
      },
      verified: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  advanced: {
    // HTTPS deployments (Vercel) require Secure cookies
    useSecureCookies: production,
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
      secure: production,
      path: "/",
    },
    // Helps when users hit both www and apex (set COOKIE_DOMAIN=.yourdomain.com if needed)
    ...(process.env.BETTER_AUTH_COOKIE_DOMAIN
      ? {
          crossSubDomainCookies: {
            enabled: true,
            domain: process.env.BETTER_AUTH_COOKIE_DOMAIN,
          },
        }
      : {}),
  },
  trustedOrigins,
  secret: secret || "dev-only-insecure-secret-change-me-32chars",
  baseURL,
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;

if (process.env.NODE_ENV !== "test") {
  console.info("[auth] baseURL=", baseURL, "trustedOrigins=", trustedOrigins);
}
