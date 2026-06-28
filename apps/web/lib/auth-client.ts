// Better Auth browser client — used in Client Components for sign-in / sign-out.
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
})

export const { signIn, signOut, useSession } = authClient
