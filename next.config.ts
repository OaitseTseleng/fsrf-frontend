import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['13.218.95.118'], // Allow 13.218.95.118 for image loading
  },
  experimental: {
    // Replace this with your actual domain or IP
    allowedDevOrigins: ['http://13.218.95.118'],
  },
  devIndicators: false
};

export default nextConfig;
