/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
    ],
  },
  // allowedDevOrigins: ["10.218.103.183"],
  allowedDevOrigins: ['10.125.141.175'],
  // allowedDevOrigins: ["10.218.103.183"],
};

export default nextConfig;
