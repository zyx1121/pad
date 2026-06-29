import { getAuth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

// Lazy per request — getAuth() defers getDb() past module load (build has no DATABASE_URL).
export async function GET(req: Request) {
  return toNextJsHandler(getAuth()).GET(req)
}

export async function POST(req: Request) {
  return toNextJsHandler(getAuth()).POST(req)
}
