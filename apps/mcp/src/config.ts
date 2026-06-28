export const config = {
  port: parseInt(process.env["PORT"] ?? "8080", 10),
  mcpPath: process.env["MCP_PATH"] ?? "/mcp",
  // Bearer token required on /mcp. Warn on startup if unset (dev-only).
  mcpWriteToken: process.env["MCP_WRITE_TOKEN"] ?? "",
  ownerEmail: process.env["OWNER_EMAIL"] ?? "",
  defaultVisibility: (process.env["DEFAULT_VISIBILITY"] ?? "private") as
    | "private"
    | "shared"
    | "public",
}
