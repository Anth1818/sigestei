import type { NextConfig } from "next";

const isStandaloneBuild = process.env.NEXT_OUTPUT === "standalone";

const nextConfig: NextConfig = {
  /* config options here */
  output: isStandaloneBuild ? "standalone" : undefined,

  // Optional: Configure image optimization
  images: {
    domains: [], // Add your image domains here if needed
  },
};

export default nextConfig;
