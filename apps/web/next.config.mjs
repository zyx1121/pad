/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@workspace/ui", "@workspace/domain"],
}

export default nextConfig
