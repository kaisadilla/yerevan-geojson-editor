import Convert from "Convert";
import type { LPolygon } from "models/MapDocument";
import { Polygon } from "react-leaflet";
import { useDispatch } from "react-redux";
import { mapEditorDocActions } from "state/mapEditor/docSlice";

export interface MapPolygonProps {
  polygon: LPolygon;
}

function MapPolygon ({
  polygon,
}: MapPolygonProps) {
  const dispatch = useDispatch();

  return (
    <Polygon
      positions={Convert.geoJson.polygon.leafletPositions(polygon)}
      weight={2}
      color='var(--color-primary-d1)'
      eventHandlers={{
        click: () => dispatch(mapEditorDocActions.setSelected(polygon.properties.id))
      }}
    />
  );
}

export default MapPolygon;
