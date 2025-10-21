import * as turf from "@turf/turf";
import type { Position } from "geojson";
import { LatLng } from "leaflet";
import { shapeToPolygon, type MapperPolygon } from "models/MapDocument";

/**
 * An object that contains methods to easily communicate between GeoJson,
 * Leaflet, Turf and any other library that deals with the world map.
 */
const GLT = {
  gj: {
    coord: {
      leaflet (coord: Position) {
        return [coord[1], coord[0]];
      },
      leafletObj (coord: Position) : LatLng {
        return new LatLng(coord[1], coord[0]);
      },
      isEqual (a: Position, b: Position) {
        return a[0] === b[0] && a[1] === b[1];
      },
    },
    coords: {
      leaflet (coords: Position[]) : [number, number][] {
        return coords.map(c => [c[1], c[0]]);
      },
      leafletObj (coords: Position[]) : LatLng[] {
        return coords.map(c => new LatLng(c[1], c[0]));
      },
    },
  },
  leaflet: {
    coord: {
      gj (coord: LatLng) : Position {
        return [coord.lng, coord.lat];
      }
    }
  },
  mapper: {
    polygon: {
      turf (polygon: MapperPolygon) {
        return turf.polygon([
          [ ...polygon.vertices, polygon.vertices[0] ],
          
          ...polygon.holes.map(h => {
            const poly = shapeToPolygon(h);

            return [ ...poly.vertices, poly.vertices[0] ];
          }),
        ]);
      },
    },
  },
};

export default GLT;
