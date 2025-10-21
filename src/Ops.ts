import * as turf from "@turf/turf";
import type { Feature, GeoJsonProperties, MultiPolygon, Polygon } from "geojson";
import GLT from "GLT";
import type { MapperPolygon } from "models/MapDocument";

const Ops = {
  polygonUnion (
    receiver: MapperPolygon, target: MapperPolygon
  ) : MapperPolygon {
    const poly1 = GLT.mapper.polygon.turf(receiver);
    const poly2 = GLT.mapper.polygon.turf(target);

    const fusion = turf.union(turf.featureCollection([poly1, poly2]));
    return fusion ? getMapperPolygons(receiver, fusion) : receiver;
  },

  polygonDifference (
    receiver: MapperPolygon, target: MapperPolygon
  ) : MapperPolygon {
    const poly1 = GLT.mapper.polygon.turf(receiver);
    const poly2 = GLT.mapper.polygon.turf(target);

    const fusion = turf.difference(turf.featureCollection([poly1, poly2]));
    return fusion ? getMapperPolygons(receiver, fusion) : receiver;
  },

  polygonIntersection (
    receiver: MapperPolygon, target: MapperPolygon
  ) : MapperPolygon {
    const poly1 = GLT.mapper.polygon.turf(receiver);
    const poly2 = GLT.mapper.polygon.turf(target);

    const fusion = turf.intersect(turf.featureCollection([poly1, poly2]));
    return fusion ? getMapperPolygons(receiver, fusion) : receiver;
  },
}

function getMapperPolygons (
  base: MapperPolygon,
  gjPolygon: Feature<Polygon | MultiPolygon, GeoJsonProperties>
) : MapperPolygon {
  if (gjPolygon?.geometry.type === 'Polygon') {
    return {
      ...base,
      vertices: gjPolygon.geometry.coordinates[0].slice(0, -1),
      holes: gjPolygon.geometry.coordinates.slice(1).map(h => h.slice(0, -1)),
    } satisfies MapperPolygon;
  }
  else if (gjPolygon?.geometry.type === 'MultiPolygon') {
    throw "Not yet implemented.";
  }
  else {
    throw "Not yet implemented.";
  }
}

export default Ops;
