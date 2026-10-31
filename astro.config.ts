import node from "@astrojs/node";
import react from "@astrojs/react";
import { readFile } from "node:fs/promises";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import type { AstroIntegration } from "astro";
import { defineConfig, fontProviders } from "astro/config";
import type GeoJSON from "geojson";
import simplify from "simplify-geojson";

const bundleServerDependencies = (): AstroIntegration => ({
  name: "bundle-server-dependencies",
  hooks: {
    "astro:config:setup": ({ command, updateConfig }) => {
      if (command === "build") {
        updateConfig({ vite: { ssr: { noExternal: true } } });
      }
    },
  },
});

const simplifiedGeoJSON = {
  name: "simplified-geojson",
  enforce: "pre" as const,
  load: async (id: string) => {
    const [path, query] = id.split("?");
    if (path == null || query !== "simplified") {
      return null;
    }
    const data = JSON.parse(
      await readFile(path, "utf8"),
    ) as GeoJSON.FeatureCollection;
    return {
      code: JSON.stringify(simplify(data, 0.0001)),
      moduleType: "json" as const,
    };
  },
};

export default defineConfig({
  adapter: node({ mode: "standalone" }),
  fonts: [
    {
      cssVariable: "--header-font-family",
      name: "Inter",
      provider: fontProviders.google(),
      styles: ["normal"],
      subsets: ["latin"],
      weights: [700],
    },
    {
      cssVariable: "--base-font-family",
      name: "Lato",
      provider: fontProviders.google(),
      styles: ["normal"],
      subsets: ["latin"],
      weights: [400, 700],
    },
  ],
  integrations: [bundleServerDependencies(), react()],
  redirects: {
    "/trips/2020/john-muir-trail": "/hiking/trips/2020/john-muir-trail/map",
    "/trips/2023/pacific-crest-trail":
      "/hiking/trips/2023/pacific-crest-trail/map",
  },
  server: { port: 3000 },
  vite: {
    plugins: [simplifiedGeoJSON, vanillaExtractPlugin()],
  },
});
