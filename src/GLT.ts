import type { Position } from "geojson";
import { LatLng } from "leaflet";
import type { LPolygon } from "models/MapDocumentREMOVE";

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
    polygon: {
      leafletPositions (polygon: LPolygon) {
        return polygon.geometry.coordinates.map(
          shape => shape.map(
            poly => [poly[1], poly[0]]
          )
        );
      },
    },
  },
  leaflet: {
    coord: {
      gj (coord: LatLng) : Position {
        return [coord.lng, coord.lat];
      }
    }
  }
};

export default GLT;
