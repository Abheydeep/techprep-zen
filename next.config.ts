import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true
  },
  transpilePackages: ["@excalidraw/excalidraw"],
  experimental: {
    optimizePackageImports: ["lucide-react"]
  }
};

export default nextConfig;
