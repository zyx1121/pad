// Better Auth server instance — imported by the route handler and lib/principal.ts.
// Uses the shared pad-db via @workspace/domain's Drizzle instance.
// Tables (user / session / account / verification) are created by Better Auth's
// migration helper (run `bun run lib/auth-migrate.ts` or drizzle-kit generate).

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { getDb } from "@workspace/domain/db"

export const auth = betterAuth({
  // Canonical base URL — must match BETTER_AUTH_URL and Google OAuth redirect URI.
  // In production: https://pad.app.zyx.tw
  baseURL: process.env["BETTER_AUTH_URL"] ?? "http://localhost:3000",
  secret: process.env["BETTER_AUTH_SECRET"],

  database: drizzleAdapter(getDb(), {
    provider: "pg",
  }),

  socialProviders: {
    google: {
      clientId: process.env["GOOGLE_CLIENT_ID"] ?? "",
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"] ?? "",
    },
  },

  // Open sign-in: any Google account can log in and comment on public docs.
  // Owner identity (setVisibility / setShares) is enforced in @workspace/domain
  // ops via email === OWNER_EMAIL — not via an allowlist here.

  rateLimit: {
    enabled: true,
    window: 60, // seconds
    max: 20, // requests per window per IP
  },

  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
