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
