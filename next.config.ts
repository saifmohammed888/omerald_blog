import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'omerald.com',
      },
      {
        protocol: 'https',
        hostname: 'omerald.com',
      },
      {
        protocol: 'http',
        hostname: 'medin.life',
      },
      {
        protocol: 'https',
        hostname: 'medin.life',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
