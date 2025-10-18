import type { Position } from "geojson";

interface MapperActionBase {
  type: string;
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

export type MapperAction = AddVerticesMapperAction
  | DeleteVerticesMapperAction
  | ChangeVerticesMapperAction
  ;

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

export const MapperHistory = new MapperHistoryState();
