import type { Position } from "geojson";

/**
 * An entry in a GeoJson property object. The name will act as the key. The id
 * is not preserved between sessions.
 */
export interface MapperProperty {
  id: string;
  name: string;
  value: string;
}

/**
 * The prefix used for Leaflys-defined GeoJson properties.
 */
export const LEAFLYS_PROP_PREFIX = "_leaflys_";

interface BaseMapperElement {
  /**
   * An id that uniquely identifies this element. This id will be saved in
   * GeoJson's property collection under the reserved key 'id'.
   */
  id: string;
  /**
   * The element's name. This name will be saved in GeoJson's property
   * collection under the reserved key 'name'.
   */
  name: string;
  /**
   * A list of user-defined properties for GeoJson's property collection.
   */
  properties: MapperProperty[];
  /**
   * True when the element (and all of its children) are hidden in the editor.
   */
  isHidden: boolean;
}

/**
 * Represents a folder in a Mapper document. Folders only exist in memory - the
 * document gets flattened when saved to disk and hierarchy is preserved in
 * GeoJson properties.
 */
export interface MapperGroup extends BaseMapperElement {
  type: 'Group';
  elements: MapperElement[];
}

export interface MapperPoint extends BaseMapperElement {
  type: 'Point';
  position: Position;
}

export interface MapperLine extends BaseMapperElement {
  type: 'LineString';
  positions: Position[];
}

export interface MapperPolygon extends BaseMapperElement {
  type: 'Polygon';
  vertices: Position[];
  holes: Position[][];
}

/**
 * Represents a GeoJson Collection. In GeoJson, a Collection is a group of
 * geometries, and may or may not be restricted to one single Geometry type.
 * In memory, there's only one type of Collection, which gets converted to the
 * most appropriate GeoJson Collection type when the document is saved to disk.
 */
export interface MapperCollection extends BaseMapperElement {
  type: 'Collection';
  features: MapperFeature;
}

/**
 * A MapperFeature is any MapperElement that represents to a GeoJson feature.
 */
export type MapperFeature = MapperPoint
  | MapperLine
  | MapperPolygon
  | MapperCollection
  ;

/**
 * A MapperElement is either a MapperFeature or a MapperGroup.
 */
export type MapperElement = MapperGroup | MapperFeature;

/**
 * A string identifying a type of MapperElement.
 */
export type MapperElementType = MapperElement['type'];

/**
 * The root of a Mapper document. It map's to GeoJson's root FeatureCollection.
 */
export type MapperDocument = MapperGroup;
