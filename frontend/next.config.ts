import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    qualities: [25, 50, 65, 75, 90, 100],
    minimumCacheTTL: 31536000
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/login',
        destination: '/api/admin/login',
      },
      {
        source: '/custom/preview',
        destination: '/api/custom/preview',
      },
      {
        source: '/admin/products/:id*',
        destination: '/api/admin/products/:id*',
      }
    ]
  }
};

export default nextConfig;
