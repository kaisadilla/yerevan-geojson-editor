import { useActiveElement } from "context/useActiveElement";
import type { Position } from "geojson";
import GLT from "GLT";
import type { LeafletMouseEvent } from "leaflet";
import { ElementFactory } from "models/MapDocument";
import { useEffect, useState } from "react";
import { Marker } from "react-leaflet";
import { useDispatch } from "react-redux";
import { MapperDocActions } from "state/mapper/docSlice";
import { MapperUiActions } from "state/mapper/uiSlice";
import useMarkers from "../features/useMarkers";
import MapEvents from "../MapEvents";

export interface NewPolygonToolProps {
  
}

function NewPolygonTool (props: NewPolygonToolProps) {
  const [hoveredCoords, setHoveredCoords] = useState<Position | null>();

  const active = useActiveElement();
  const dispatch = useDispatch();

  const { volatileVertex } = useMarkers();

  useEffect(() => {
    const removeMouseMove = MapEvents.mouseMove(handleMouseMove);
    const removeLClick = MapEvents.leftClick(handleLeftClick);
    const removeRClick = MapEvents.rightClickDown(handleRightClick);

    return () => {
      removeMouseMove();
      removeLClick();
      removeRClick();
    }
  }, [hoveredCoords]);

  return (<>
    {hoveredCoords && <Marker
      position={GLT.gj.coord.leaflet(hoveredCoords)}
      icon={volatileVertex}
    />}
  </>);

  function handleMouseMove (evt: LeafletMouseEvent) {
    let cursorPos = evt.latlng;

    const hoveredCoords = GLT.leaflet.coord.gj(cursorPos);
    setHoveredCoords(hoveredCoords);
  }

  function handleLeftClick (evt: LeafletMouseEvent) {
    if (!hoveredCoords) return;

    const element = ElementFactory.polygon("New polygon");
    element.vertices.push(hoveredCoords);

    dispatch(MapperDocActions.addElement({
      element,
    }));

    active.setElement(element.id);
    dispatch(MapperUiActions.setTool('draw_vertices'));
  }

  function handleRightClick () {
    dispatch(MapperUiActions.setTool(null));
  }
}

export default NewPolygonTool;
