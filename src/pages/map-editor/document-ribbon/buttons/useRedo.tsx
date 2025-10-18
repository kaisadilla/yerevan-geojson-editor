import { useActiveElement } from "context/useActiveElement";
import { MapperHistory, type AddVerticesMapperAction, type DeleteVerticesMapperAction } from "pages/map-editor/MapperHistory";
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

    if (action.type === 'add_vertices') {
      redoAddVertices(action);
    }
    else if (action.type === 'delete_vertices') {
      redoDeleteVertices(action);
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

    dispatch(MapperDocActions.updatePolygonVertices({
      elementId: el.id,
      vertices: verts,
    }));

    active.setVertices(_ => verts);
  }

  function redoDeleteVertices (action: DeleteVerticesMapperAction) {
    const el = doc.getElement(action.elementId);
    if (!el) return;
    if (el.type !== 'Polygon') return;

    console.log(el.vertices);

    const verts = [...el.vertices];
    verts.splice(action.index, action.vertices.length);

    dispatch(MapperDocActions.updatePolygonVertices({
      elementId: el.id,
      vertices: verts,
    }));

    console.log(verts);

    active.setVertices(_ => verts);
  }

  return {
    handleRedo,
  }
}
