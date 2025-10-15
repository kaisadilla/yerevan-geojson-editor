import { useActiveElement } from "context/useActiveElement";
import { MapperHistory, type AddVerticesMapperAction } from "pages/map-editor/MapperHistory";
import { useDispatch } from "react-redux";
import { MapEditorDocActions } from "state/mapper/docSlice";
import useMapEditorDoc from "state/mapper/useDoc";

export default function useUndo () {
  const doc = useMapEditorDoc();
  const active = useActiveElement();
  const dispatch = useDispatch();

  function handleUndo () {
    const action = MapperHistory.undo();
    if (!action) return;

    if (action.type === 'add_vertices') {
      undoAddVertices(action);
    }
  }

  function undoAddVertices (action: AddVerticesMapperAction) {
    const el = doc.getElement(action.elementId);
    if (!el) return;
    if (el.type !== 'Polygon') return;

    const verts = [...el.vertices];
    verts.splice(action.index, action.vertices.length);

    dispatch(MapEditorDocActions.updatePolygonVertices({
      elementId: el.id,
      vertices: verts,
    }));

    active.setVertices(_ => verts);
  }

  return {
    handleUndo,
  }
}
