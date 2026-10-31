interface ImportMetaEnv {
  readonly PUBLIC_MAPTILER_API_KEY?: string;
}

declare module "*.json?simplified" {
  const value: import("geojson").FeatureCollection;
  export default value;
}
