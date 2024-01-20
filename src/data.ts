import fs from "node:fs";
import path from "node:path";
import type GeoJSON from "geojson";
import simplify from "simplify-geojson";

const DEFAULT_GEOJSON_RESAMPLE_TOLERANCE = 0.0001;

export const routes = new Map([
  [
    "pacific-crest-trail",
    {
      id: "pacific-crest-trail",
      label: "Pacific Crest Trail",
      data: (() => {
        const features = JSON.parse(
          fs.readFileSync(
            path.join(process.cwd(), "data/routes/pct_full.json"),
            "utf8",
          ),
        ) as GeoJSON.FeatureCollection;
        return simplify(features, DEFAULT_GEOJSON_RESAMPLE_TOLERANCE);
      })(),
    },
  ],
  [
    "john-muir-trail",
    {
      id: "john-muir-trail",
      label: "John Muir Trail",
      data: (() => {
        const features = JSON.parse(
          fs.readFileSync(
            path.join(process.cwd(), "data/routes/jmt_full.json"),
            "utf8",
          ),
        ) as GeoJSON.FeatureCollection;
        return simplify(features, DEFAULT_GEOJSON_RESAMPLE_TOLERANCE);
      })(),
    },
  ],
  [
    "uinta-highline-trail",
    {
      id: "uinta-highline-trail",
      label: "Uinta Highline Trail",
      data: (() => {
        const features = JSON.parse(
          fs.readFileSync(
            path.join(process.cwd(), "data/routes/uinta_highline_trail.json"),
            "utf8",
          ),
        ) as GeoJSON.FeatureCollection;
        return simplify(features, DEFAULT_GEOJSON_RESAMPLE_TOLERANCE);
      })(),
    },
  ],
]);
