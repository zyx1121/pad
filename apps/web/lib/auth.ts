// Better Auth server instance — imported by the route handler and lib/principal.ts.
// Uses the shared pad-db via @workspace/domain's Drizzle instance.
// Tables (user / session / account / verification) are defined in
// packages/domain/src/schema/auth.ts and included in the shared drizzle migration.
//
// IMPORTANT: getDb() must not be called at module load time (CLI / build-time imports
// would throw without DATABASE_URL). The lazy getter below ensures DB init only happens
// at first request, never at import time.

import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { getDb } from "@workspace/domain/db"
import * as authSchema from "@workspace/domain/schema/auth"

function makeAuth() {
  return betterAuth({
    // Canonical base URL — must match BETTER_AUTH_URL and Google OAuth redirect URI.
    // In production: https://pad.app.zyx.tw
    baseURL: process.env["BETTER_AUTH_URL"] ?? "http://localhost:3000",
    secret: process.env["BETTER_AUTH_SECRET"],

    database: drizzleAdapter(getDb(), {
      provider: "pg",
      // Wire better-auth to the domain-managed drizzle schema so it resolves
      // user / session / account / verification via the same migration set.
      schema: authSchema,
      usePlural: false,
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
}

// Lazy singleton — built on first call, never at module evaluation time, so build /
// CLI imports don't hit getDb() without DATABASE_URL. Returns the REAL betterAuth
// instance (not a Proxy): toNextJsHandler relies on `"handler" in auth` detection and
// `this` binding, both of which a Proxy over an empty target silently breaks.
let _auth: ReturnType<typeof makeAuth> | null = null

export function getAuth(): ReturnType<typeof makeAuth> {
  if (!_auth) _auth = makeAuth()
  return _auth
}

export type Session = ReturnType<typeof makeAuth>["$Infer"]["Session"]
