import { useActiveElement } from "context/useActiveElement";
import GLT from "GLT";
import type { LeafletDragEndEvent, LeafletMouseEvent } from "leaflet";
import { Marker } from "react-leaflet";
import { useDispatch } from "react-redux";
import { MapperDocActions } from "state/mapper/docSlice";
import useMapperDoc from "state/mapper/useDoc";
import useMarkers from "../features/useMarkers";

export interface PointMoveShapeToolProps {
  
}

function PointMoveShapeTool (props: PointMoveShapeToolProps) {
  const doc = useMapperDoc();
  const active = useActiveElement();
  const dispatch = useDispatch();

  const { activeMovablePoint } = useMarkers();

  const point = active.getPoint();
  if (!point) return null;

  return (
    <Marker
      position={GLT.gj.coord.leaflet(point.position)}
      icon={activeMovablePoint}
      draggable
      eventHandlers={{
        dragend: handleDragEnd,
        click: handleClick
      }}
    />
  );

  function handleClick (evt: LeafletMouseEvent) {
    evt.originalEvent.stopPropagation();
  }

  function handleDragEnd (evt: LeafletDragEndEvent) {
    if (!active.id) return;
    
    dispatch(MapperDocActions.updatePointPosition({
      elementId: active.id,
      position: GLT.leaflet.coord.gj(evt.target.getLatLng()),
    }))
  }
}

export default PointMoveShapeTool;
