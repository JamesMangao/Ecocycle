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
  // Use standalone output instead of static export
  // This allows for server-side rendering and dynamic pages
  output: 'standalone',
}

module.exports = nextConfig
