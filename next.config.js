const { createVanillaExtractPlugin } = require("@vanilla-extract/next-plugin");

/** @type {import('next').NextConfig} */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    appDir: true,
  },
  output: "standalone",
  reactStrictMode: true,
  // https://github.com/vanilla-extract-css/vanilla-extract/issues/1085
  // https://github.com/vercel/next.js/issues/49817
  webpack: (config) => {
    config.optimization.splitChunks = false;
    return config;
  },
};

module.exports = createVanillaExtractPlugin()(config);
