import { useActiveElement } from "context/useActiveElement";
import { MapperHistory, type AddVerticesMapperAction, type ChangeVerticesMapperAction, type DeleteVerticesMapperAction } from "pages/map-editor/MapperHistory";
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

    const verts = [...el.vertices];
    verts.splice(action.index, action.vertices.length);

    dispatch(MapperDocActions.updatePolygonVertices({
      elementId: el.id,
      vertices: verts,
    }));

    active.setVertices(_ => verts);
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
    
    dispatch(MapperDocActions.updatePolygonVertices({
      elementId: el.id,
      vertices: verts,
    }));

    active.setVertices(_ => verts);
  }

  function undoChangeVertices (action: ChangeVerticesMapperAction) {
    const el = doc.getElement(action.elementId);
    if (!el) return;
    if (el.type !== 'Polygon') return;

    dispatch(MapperDocActions.updatePolygonVertices({
      elementId: el.id,
      vertices: action.before,
    }));

    active.setVertices(_ => action.before);
  }

  return {
    handleUndo,
  }
}
