import type { NextConfig } from 'next';
let withAnalyzer = (config: any) => config;
try {
  // conditionally require to avoid build failures when the package is not installed
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const bundle = require('@next/bundle-analyzer');
  withAnalyzer = bundle({ enabled: process.env.ANALYZE === 'true' });
} catch (e) {
  // ignore - analyzer not installed
}

const nextConfig: NextConfig = withAnalyzer({
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
  },
});

export default nextConfig;
