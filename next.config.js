/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      }
    ]
  },
  output: 'standalone',
  serverExternalPackages: ['pdf-lib', 'sharp'],
};

module.exports = nextConfig;
