import type { MapperElement } from "models/MapDocument";
import type { Immutable } from "types";

export type MapperDocumentChangeEvent = {}

export type MapperAddElementEvent = {
  element: Immutable<MapperElement>;
  groupId: string;
  index: number;
}

export type MapperDeleteElementEvent = {
  elementId: string;
}

export type MapperUpdateElementEvent = {
  elementId: string;
  update: Immutable<MapperElement>;
}

export type MapperActiveElementChangeEvent = {
  oldElementId: string | null;
  newElementId: string | null;
}

export type MapperHideEvent = {
  elementId: string;
  hidden: boolean;
}

type MapperEventSignature = {
  documentChange: MapperDocumentChangeEvent;
  addElement: MapperAddElementEvent;
  deleteElement: MapperDeleteElementEvent;
  updateElement: MapperUpdateElementEvent;
  activeElementChange: MapperActiveElementChangeEvent;
  hide: MapperHideEvent;
}

export type MapperEvent = keyof MapperEventSignature;
export type MapperEventHandler<K extends MapperEvent>
  = (evt: MapperEventSignature[K]) => void;

class MapperEvents {
  private listeners: { [K in MapperEvent]: Set<MapperEventHandler<K>> } = {
    documentChange: new Set(),
    addElement: new Set(),
    deleteElement: new Set(),
    updateElement: new Set(),
    activeElementChange: new Set(),
    hide: new Set(),
  };

  on<K extends MapperEvent> (type: K, listener: MapperEventHandler<K>) {
    this.listeners[type].add(listener);
  }

  off<K extends MapperEvent> (type: K, listener?: MapperEventHandler<K>) {
    if (listener) {
      this.listeners[type].delete(listener);
    }
    else {
      this.listeners[type].clear();
    }
  }

  emit<K extends MapperEvent> (type: K, evt: MapperEventSignature[K]) {
    for (const listener of this.listeners[type]) {
      listener(evt);
    }
  }
}

const Mapper = new MapperEvents();
export default Mapper;
