import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    domains: ["api.dicebear.com"],
  },
};

export default nextConfig;
