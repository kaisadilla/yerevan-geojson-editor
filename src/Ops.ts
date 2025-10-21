import * as turf from "@turf/turf";
import type { Feature, GeoJsonProperties, MultiPolygon, Polygon } from "geojson";
import GLT from "GLT";
import { shapeToPolygon, type MapperPolygon, type MapperShape } from "models/MapDocument";
import { v4 as uuid } from "uuid";

const Ops = {
  polygonUnion (
    receiver: MapperShape, target: MapperShape
  ) : MapperPolygon {
    receiver = shapeToPolygon(receiver);
    target = shapeToPolygon(target);

    const poly1 = GLT.mapper.polygon.turf(receiver);
    const poly2 = GLT.mapper.polygon.turf(target);

    const fusion = turf.union(turf.featureCollection([poly1, poly2]));
    return fusion ? getMapperPolygons(receiver, fusion) : receiver;
  },

  polygonDifference (
    receiver: MapperShape, target: MapperShape
  ) : MapperPolygon {
    receiver = shapeToPolygon(receiver);
    target = shapeToPolygon(target);

    const poly1 = GLT.mapper.polygon.turf(receiver);
    const poly2 = GLT.mapper.polygon.turf(target);

    const fusion = turf.difference(turf.featureCollection([poly1, poly2]));
    return fusion ? getMapperPolygons(receiver, fusion) : receiver;
  },

  polygonIntersection (
    receiver: MapperShape, target: MapperShape
  ) : MapperPolygon {
    receiver = shapeToPolygon(receiver);
    target = shapeToPolygon(target);

    const poly1 = GLT.mapper.polygon.turf(receiver);
    const poly2 = GLT.mapper.polygon.turf(target);

    const fusion = turf.intersect(turf.featureCollection([poly1, poly2]));
    return fusion ? getMapperPolygons(receiver, fusion) : receiver;
  },
}

function getMapperPolygons (
  base: MapperPolygon,
  gPolygon: Feature<Polygon | MultiPolygon, GeoJsonProperties>
) : MapperPolygon {
  if (gPolygon?.geometry.type === 'Polygon') {
    return {
      ...base,
      vertices: gPolygon.geometry.coordinates[0].slice(0, -1),
      holes: gPolygon.geometry.coordinates.slice(1).map((h, i) => ({
        type: 'Polygon',
        id: uuid(),
        name: "",
        properties: [],
        isHidden: false,
        vertices: h.slice(0, -1),
        holes: []
      })),
    } satisfies MapperShape;
  }
  else if (gPolygon?.geometry.type === 'MultiPolygon') {
    throw "Not yet implemented.";
  }
  else {
    throw "Not yet implemented.";
  }
}

export default Ops;
