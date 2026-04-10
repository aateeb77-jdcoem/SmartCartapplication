import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.rocket.new",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "rukminim1.flixcart.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "rukminim2.flixcart.com",
        pathname: "/**",
      },
    ],
    qualities: [75, 85],
  },
};

export default nextConfig;
