/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
<<<<<<< HEAD
  allowedDevOrigins: ['10.125.141.175']
=======
  // allowedDevOrigins: ["10.218.103.183"],
>>>>>>> aryan-dev
};

export default nextConfig;
