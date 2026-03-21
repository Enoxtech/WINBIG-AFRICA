import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['api.winbig.africa'],
  },
  // Removed turbo: {} — causes Node v24 crash during static generation
};

export default nextConfig;
