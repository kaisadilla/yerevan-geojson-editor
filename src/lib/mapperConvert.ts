import type { Feature, FeatureCollection, GeoJSON, GeoJsonProperties, Geometry, Position } from "geojson";
import * as gValidator from 'geojson-validation';
import Logger from "Logger";
import { LEAFLYS_DIR_SEPARATOR, LEAFLYS_PROP_GROUP, LEAFLYS_PROP_HIDDEN, LEAFLYS_PROP_PREFIX, type MapperDocument, type MapperElement, type MapperFeature, type MapperGroup, type MapperLine, type MapperLineData, type MapperPoint, type MapperPointData, type MapperPolygon, type MapperPolygonData } from "models/MapDocument";
import { stripExtension } from "utils";
import { v4 as uuid } from "uuid";

export function loadMapperFile (
  filename: string, content: string
) : MapperDocument | null {
  let json;
  try {
    json = JSON.parse(content);
  }
  catch (err) {
    Logger.info("Tried to load an invalid json document.", content);
    return null;
  }

  const errors = gValidator.valid(json, true);
  
  if (errors.length > 0) {
    Logger.info("Invalid GeoJSON", errors);
    return null;
  }

  const geojson = json as GeoJSON;

  const doc: MapperDocument = {
    type: 'Group',
    id: uuid(),
    name: stripExtension(filename),
    isHidden: false,
    properties: [],
    elements: [],
  };
  
  if (
    geojson.type === 'Point'
    || geojson.type === 'MultiPoint'
    || geojson.type === 'LineString'
    || geojson.type === 'MultiLineString'
    || geojson.type === 'Polygon'
    || geojson.type === 'MultiPolygon'
    || geojson.type === 'GeometryCollection'
  ) {
    doc.elements.push(GToMapper.geometryAsFeature(geojson));
  }
  else if (geojson.type === 'Feature') {
    doc.elements.push(GToMapper.feature(geojson));
  }
  else {
    const group = GToMapper.featureCollection(geojson, true);
    doc.elements = group.elements;
  }

  return doc;
}

/**
 * Converts GeoJson data into Mapper data.
 */
export const GToMapper = {
  featureCollection (
    col: FeatureCollection<Geometry, GeoJsonProperties>,
    rebuildHierarchy: boolean,
  ) : MapperGroup {
    const group = makeGroup();

    const groupCache: Record<string, MapperGroup> = {};

    for (const gFeat of col.features) {
      const mFeat = GToMapper.feature(gFeat);

      if (rebuildHierarchy === false) {
        group.elements.push(mFeat);
        continue;
      }

      const dirPath = gFeat.properties?.[LEAFLYS_PROP_GROUP];

      if (!dirPath) {
        group.elements.push(mFeat);
      }
      else if (groupCache[dirPath]) {
        groupCache[dirPath].elements.push(mFeat);
      }
      else {
        const names = dirPath.split(LEAFLYS_DIR_SEPARATOR);

        let parent = group;

        for (const dir of names) {
          let next = parent.elements.find(g => g.name === dir);

          if (!next) {
            next = makeGroup();
            next.name = dir;
            parent.elements.push(next);
          }
          else if (next.type !== 'Group') {
            Logger.info("Invalid dir path.", dirPath);
            break;
          }
          
          parent = next;
        }

        parent.elements.push(mFeat);
        groupCache[dirPath] = parent;
      }
    }

    return group;
  },

  feature (
    gFeature: Feature<Geometry, GeoJsonProperties>
  ) : MapperElement {
    const mFeat = GToMapper.geometryAsFeature(gFeature.geometry);

    if (gFeature.properties) {
      for (const key of Object.keys(gFeature.properties)) {
        if (key === "id") {
          mFeat.id = gFeature.properties["id"];
        }
        else if (key === "name") {
          mFeat.name = gFeature.properties["name"];
        }
        else if (key === LEAFLYS_PROP_HIDDEN) {
          mFeat.isHidden = gFeature.properties[key] === true;
        }
        else if (key === LEAFLYS_PROP_GROUP) {
          // Ignore this property.
        }
        else if (key.startsWith(LEAFLYS_PROP_PREFIX)) {
          Logger.info(`Ignored unknown leaflys property '${key}'.`);
        }
        else {
          mFeat.properties.push({
            id: uuid(),
            name: key,
            value: gFeature.properties[key],
          });
        }
      }
    }

    return mFeat;
  },

  geometryAsFeature (geometry: Geometry) : MapperFeature {
    if (geometry.type === 'Point') {
      return featureFromData(GToMapper.point(geometry.coordinates));
    }
    if (geometry.type === 'LineString') {
      return featureFromData(GToMapper.line(geometry.coordinates));
    }
    if (geometry.type === 'Polygon') {
      return featureFromData(GToMapper.polygon(geometry.coordinates));
    }

    let feats: MapperFeature[];

    if (geometry.type === 'MultiPoint') {
      feats = geometry.coordinates.map(c => featureFromData(GToMapper.point(c)));
    }
    else if (geometry.type === 'MultiLineString') {
      feats = geometry.coordinates.map(c => featureFromData(GToMapper.line(c)));
    }
    else if (geometry.type === 'MultiPolygon') {
      feats = geometry.coordinates.map(c => featureFromData(GToMapper.polygon(c)));
    }
    else if (geometry.type === 'GeometryCollection') {
      feats = geometry.geometries.map(g => GToMapper.geometryAsFeature(g));
    }
    else {
      throw "Invalid geometry type.";
    }

    return {
      type: 'Collection',
      id: uuid(),
      name: "",
      isHidden: false,
      properties: [],
      elements: feats,
    }
  },

  point (point: Position) : MapperPointData {
    return {
      type: 'Point',
      position: point,
    };
  },

  line (line: Position[]) : MapperLineData {
    return {
      type: 'LineString',
      positions: line,
    };
  },

  polygon (poly: Position[][]) : MapperPolygonData {
    let vertices = poly[0];
    if (isRingClosed(vertices)) vertices = vertices.slice(0, -1);

    let holes: Position[][] = [];

    for (let i = 1; i < poly.length; i++) {
      let h = poly[i];
      if (isRingClosed(h)) h = h.slice(0, -1);

      holes.push(h);
    }

    return {
      type: 'Polygon',
      vertices,
      holes: holes.map(h => ({
        type: 'Polygon',
        id: uuid(),
        name: "",
        properties: [],
        isHidden: false,
        vertices: h,
        holes: [],
      })),
    };
  },
}

/**
 * Given an array of verts, returns whether they form a closed ring (i.e. its
 * first and last vertex are the same).
 * @param verts The array of verts.
 */
export function isRingClosed (verts: Position[]) : boolean {
  const first = verts[0];
  const last = verts[verts.length - 1];

  return first[0] === last[0] && first[1] === last[1];
}

type FeatureFromData<TData> =
  TData extends MapperPointData ? MapperPoint :
  TData extends MapperLineData ? MapperLine :
  TData extends MapperPolygonData ? MapperPolygon : never;

export function featureFromData<TData> (data: TData) : FeatureFromData<TData> {
  return {
    ...data,
    id: uuid(),
    name: "",
    isHidden: false,
    properties: [],
  } as FeatureFromData<TData>;
}

export function makeGroup () : MapperGroup {
  return {
    type: 'Group',
    id: uuid(),
    name: "",
    properties: [],
    isHidden: false,
    elements: [],
  };
}
