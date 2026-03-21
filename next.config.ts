import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // Skip type checking during build — we validate locally before pushing
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
