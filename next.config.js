const { createVanillaExtractPlugin } = require("@vanilla-extract/next-plugin");

/** @type {import('next').NextConfig} */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: "/trips/2023/pacific-crest-trail",
        destination: "/hiking/trips/2023/pacific-crest-trail/map",
        permanent: true,
      },
      {
        source: "/trips/2020/john-muir-trail",
        destination: "/hiking/trips/2020/john-muir-trail/map",
        permanent: true,
      },
    ];
  },
  rewrites: async () => {
    return [
      {
        source: "/.well-known/:path*",
        destination: "/api/.well-known/:path*",
      },
    ];
  },
};

module.exports = createVanillaExtractPlugin()(config);
