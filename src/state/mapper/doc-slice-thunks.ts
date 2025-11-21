import type { Position } from "geojson";
import type { MapperElement } from "models/MapDocument";
import { MapperActions, MapperHistory } from "pages/map-editor/MapperHistory";
import type { AppDispatch, RootState } from "state/store";
import { getElement, MapperDocActions } from "./docSlice";

type Thunk = (dispatch: AppDispatch, getState: () => RootState) => void;

/**
 * Contains functions that alter the current document and register said changes
 * in the history so that they can be undone and redone.
 */
const MapperDocThunks = {
  addElement (
    element: MapperElement,
    groupId?: string | null,
    index?: number | null,
  ) : Thunk {
    return (dispatch, getState) => {
      dispatch(MapperDocActions.addElements({
        elements: [element],
        groupId,
        index,
      }));
    };
  },
  addElements (
    elements: MapperElement[],
    groupId?: string | null,
    index?: number | null,
  ) : Thunk {
    return (dispatch, getState) => {
      dispatch(MapperDocActions.addElements({ elements, groupId, index }));
    };
  },

  updatePointPosition (
    id: string, position: Position
  ) : Thunk {
    return (dispatch, getState) => {
      const el = getElement(getState().mapEditorDoc.content, id, true);
      if (!el || el.type !== 'Point') return;

      const before = el.position;
      
      MapperHistory.push(
        MapperActions.movePoint(el.id, before, position),
      )

      dispatch(MapperDocActions.updatePointPosition({
        elementId: id,
        position,
      }));
    };
  },

  movePolygonVertex (
    id: string, index: number, position: Position
  ) : Thunk {
    return (dispatch, getState) => {
      const el = getElement(getState().mapEditorDoc.content, id, true);
      if (!el || el.type !== 'Polygon') return;

      const before = el.vertices[index];
      
      const verts = [...el.vertices];
      verts[index] = position;

      MapperHistory.push(
        MapperActions.moveVertex(el.id, index, before, position),
      );

      dispatch(MapperDocActions.updatePolygonVertices({
        elementId: el.id,
        vertices: verts,
      }));
    };
  },
}

export default MapperDocThunks;
