import { useActiveElement } from "context/useActiveElement";
import { MapperHistory, type AddVerticesMapperAction, type ChangeElementMapperAction, type ChangeVerticesMapperAction, type DeleteElementMapperAction, type DeleteVerticesMapperAction, type MapperAction } from "pages/map-editor/MapperHistory";
import { useDispatch } from "react-redux";
import { MapperDocActions } from "state/mapper/docSlice";
import useMapperDoc from "state/mapper/useDoc";

export default function useUndo () {
  const doc = useMapperDoc();
  const active = useActiveElement();
  const dispatch = useDispatch();

  function handleUndo () {
    const action = MapperHistory.undo();
    if (!action) return;

    undo(action);
  }

  function undo (action: MapperAction) {
    if (action.type === 'multiple') {
      for (const innerAction of action.actions) {
        undo(innerAction);
      }
    }
    else if (action.type === 'delete_element') {
      undoDeleteElement(action);
    }
    else if (action.type === 'change_element') {
      undoChangeElement(action);
    }
    else if (action.type === 'add_vertices') {
      undoAddVertices(action);
    }
    else if (action.type === 'delete_vertices') {
      undoDeleteVertices(action);
    }
    else if (action.type === 'change_vertices') {
      undoChangeVertices(action);
    }
  }

  function undoDeleteElement (action: DeleteElementMapperAction) {
    dispatch(MapperDocActions.addElement({
      element: action.element,
      groupId: action.groupId,
      index: action.index,
    }));
  }

  function undoChangeElement (action: ChangeElementMapperAction) {
    dispatch(MapperDocActions.changeElement({
      elementId: action.elementId,
      update: action.before,
    }));
  }

  function undoAddVertices (action: AddVerticesMapperAction) {
    const el = doc.getElement(action.elementId);
    if (!el) return;
    if (el.type !== 'Polygon') return;

    const verts = [...el.vertices];
    verts.splice(action.index, action.vertices.length);

    active.setVertices(verts);
  }

  function undoDeleteVertices (action: DeleteVerticesMapperAction) {
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

  function undoChangeVertices (action: ChangeVerticesMapperAction) {
    const el = doc.getElement(action.elementId);
    if (!el) return;
    if (el.type !== 'Polygon') return;
    
    active.setVertices(action.before);
  }

  return {
    handleUndo,
  }
}
