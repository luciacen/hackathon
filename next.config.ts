import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: '/hackathon', // Cambia con il nome della tua sottocartella
  assetPrefix: '/hackathon/', // Cambia con il nome della tua sottocartella
  /* config options here */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
export const basePath = nextConfig.basePath;
export const assetPrefix = nextConfig.assetPrefix;