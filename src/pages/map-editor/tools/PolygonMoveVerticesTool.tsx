import { useActiveElement } from "context/useActiveElement";
import type { Position } from "geojson";
import { useDispatch } from "react-redux";
import useMapperDoc from "state/mapper/useDoc";
import useMapperSettings from "state/mapper/useSettings";
import PolygonMoveVertices from "../features/PolygonMoveVertices";

export interface PolygonMoveVerticesToolProps {
  
}

function PolygonMoveVerticesTool (props: PolygonMoveVerticesToolProps) {
  const doc = useMapperDoc();
  const active = useActiveElement();
  const settings = useMapperSettings();
  const dispatch = useDispatch();

  const polygon = active.getPolygon();
  if (!polygon) return null;
  if (polygon.vertices.length === 0) return null;

  return (
    <PolygonMoveVertices
      vertices={polygon.vertices}
      onAddVertex={handleAddVertex}
    />
  );

  function handleAddVertex (index: number, position: Position) {
    if (!polygon) return;

    const verts = [...polygon.vertices];
    verts.splice(index, 0, position);
    active.setVertices(verts);
  }
}

export default PolygonMoveVerticesTool;
