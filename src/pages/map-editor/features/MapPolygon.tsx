import { useActiveElement } from "context/useActiveElement";
import GLT from "GLT";
import type { LeafletMouseEvent } from "leaflet";
import type { MapperPolygon } from "models/MapDocument";
import { Polygon } from "react-leaflet";
import { useDispatch } from "react-redux";
import useMapperUi from "state/mapper/useUi";

export interface MapPolygonProps {
  polygon: MapperPolygon;
}

function MapPolygon ({
  polygon,
}: MapPolygonProps) {
  const active = useActiveElement();
  const ui = useMapperUi();
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
        click: handleClick,
      }}
    />
  );

  function handleClick (evt: LeafletMouseEvent) {
    if (evt.originalEvent.ctrlKey) {
      if (ui.tool === 'union') {
        active.union(polygon.id, ui.toolSettings.deleteFeaturesUsedByCombine);
      }
      else if (ui.tool === 'difference') {
        active.difference(
          polygon.id, ui.toolSettings.deleteFeaturesUsedByDifference
        );
      }
      else if (ui.tool === 'intersection') {
        active.intersection(
          polygon.id, ui.toolSettings.deleteFeaturesUsedByCombine
        )
      }
    }
    else {
      active.setElement(polygon.id, true);
    }
  }
}

export default MapPolygon;
