/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*", // allow images from all sources
        // hostname: "img.clerk.com", // allow images from clerk
      },
      {
        protocol: "http",
        hostname: "*",
      },
    ],
  },

  // Minimize logs in the terminal
  logging: false,

  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
