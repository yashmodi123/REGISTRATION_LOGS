import type { NextConfig } from 'next';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3001';

const nextConfig: NextConfig = {
  // Custom server.js handles routing in combined mode.
  // When running `next dev` (frontend-only), rewrites proxy API calls
  // to the backend running separately on BACKEND_URL (default: port 3001).
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: '/api-docs/:path*',
        destination: `${BACKEND_URL}/api-docs/:path*`,
      },
      {
        source: '/api-docs',
        destination: `${BACKEND_URL}/api-docs`,
      },
    ];
  },
};

export default nextConfig;

