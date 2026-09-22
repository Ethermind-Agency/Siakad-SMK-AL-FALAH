import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ── Compiler optimizations ────────────────────────────────────────────────
  // Remove console.log in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // ── Image optimization ────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24, // 24h
  },

  // ── Experimental optimizations ────────────────────────────────────────────
  experimental: {
    // Optimise lucide-react barrel imports — prevents bundling ALL icons
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-avatar',
    ],
  },

  // ── Headers ───────────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Aggressive caching for static assets
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // No-cache for API routes (session-sensitive)
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;
