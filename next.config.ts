import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet',
          },
        ],
      },
    ];
  },
  async rewrites() {
    const cmsBase = (
      process.env.OPTIMIZELY_CMS_URL ||
      'https://app-fecu01saas6fn6qt001.cms.optimizely.com'
    ).replace(/\/$/, '');

    return [
      {
        source: '/opti-media/cmp/:path*',
        destination: 'https://images1.cmp.optimizely.com/:path*',
      },
      {
        source: '/opti-media/:path*',
        destination: `${cmsBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
