import type { LeafletMouseEvent } from "leaflet";
import { useMapEvents } from "react-leaflet";
import { MapEventEmitters } from "./MapEvents";

export default function MapEventHandler () {
  useMapEvents({
    click (evt: LeafletMouseEvent) {
      MapEventEmitters.leftClick(evt);
    },
    contextmenu (evt: LeafletMouseEvent) {
      evt.originalEvent.preventDefault();
    },
    mousemove (evt: LeafletMouseEvent) {
      MapEventEmitters.mouseMove(evt);
    },
  })

  return null;
}
