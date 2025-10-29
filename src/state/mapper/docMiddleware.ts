import type { Middleware } from "@reduxjs/toolkit";
import type { RootState } from "state/store";
import { getElement, MapperDocActions } from "./docSlice";
import Mapper from "./events";

export const mapperDocMiddleware: Middleware<{}, RootState> = store => next => action => {
  const res = next(action);

  if (MapperDocActions.setDocument.match(action)) {
    Mapper.emit('documentChange', {});
  }
  else if (MapperDocActions.deleteElement.match(action)) {
    const elementId = action.payload;
    
    Mapper.emit('deleteElement', {
      elementId,
    })
  }
  else if (MapperDocActions.setHidden.match(action)) {
    const { elementId, value } = action.payload;

    Mapper.emit('hide', {
      elementId,
      hidden: value
    });
  }
  else if (MapperDocActions.updatePolygon.match(action)) {
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
