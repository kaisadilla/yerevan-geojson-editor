import * as turf from "@turf/turf";
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { circleToPolygon, LEAFLYS_DIR_SEPARATOR, LEAFLYS_PROP_EAST, LEAFLYS_PROP_GROUP, LEAFLYS_PROP_HIDDEN, LEAFLYS_PROP_NORTH, LEAFLYS_PROP_SOUTH, LEAFLYS_PROP_TYPE, LEAFLYS_PROP_WEST, polygonToPolygon, rectangleToPolygon, type MapperCircle, type MapperCollection, type MapperDocument, type MapperElement, type MapperGroup, type MapperLine, type MapperPoint, type MapperPolygon, type MapperRectangle, type MapperRegularPolygon } from "models/MapDocument";

type GFeature = Feature<Geometry, GeoJsonProperties>;

export default function createMapperFile (
  doc: MapperDocument
) : FeatureCollection {
  const root: FeatureCollection & { properties: GeoJsonProperties } = {
    type: 'FeatureCollection',
    features: [],
    properties: [],
  };

  for (const el of doc.elements) {
    const feats = convertElement(el, []);

    root.features.push(...feats);
  }

  return root;
}

function convertElement (el: MapperElement, dir: string[]) : GFeature[] {
  switch (el.type) {
    case 'Group': return convertGroup(el, dir);
    case 'Collection': return convertCollection(el, dir);
    case 'Point': return convertPoint(el, dir);
    case 'LineString': return convertLine(el, dir);
    case 'Polygon': return convertPolygon(el, dir);
    case 'Rectangle': return convertRectangle(el, dir);
    case 'Circle': return convertCircle(el, dir);
  }
}

function convertGroup (
  group: MapperGroup, dir: string[]
) : GFeature[] {
  const arr: GFeature[] = [];

  for (const el of group.elements) {
    const gj = convertElement(el, [...dir, group.name]);
    
    arr.push(...gj);
  }

  return arr;
}

function convertCollection (
  col: MapperCollection, dir: string[]
) : GFeature[] {
  throw "Not yet implemented.";
}

function convertPoint (
  point: MapperPoint, dir: string[]
) : GFeature[] {
  const gj = turf.point(point.position, generateProps(point, dir));

  return [gj];
}

function convertLine (
  line: MapperLine, dir: string[]
) : GFeature[] {
  const gj = turf.lineString(line.positions, generateProps(line, dir));

  return [gj];
}

function convertPolygon (
  poly: MapperPolygon, dir: string[]
) : GFeature[] {
  return convertRegularPolygon(polygonToPolygon(poly), dir);
}

function convertRectangle (
  rect: MapperRectangle, dir: string[]
) : GFeature[] {
  const res = convertRegularPolygon(rectangleToPolygon(rect), dir);

  if (res.length === 1 && res[0].properties) {
    res[0].properties[LEAFLYS_PROP_TYPE] = 'Rectangle';
    res[0].properties[LEAFLYS_PROP_NORTH] = rect.north;
    res[0].properties[LEAFLYS_PROP_SOUTH] = rect.south;
    res[0].properties[LEAFLYS_PROP_WEST] = rect.west;
    res[0].properties[LEAFLYS_PROP_EAST] = rect.east;
  }

  return res;
}

function convertCircle (
  circle: MapperCircle, dir: string[]
) : GFeature[] {
  return convertRegularPolygon(circleToPolygon(circle), dir);
}

function convertRegularPolygon (
  poly: MapperRegularPolygon, dir: string[]
) : GFeature[] {
  const gj = turf.polygon(
    [
      [ ...poly.vertices, poly.vertices[0] ],
      ...poly.holes.map(h => [ ...h.vertices, h.vertices[0] ]),
    ],
    generateProps(poly, dir),
  );

  return [gj];
}

function generateProps (
  el: MapperElement, dir: string[]
) : GeoJsonProperties {
  const props: GeoJsonProperties = {
    id: el.id,
    name: el.name,
  }

  for (const userProp of el.properties) {
    props[userProp.name] = userProp.value;
  }

  if (el.isHidden) {
    props[LEAFLYS_PROP_HIDDEN] = true;
  }
  if (dir.length > 0) {
    props[LEAFLYS_PROP_GROUP] = dir.join(LEAFLYS_DIR_SEPARATOR);
  }

  return props;
}
