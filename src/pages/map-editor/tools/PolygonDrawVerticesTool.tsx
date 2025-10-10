import type { Polygon as PolygonGeometry, Position } from 'geojson';
import GLT from 'GLT';
import type { LPolygon } from 'models/MapDocument';
import { useDispatch } from 'react-redux';
import { mapEditorDocActions } from 'state/mapEditor/docSlice';
import { mapEditorUiActions } from 'state/mapEditor/uiSlice';
import PolygonDraw from '../features/PolygonDraw';

export interface PolygonDrawVerticesToolProps {
  polygon: LPolygon;
}

function PolygonDrawVerticesTool ({
  polygon,
}: PolygonDrawVerticesToolProps) {
  const dispatch = useDispatch();

  return (
    <PolygonDraw
      shape={polygon.geometry.coordinates[0]}
      onAddVertex={handleAddVertex}
    />
  );

  function handleAddVertex (coord: Position) {
    if (GLT.gj.coord.isEqual(coord, polygon.geometry.coordinates[0][0])) {
      dispatch(mapEditorUiActions.setTool(null));
      return;
    }

    const geometry: PolygonGeometry = {
      type: 'Polygon',
      coordinates: [
        [
          ...polygon.geometry.coordinates[0].slice(0, -1),
          coord,
          polygon.geometry.coordinates[0][0]
        ],
      ],
    };
    
    dispatch(mapEditorDocActions.updateGeometry({
      elementId: polygon.properties.id,
      geometry,
    }));
  }
}

export default PolygonDrawVerticesTool;
