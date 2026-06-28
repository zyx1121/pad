import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"

import * as schema from "./schema/index.ts"

let _client: pg.Pool | null = null

function getPool(): pg.Pool {
  if (!_client) {
    const url = process.env["DATABASE_URL"]
    if (!url) throw new Error("DATABASE_URL is required")
    _client = new pg.Pool({ connectionString: url })
  }
  return _client
}

export function getDb() {
  return drizzle(getPool(), { schema })
}

export type Db = ReturnType<typeof getDb>

export async function pingDb(): Promise<boolean> {
  try {
    const pool = getPool()
    await pool.query("SELECT 1")
    return true
  } catch {
    return false
  }
}
