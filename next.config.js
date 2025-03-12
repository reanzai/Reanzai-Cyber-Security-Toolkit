/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        bufferutil: 'bufferutil',
        'utf-8-validate': 'utf-8-validate',
      });
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/network/stream',
        destination: '/api/network/capture',
      },
    ];
  },
};

module.exports = nextConfig; 