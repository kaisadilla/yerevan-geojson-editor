import type { Middleware } from "@reduxjs/toolkit";
import type { RootState } from "state/store";
import { getElement, getElementIndex, getElementParent, MapperDocActions } from "./docSlice";
import Mapper from "./events";

export const mapperDocMiddleware: Middleware<{}, RootState> = store => next => action => {
  const res = next(action);

  if (MapperDocActions.setDocument.match(action)) {
    Mapper.emit('documentChange', {});
  }
  else if (MapperDocActions.addElement.match(action)) {
    const data = action.payload;

    const state = store.getState();
    const createdEl = getElement(state.mapEditorDoc.content, data.element.id, true);
    if (!createdEl) return res;

    const parent = getElementParent(state.mapEditorDoc.content, createdEl.id);
    if (!parent) return res;

    const index = getElementIndex(state.mapEditorDoc.content, createdEl.id);
    if (!index) return res;

    Mapper.emit('addElement', {
      element: createdEl,
      groupId: parent.id,
      index,
    });
  }
  else if (MapperDocActions.deleteElement.match(action)) {
    const elementId = action.payload;
    
    Mapper.emit('deleteElement', {
      elementId,
    });
  }
  else if (MapperDocActions.setHidden.match(action)) {
    const { elementId, value } = action.payload;

    Mapper.emit('hide', {
      elementId,
      hidden: value
    });
  }
  else if (
    MapperDocActions.updatePolygon.match(action)
    || MapperDocActions.updatePolygonVertices.match(action)
  ) {
    const { elementId } = action.payload;

    const state = store.getState();
    const update = getElement(state.mapEditorDoc.content, elementId, true);

    if (update) {
      Mapper.emit('updateElement', {
        elementId,
        update,
      });
    }
  }

  return res;
}
