import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Custom server.js handles routing — no standalone/export output needed
  images: { unoptimized: true },
};

export default nextConfig;
