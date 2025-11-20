import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: '.next',
  // Add other Next.js configuration options here if needed
};

export default nextConfig;
