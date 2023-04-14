declare module "@mapbox/togeojson" {
  export type BBox =
    | [number, number, number, number]
    | [number, number, number, number, number, number];

  export type GeoJsonTypes =
    | "Point"
    | "MultiPoint"
    | "LineString"
    | "MultiLineString"
    | "Polygon"
    | "MultiPolygon"
    | "GeometryCollection"
    | "Feature"
    | "FeatureCollection";

  export interface GeoJsonObject {
    type: GeoJsonTypes;
    bbox?: BBox | undefined;
  }

  export interface ToGeoJson {
    kml(doc: Document | HTMLElement): GeoJsonObject;
    gpx(doc: Document | HTMLElement): GeoJsonObject;
  }

  declare const toGeoJson: ToGeoJson;
  export default toGeoJson;
}
