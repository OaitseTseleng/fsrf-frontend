import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'], // Allow localhost for image loading
  },
};

export default nextConfig;
