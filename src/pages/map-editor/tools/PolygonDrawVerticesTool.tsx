import type { Position } from 'geojson';
import GLT from 'GLT';
import type { MapperPolygon } from 'models/MapDocument';
import { useDispatch } from 'react-redux';
import { MapEditorDocActions } from 'state/mapEditor/docSlice';
import { mapEditorUiActions } from 'state/mapEditor/uiSlice';
import PolygonDraw from '../features/PolygonDraw';

export interface PolygonDrawVerticesToolProps {
  polygon: MapperPolygon;
}

function PolygonDrawVerticesTool ({
  polygon,
}: PolygonDrawVerticesToolProps) {
  // TODO: Do not use redux for every single change.

  const dispatch = useDispatch();

  return (
    <PolygonDraw
      vertices={polygon.vertices}
      onAddVertex={handleAddVertex}
    />
  );

  function handleAddVertex (coord: Position) {
    if (GLT.gj.coord.isEqual(coord, polygon.vertices[0])) {
      dispatch(mapEditorUiActions.setTool(null));
      return;
    }

    const upd: Position[] = [
      ...polygon.vertices.slice(0, -1),
      coord,
      polygon.vertices[0],
    ];
    
    dispatch(MapEditorDocActions.updatePolygonVertices({
      elementId: polygon.id,
      vertices: upd,
    }));
  }
}

export default PolygonDrawVerticesTool;
