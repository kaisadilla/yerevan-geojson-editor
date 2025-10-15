import { useActiveElement } from 'context/useActiveElement';
import type { Position } from 'geojson';
import GLT from 'GLT';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { mapEditorUiActions } from 'state/mapper/uiSlice';
import PolygonDraw from '../features/PolygonDraw';
import { MapperHistory } from '../MapperHistory';

export interface PolygonDrawVerticesToolProps {
  
}

function PolygonDrawVerticesTool (props: PolygonDrawVerticesToolProps) {
  const { id, vertices, setVertices, commitChanges } = useActiveElement();
  const dispatch = useDispatch();

  const [lastStroke, setLastStroke] = useState(vertices.length);

  return (
    <PolygonDraw
      vertices={vertices}
      onAddVertex={handleAddVertex}
      onCompleteStroke={handleCompleteStroke}
    />
  );

  function handleAddVertex (coord: Position) {
    if (GLT.gj.coord.isEqual(coord, vertices[0])) {
      commitChanges();
      addStrokeToHistory();
      dispatch(mapEditorUiActions.setTool(null));
      return;
    }

    setVertices(prev => [
      ...prev,
      coord,
    ]);
  }

  function handleCompleteStroke () {
    commitChanges();
    addStrokeToHistory();
  }

  function addStrokeToHistory () {
    if (id === null) return;

    MapperHistory.push({
      type: 'add_vertices',
      elementId: id,
      index: lastStroke,
      vertices: vertices.slice(lastStroke),
    })

    setLastStroke(vertices.length);
  }
}

export default PolygonDrawVerticesTool;
