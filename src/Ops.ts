import * as turf from "@turf/turf";
import GLT from "GLT";
import type { MapperPolygon } from "models/MapDocument";

const Ops = {
  polygonUnion (receiver: MapperPolygon, target: MapperPolygon) : MapperPolygon {

    const poly1 = GLT.mapper.polygon.turf(receiver);
    const poly2 = GLT.mapper.polygon.turf(target);

    const fusion = turf.union(turf.featureCollection([poly1, poly2]));

    if (fusion?.geometry.type === 'Polygon') {
      return {
        ...receiver,
        vertices: fusion.geometry.coordinates[0].slice(0, -1),
        holes: fusion.geometry.coordinates.slice(1).map(h => h.slice(0, -1)),
      } satisfies MapperPolygon;
    }
    else if (fusion?.geometry.type === 'MultiPolygon') {
      throw "Not yet implemented.";
    }
    else {
      throw "Not yet implemented.";
    }
  }
}

export default Ops;
