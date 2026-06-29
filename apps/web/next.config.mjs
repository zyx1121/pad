import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // monorepo: trace from the repo root so workspace deps land in standalone output
  outputFileTracingRoot: join(__dirname, "../.."),
  transpilePackages: ["@workspace/ui", "@workspace/domain"],
}

export default nextConfig
