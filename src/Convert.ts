import type { LngLat, LPolygon } from "models/MapDocument";


const Convert = {
  geoJson: {
    coord: {
      leafletPosition (coord: LngLat) {
        return [coord[1], coord[0]];
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
};

export default Convert;
