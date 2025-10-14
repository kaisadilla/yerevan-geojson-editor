import { useActiveElement } from "context/useActiveElement";
import GLT from "GLT";
import type { MapperPolygon } from "models/MapDocument";
import { Polygon } from "react-leaflet";
import { useDispatch } from "react-redux";

export interface MapPolygonProps {
  polygon: MapperPolygon;
}

function MapPolygon ({
  polygon,
}: MapPolygonProps) {
  const active = useActiveElement();
  const dispatch = useDispatch();

  return (
    <Polygon
      positions={[
        GLT.gj.coords.leaflet(polygon.vertices),
        ...polygon.holes.map(h => GLT.gj.coords.leaflet(h)),
      ]}
      weight={2}
      color='var(--color-primary-d1)'
      eventHandlers={{
        click: () => active.setElement(polygon.id, true)
      }}
    />
  );
}

export default MapPolygon;
