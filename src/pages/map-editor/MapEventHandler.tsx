import type { LeafletMouseEvent } from "leaflet";
import { useMapEvents } from "react-leaflet";
import { useDispatch } from "react-redux";
import { mapEditorMapActions } from "state/mapEditor/mapSlice";
import useMapEditorUi from "state/mapEditor/useUi";

export default function MapEventHandler () {
  const ctx = useMapEditorUi();
  const dispatch = useDispatch();

  useMapEvents({
    mousemove (evt: LeafletMouseEvent) {
      dispatch(
        mapEditorMapActions.setHoveredCoords([evt.latlng.lng, evt.latlng.lat])
      );
    }
  })

  return null;
}
