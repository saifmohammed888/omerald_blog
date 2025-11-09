/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Suppress unnecessary warnings
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blog.omerald.com',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig

