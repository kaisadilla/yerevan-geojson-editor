import type { Position } from "geojson";
import { v4 as uuid } from "uuid";

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
export const LEAFLYS_DIR_SEPARATOR = "\\";

export const LEAFLYS_PROP_HIDDEN = LEAFLYS_PROP_PREFIX + "hidden";
export const LEAFLYS_PROP_GROUP = LEAFLYS_PROP_PREFIX + "group";

export interface BaseMapperElement {
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

export interface MapperPointData {
  type: 'Point';
  position: Position;
}

export interface MapperPoint extends BaseMapperElement, MapperPointData {
}

export interface MapperLineData {
  type: 'LineString';
  positions: Position[];
}

export interface MapperLine extends BaseMapperElement, MapperLineData {
}

export interface MapperPolygonData {
  type: 'Polygon';
  vertices: Position[];
  holes: MapperShape[];
}

export interface MapperPolygon extends BaseMapperElement, MapperPolygonData {
}

export interface MapperRegularPolygon extends MapperPolygon {
  holes: MapperPolygon[];
}

export interface MapperRectangleData {
  type: 'Rectangle';
  north: number;
  south: number;
  west: number;
  east: number;
  holes: MapperShape[];
}

export interface MapperRectangle extends BaseMapperElement, MapperRectangleData {
}

export interface MapperCircleData {
  type: 'Circle';
  center: Position;
  radius: number;
  holes: MapperShape[];
}

export interface MapperCircle extends BaseMapperElement, MapperCircleData {
}

export interface MapperImageData {
  type: 'Image';
  north: number;
  south: number;
  west: number;
  east: number;
  image: string;
  isBackgroundImage: boolean;
}

export interface MapperImage extends BaseMapperElement, MapperImageData {
}

/**
 * Represents a GeoJson Collection. In GeoJson, a Collection is a group of
 * geometries, and may or may not be restricted to one single Geometry type.
 * In memory, there's only one type of Collection, which gets converted to the
 * most appropriate GeoJson Collection type when the document is saved to disk.
 */
export interface MapperCollection extends BaseMapperElement {
  type: 'Collection';
  elements: MapperElement[];
}

/**
 * A MapperFeature is any MapperElement that represents to a GeoJson feature.
 */
export type MapperFeature = MapperPoint
  | MapperLine
  | MapperShape
  | MapperCollection
  ;

export type MapperShape = MapperPolygon
  | MapperRectangle
  | MapperCircle
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

export const PseudoContainerType = new Set<MapperElementType>([
  'Polygon',
  'Rectangle',
  'Circle',
] as MapperElementType[]);

/**
 * The types of `MapperElement` that can contain children.
 */
export const ContainerType = new Set<MapperElementType>([
  'Group',
  'Collection',
  ...PseudoContainerType,
] as MapperElementType[]);

export function isContainer (element: MapperElement) : boolean {
  return ContainerType.has(element.type);
}

export function isPseudoContainer (element: MapperElement) 
  : element is MapperPolygon | MapperRectangle | MapperCircle
{
  return PseudoContainerType.has(element.type);
}

/**
 * Converts a polygon and all of its holes into polygons.
 * @param poly The polygon to convert.
 */
export function polygonToPolygon (poly: MapperPolygon) : MapperRegularPolygon {
  return {
    ...poly,
    holes: poly.holes.map(h => shapeToPolygon(h)),
  };
}

export function rectangleToPolygon (rect: MapperRectangle) : MapperRegularPolygon {
  throw "Not yet implemented";
}

export function circleToPolygon (circle: MapperCircle) : MapperRegularPolygon {
  throw "Not yet implemented";
}

/**
 * Converts a shape and all of its holes into polygons.
 * @param shape The shape to convert.
 */
export function shapeToPolygon (shape: MapperShape) : MapperRegularPolygon {
  if (shape.type === 'Polygon') return polygonToPolygon(shape);
  if (shape.type === 'Rectangle') return rectangleToPolygon(shape);
  if (shape.type === 'Circle') return circleToPolygon(shape);

  throw `Unknown shape type.`;
}

export function isShape (element: MapperElement) : element is MapperShape {
  return element.type === 'Polygon'
    || element.type === 'Rectangle'
    || element.type === 'Circle'
    ;
}

export const ElementFactory = {
  group (name: string = "") : MapperGroup {
    return {
      type: 'Group',
      id: uuid(),
      name,
      properties: [],
      isHidden: false,
      elements: [],
    };
  },

  point (position: Position, name: string = "") : MapperPoint {
    return {
      type: 'Point',
      id: uuid(),
      name,
      properties: [],
      isHidden: false,
      position,
    };
  },

  polygon (name: string = "") : MapperPolygon {
    return {
      type: 'Polygon',
      id: uuid(),
      name,
      properties: [],
      isHidden: false,
      vertices: [],
      holes: [],
    };
  },
}
