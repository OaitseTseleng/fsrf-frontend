import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'], // Allow localhost for image loading
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: {
    buildActivity: false,
  },
  onDemandEntries: {
    // Disable reloading unused pages
    maxInactiveAge: 1000 * 60 * 60,
    pagesBufferLength: 0,
  },
};

export default nextConfig;
