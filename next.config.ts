import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**", // Permite cualquier ruta en este dominio
      },
    ],
    dangerouslyAllowSVG: true, // Permite el uso de SVGs
  },
};

export default nextConfig;
