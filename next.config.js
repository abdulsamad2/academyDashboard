/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
  images: {
    domains: ['utfs.io','res.cloudinary.com']
  }
};

module.exports = nextConfig;
