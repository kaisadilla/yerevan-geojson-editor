import { useActiveElement } from "context/useActiveElement";
import { MapperHistory, type AddVerticesMapperAction, type ChangeElementMapperAction, type ChangeVerticesMapperAction, type DeleteElementMapperAction, type DeleteVerticesMapperAction, type MapperAction } from "pages/map-editor/MapperHistory";
import { useDispatch } from "react-redux";
import { MapperDocActions } from "state/mapper/docSlice";
import useMapperDoc from "state/mapper/useDoc";

export default function useRedo () {
  const doc = useMapperDoc();
  const active = useActiveElement();
  const dispatch = useDispatch();

  function handleRedo () {
    const action = MapperHistory.redo();
    if (!action) return;

    redo(action);
  }

  function redo (action: MapperAction) {
    if (action.type === 'multiple') {
      for (const innerAction of action.actions) {
        redo(innerAction);
      }
    }
    else if (action.type === 'delete_element') {
      redoDeleteElement(action);
    }
    else if (action.type === 'change_element') {
      redoChangeElement(action);
    }
    if (action.type === 'add_vertices') {
      redoAddVertices(action);
    }
    else if (action.type === 'delete_vertices') {
      redoDeleteVertices(action);
    }
    else if (action.type === 'change_vertices') {
      redoChangeVertices(action);
    }
  }

  function redoDeleteElement (action: DeleteElementMapperAction) {
    dispatch(MapperDocActions.deleteElement(action.element.id));
  }

  function redoChangeElement (action: ChangeElementMapperAction) {
    dispatch(MapperDocActions.changeElement({
      elementId: action.elementId,
      update: action.after,
    }));
  }

  function redoAddVertices (action: AddVerticesMapperAction) {
    const el = doc.getElement(action.elementId);
    if (!el) return;
    if (el.type !== 'Polygon') return;

    const verts = [
      ...el.vertices.slice(0, action.index),
      ...action.vertices,
      ...el.vertices.slice(action.index),
    ];

    active.setVertices(verts);
  }

  function redoDeleteVertices (action: DeleteVerticesMapperAction) {
    const el = doc.getElement(action.elementId);
    if (!el) return;
    if (el.type !== 'Polygon') return;

    const verts = [...el.vertices];
    verts.splice(action.index, action.vertices.length);

    active.setVertices(verts);
  }

  function redoChangeVertices (action: ChangeVerticesMapperAction) {
    const el = doc.getElement(action.elementId);
    if (!el) return;
    if (el.type !== 'Polygon') return;

    active.setVertices(action.after);
  }

  return {
    handleRedo,
  }
}
