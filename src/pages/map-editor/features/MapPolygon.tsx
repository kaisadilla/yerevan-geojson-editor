import { Polygon } from "react-leaflet";
import type { LPolygon } from "state/geojsonDocSlice";

export interface MapPolygonProps {
  polygon: LPolygon;
}

function MapPolygon ({
  polygon,
}: MapPolygonProps) {

  return (
    <Polygon
      positions={polygon.geometry.coordinates.map(
        shape => shape.map(
          poly => [poly[1], poly[0]]
        )
      )}
      weight={2}
      color='var(--color-primary-d1)'
    />
  );
}

export default MapPolygon;
