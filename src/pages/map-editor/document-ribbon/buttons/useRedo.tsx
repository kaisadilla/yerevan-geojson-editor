import { useActiveElement } from "context/useActiveElement";
import { MapperHistory, type AddVerticesMapperAction, type ChangeVerticesMapperAction, type DeleteVerticesMapperAction } from "pages/map-editor/MapperHistory";
import { useDispatch } from "react-redux";
import useMapperDoc from "state/mapper/useDoc";

export default function useRedo () {
  const doc = useMapperDoc();
  const active = useActiveElement();
  const dispatch = useDispatch();

  function handleRedo () {
    const action = MapperHistory.redo();
    if (!action) return;

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
