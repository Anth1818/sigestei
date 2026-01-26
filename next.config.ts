import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  
  // Optional: Configure image optimization
  images: {
    domains: [], // Add your image domains here if needed
  },
};

export default nextConfig;
