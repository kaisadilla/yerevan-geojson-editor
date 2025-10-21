import { useActiveElement } from "context/useActiveElement";
import GLT from "GLT";
import type { LeafletMouseEvent } from "leaflet";
import { shapeToPolygon, type MapperPolygon } from "models/MapDocument";
import { Polygon } from "react-leaflet";
import { useDispatch } from "react-redux";
import useMapperSettings from "state/mapper/useSettings";
import useMapperUi from "state/mapper/useUi";

export interface MapPolygonProps {
  polygon: MapperPolygon;
  isSibling?: boolean;
  isParent?: boolean;
}

function MapPolygon ({
  polygon,
  isSibling = false,
  isParent = false,
}: MapPolygonProps) {
  const active = useActiveElement();
  const ui = useMapperUi();
  const settings = useMapperSettings();
  const dispatch = useDispatch();

  let color = settings.colors.default;
  if (isSibling) color = settings.colors.activeSibling;
  else if (isParent) color = settings.colors.activeParent;

  return (
    <Polygon
      positions={[
        GLT.gj.coords.leaflet(polygon.vertices),
        ...polygon.holes.map(
          h => GLT.gj.coords.leaflet(shapeToPolygon(h).vertices)
        )
      ]}
      weight={2}
      color={color}
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
