/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "backend.ashsheefahospital.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5555",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "5555",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
