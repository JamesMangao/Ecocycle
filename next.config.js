/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ]
  },
  // Use standalone output for server rendering
  output: 'standalone',
  // Increase or disable the timeout for static generation to allow fallback to SSR
  staticPageGenerationTimeout: 1000,
  // Disable static optimization - this helps with dynamic pages
  experimental: {
    isrMemoryCacheSize: 0,
  }
}

module.exports = nextConfig
