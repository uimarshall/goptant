import type { NextConfig } from "next";

// import { dirname } from 'node:path';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },

  images: {
    remotePatterns: [new URL(`${process.env.BLOB_STORAGE_BASE_URL}/**`)],
  },
  // turbopack: {
  //   root: dirname(__dirname),
  // },
};

export default nextConfig;
