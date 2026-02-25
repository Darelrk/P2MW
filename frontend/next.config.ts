import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    unoptimized: false,
    qualities: [25, 50, 65, 75, 90, 100],
    minimumCacheTTL: 31536000
  }
};

export default nextConfig;
