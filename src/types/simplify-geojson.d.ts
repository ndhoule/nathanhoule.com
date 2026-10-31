declare module "simplify-geojson" {
  import type GeoJSON from "geojson";

  // TODO(ndhoule): This type is incomplete
  const simplify: (
    input: GeoJSON.FeatureCollection,
    tolerance?: number,
  ) => GeoJSON.FeatureCollection;

  export default simplify;
}
