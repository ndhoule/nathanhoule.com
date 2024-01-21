import type GeoJSON from "geojson";
import simplify from "simplify-geojson";
import jmtRoute from "../data/routes/jmt_full.json";
import pctRoute from "../data/routes/pct_full.json";
import uhtRoute from "../data/routes/uinta_highline_trail.json";

const DEFAULT_GEOJSON_RESAMPLE_TOLERANCE = 0.0001;

export const routes = new Map([
  [
    "pacific-crest-trail",
    {
      id: "pacific-crest-trail",
      label: "Pacific Crest Trail",
      data: (() => {
        const features = pctRoute as GeoJSON.FeatureCollection;
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
        const features = jmtRoute as GeoJSON.FeatureCollection;
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
        const features = uhtRoute as GeoJSON.FeatureCollection;
        return simplify(features, DEFAULT_GEOJSON_RESAMPLE_TOLERANCE);
      })(),
    },
  ],
]);
