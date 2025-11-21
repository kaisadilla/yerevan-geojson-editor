import type { Position } from "geojson";
import type { MapperElement } from "models/MapDocument";

export type OnHistoryChangeEventHandler
  = (hasPast: boolean, hasFuture: boolean) => void;

export class MapperHistoryState {
  private past: MapperAction[] = [];
  private future: MapperAction[] = [];

  private listeners: Set<OnHistoryChangeEventHandler> = new Set();

  /**
   * Pushes a new action in the history. Doing this will discard future actions
   * that may exist if the user had undone something.
   * @param action An action that describes what the user has done.
   */
  push (action: MapperAction) {
    this.past.push(action);
    this.future = [];

    this.notify();
  }

  /**
   * Returns the most recent action in history, removing it from history and
   * adding it to the future.
   */
  undo () : MapperAction | null {
    const action = this.past.pop();

    if (action) {
      this.future.push(action);
      this.notify();

      return action;
    }

    return null;
  }

  /**
   * Returns the next action in the future, removing it from the future and
   * adding it to history.
   */
  redo () : MapperAction | null {
    const action = this.future.pop();

    if (action) {
      this.past.push(action);
      this.notify();

      return action;
    }

    return null;
  }
  
  peekPast () : MapperAction | null {
    if (this.past.length === 0) return null;

    return this.past[this.past.length - 1];
  }
  
  peekFuture () : MapperAction | null {
    if (this.future.length === 0) return null;

    return this.future[this.future.length - 1];
  }
  
  onHistoryChange (handler: OnHistoryChangeEventHandler) {
    this.listeners.add(handler);
  }

  offHistoryChange (handler: OnHistoryChangeEventHandler) {
    this.listeners.delete(handler);
  }

  private notify () {
    for (const l of this.listeners) {
      l(this.past.length > 0, this.future.length > 0);
    }
  }
}

interface MapperActionBase {
  type: string;
}

export interface MultipleMapperAction {
  type: 'multiple';
  actions: MapperAction[];
}

export interface DeleteElementMapperAction {
  type: 'delete_element',
  /**
   * The element that was deleted.
   */
  element: MapperElement,
  /**
   * The id of the group the element was in, or `null` if it was at the root.
   */
  groupId: string | null;
  /**
   * The position of the element within the group.
   */
  index: number | null;
}

export interface ChangeElementMapperAction {
  type: 'change_element';
  elementId: string;
  before: MapperElement;
  after: MapperElement;
}

export interface MovePointAction {
  type: 'move_point';
  elementId: string;
  before: Position;
  after: Position;
}

export interface AddVerticesMapperAction {
  type: 'add_vertices';
  /**
   * The element to which vertices were added.
   */
  elementId: string;
  /**
   * The index of the first vertex added.
   */
  index: number;
  /**
   * The vertices added.
   */
  vertices: Position[];
}

export interface DeleteVerticesMapperAction {
  type: 'delete_vertices';
  /**
   * The element that had vertices removed.
   */
  elementId: string;
  /**
   * The index of the first vertex removed.
   */
  index: number;
  /**
   * The vertices removed.
   */
  vertices: Position[];
}

export interface ChangeVerticesMapperAction {
  type: 'change_vertices';
  /**
   * The element that had vertices removed.
   */
  elementId: string;
  /**
   * The vertices before the chnage.
   */
  before: Position[];
  /**
   * The vertices after the change.
   */
  after: Position[];
}

export interface MoveVertexMapperAction {
  type: 'move_vertex';
  elementId: string;
  index: number;
  before: Position;
  after: Position;
}

export type MapperAction = MultipleMapperAction
  | DeleteElementMapperAction
  | ChangeElementMapperAction
  | MovePointAction
  | AddVerticesMapperAction
  | DeleteVerticesMapperAction
  | ChangeVerticesMapperAction
  | MoveVertexMapperAction
  ;

export const MapperActions = {
  multiple (actions: MapperAction[]) {
    return {
      type: 'multiple',
      actions,
    } satisfies MultipleMapperAction;
  },

  deleteElement (element: MapperElement, groupId: string | null, index: number) {
    return {
      type: 'delete_element',
      element,
      groupId,
      index,
    } satisfies DeleteElementMapperAction;
  },

  changeElement (id: string, before: MapperElement, after: MapperElement) {
    return {
      type: 'change_element',
      elementId: id,
      before,
      after,
    } satisfies ChangeElementMapperAction;
  },

  movePoint (id: string, before: Position, after: Position) {
    return {
      type: 'move_point',
      elementId: id,
      before,
      after,
    } satisfies MovePointAction;
  },

  addVertices (id: string, index: number, vertices: Position[]) {
    return {
      type: 'add_vertices',
      elementId: id,
      index,
      vertices,
    } satisfies AddVerticesMapperAction;
  },

  deleteVertices (id: string, index: number, vertices: Position[]) {
    return {
      type: 'delete_vertices',
      elementId: id,
      index,
      vertices,
    } satisfies DeleteVerticesMapperAction;
  },

  changeVertices (id: string, before: Position[], after: Position[]) {
    return {
      type: 'change_vertices',
      elementId: id,
      before,
      after,
    } satisfies ChangeVerticesMapperAction;
  },

  moveVertex (id: string, index: number, before: Position, after: Position) {
    return {
      type: 'move_vertex',
      elementId: id,
      index,
      before,
      after,
    } satisfies MoveVertexMapperAction;
  }
}
export const MapperHistory = new MapperHistoryState();
