import type { LeafletMouseEvent } from "leaflet";

const clickListeners = new Set<(evt: LeafletMouseEvent) => void>();
const rightClickDownListeners = new Set<(evt: React.MouseEvent) => void>();
const rightClickUpListeners = new Set<(evt: MouseEvent) => void>();
const mouseMoveListeners = new Set<(evt: LeafletMouseEvent) => void>();

const MapEvents = {
  leftClick (listener: (evt: LeafletMouseEvent) => void) {
    clickListeners.add(listener);
    return () => clickListeners.delete(listener);
  },
  rightClickDown (listener: (evt: React.MouseEvent) => void) {
    rightClickDownListeners.add(listener);
    return () => rightClickDownListeners.delete(listener);
  },
  rightClickUp (listener: (evt: MouseEvent) => void) {
    rightClickUpListeners.add(listener);
    return () => rightClickUpListeners.delete(listener);
  },
  mouseMove (listener: (evt: LeafletMouseEvent) => void) {
    mouseMoveListeners.add(listener);
    return () => mouseMoveListeners.delete(listener);
  },
}

export const MapEventEmitters = {
  leftClick (evt: LeafletMouseEvent) {
    for (const l of clickListeners) l(evt); 
  },
  rightClickDown (evt: React.MouseEvent) {
    for (const l of rightClickDownListeners) l(evt); 
  },
  rightClickUp (evt: MouseEvent) {
    for (const l of rightClickUpListeners) l(evt); 
  },
  mouseMove (evt: LeafletMouseEvent) {
    for (const l of mouseMoveListeners) l(evt);
  }
}

export default MapEvents;
