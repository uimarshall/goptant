import type { NextConfig } from "next";

// import { dirname } from 'node:path';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  // turbopack: {
  //   root: dirname(__dirname),
  // },
};

export default nextConfig;
