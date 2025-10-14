import { useActiveElement } from 'context/useActiveElement';
import type { Position } from 'geojson';
import GLT from 'GLT';
import type { MapperPolygon } from 'models/MapDocument';
import { useDispatch } from 'react-redux';
import { mapEditorUiActions } from 'state/mapEditor/uiSlice';
import PolygonDraw from '../features/PolygonDraw';

export interface PolygonDrawVerticesToolProps {
  polygon: MapperPolygon;
}

function PolygonDrawVerticesTool ({
  polygon,
}: PolygonDrawVerticesToolProps) {
  const { vertices, setVertices, commitChanges } = useActiveElement();
  const dispatch = useDispatch();

  return (
    <PolygonDraw
      vertices={vertices}
      onAddVertex={handleAddVertex}
    />
  );

  function handleAddVertex (coord: Position) {
    if (GLT.gj.coord.isEqual(coord, vertices[0])) {
      commitChanges();
      dispatch(mapEditorUiActions.setTool(null));
      return;
    }

    setVertices(prev => [
      ...prev,
      coord,
    ]);
  }
}

export default PolygonDrawVerticesTool;
