import { useActiveElement } from "context/useActiveElement";
import { MapperHistory, type AddVerticesMapperAction, type ChangeVerticesMapperAction, type DeleteVerticesMapperAction } from "pages/map-editor/MapperHistory";
import { useDispatch } from "react-redux";
import useMapperDoc from "state/mapper/useDoc";

export default function useUndo () {
  const doc = useMapperDoc();
  const active = useActiveElement();
  const dispatch = useDispatch();

  function handleUndo () {
    const action = MapperHistory.undo();
    if (!action) return;

    if (action.type === 'add_vertices') {
      undoAddVertices(action);
    }
    else if (action.type === 'delete_vertices') {
      undoDeleteVertices(action);
    }
    else if (action.type === 'change_vertices') {
      undoChangeVertices(action);
    }
  }

  function undoAddVertices (action: AddVerticesMapperAction) {
    const el = doc.getElement(action.elementId);
    if (!el) return;
    if (el.type !== 'Polygon') return;
    
    console.log("Vertices in redux", [...el.vertices]);
    console.log("action", action);

    const verts = [...el.vertices];
    verts.splice(action.index, action.vertices.length);

    console.log("Vertices given to active", verts);

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
