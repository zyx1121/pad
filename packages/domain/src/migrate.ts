// Run pending Drizzle migrations. Called by apps/mcp on startup before accepting traffic.
import { migrate } from "drizzle-orm/node-postgres/migrator"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { getDb } from "./db.ts"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// migrations live at the repo root (drizzle.config out = ../../migrations from
// packages/domain); from packages/domain/src that's three levels up.
const migrationsFolder = path.resolve(__dirname, "../../../migrations")

export async function runMigrations(): Promise<void> {
  const db = getDb()
  await migrate(db, { migrationsFolder })
  console.log("[domain] migrations applied")
}
