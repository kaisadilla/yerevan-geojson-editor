import type { Feature, GeoJsonObject, GeoJsonProperties, Geometry, Point, Polygon } from "geojson";

/**
 * Represents a set of properties in a GeoJson element that contains properties
 * specific to this app.
 */
export type LElementProperties = GeoJsonProperties & {
  name: string;
  id: string;
  hidden: boolean;
};

/**
 * Represents a Feature that contains Leaflys properties.
 */
export type LFeature = Feature<Geometry, LElementProperties>;
export type LPoint = Feature<Point, LElementProperties>;
export type LPolygon = Feature<Polygon, LElementProperties>;

/**
 * Represents a FeatureCollection that can also contain nested
 * FeatureCollections. This is not valid GeoJson.
 */
export type LGroup = {
  type: 'FeatureCollection';
  features: LElement[];
  properties: LElementProperties;
}

/**
 * Represents either a GeoJson feature or a group.
 */
export type LElement = LFeature | LGroup;

export type LElementType = GeoJsonObject['type'] | 'FeatureCollection';

export type LMemoryDocument = LGroup & {
  properties: {
    activeColor: string;
  };
};

/**
 * GeoJson's coordinate format: an array representing longitude then latitude.
 * Note: GeoJson also allows for a third number representing altitude, but
 * currently this app does not support that.
 */
export type LngLat = [number, number];
