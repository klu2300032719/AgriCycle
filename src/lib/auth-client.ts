"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Do NOT hardcode localhost here.
 * Omitting baseURL makes the client call `/api/auth` on the current origin,
 * which is correct for Vercel production and previews.
 *
 * If NEXT_PUBLIC_APP_URL is set at build time to localhost, baking it into
 * the client bundle breaks production sign-in — so we never use it on the client.
 */
export const authClient = createAuthClient({
  basePath: "/api/auth",
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
