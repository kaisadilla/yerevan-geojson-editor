import { useActiveElement } from 'context/useActiveElement';
import { useDispatch } from 'react-redux';
import PolygonDeleteVertices from '../features/PolygonDeleteVertices';

export interface PolygonDeleteVerticesToolProps {
  
}

function PolygonDeleteVerticesTool (props: PolygonDeleteVerticesToolProps) {
  const { vertices, setVertices, commitChanges } = useActiveElement();
  const dispatch = useDispatch();

  return (
    <PolygonDeleteVertices
      vertices={vertices}
      onDeleteVertex={handleDeleteVertex}
    />
  );

  function handleDeleteVertex (index: number) {
    setVertices(prev => {
      const upd = [...prev];
      upd.splice(index, 1);
      return upd;
    });
  }
}

export default PolygonDeleteVerticesTool;
