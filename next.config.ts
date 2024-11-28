import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["api.dicebear.com"], // Agrega aquí el dominio
    dangerouslyAllowSVG: true, // Permite el uso de SVGs
  },
};

export default nextConfig;
