/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "upstatemdweightloss.com",
      },
      {
        protocol: "https",
        hostname: "hyrhealth-dev.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "hyrhealth-dev.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "hyrtech-dev.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
