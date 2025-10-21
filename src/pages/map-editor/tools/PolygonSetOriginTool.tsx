import { useActiveElement } from 'context/useActiveElement';
import { useDispatch } from 'react-redux';
import PolygonOrigin from '../features/PolygonOrigin';
import { MapperActions, MapperHistory } from '../MapperHistory';

export interface PolygonSetOriginToolProps {
  
}

function PolygonSetOriginTool (props: PolygonSetOriginToolProps) {
  const active = useActiveElement();
  const dispatch = useDispatch();

  const polygon = active.getPolygon();
  if (!polygon) return null;

  return (
    <PolygonOrigin
      vertices={polygon.vertices}
      onSetOrigin={handleSetOrigin}
    />
  );

  function handleSetOrigin (index: number) {
    if (!polygon) return;

    const before = polygon.vertices;
    const upd = [
      ...polygon.vertices.slice(index),
      ...polygon.vertices.slice(0, index),
    ]

    active.setVertices(upd);

    MapperHistory.push(MapperActions.changeVertices(polygon.id, before, upd));
  }
}

export default PolygonSetOriginTool;
