import { useActiveElement } from 'context/useActiveElement';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PolygonDeleteVertices from '../features/PolygonDeleteVertices';
import { MapperHistory } from '../MapperHistory';

export interface PolygonDeleteVerticesToolProps {
  
}

function PolygonDeleteVerticesTool (props: PolygonDeleteVerticesToolProps) {
  const { id, vertices, setVertices, commitChanges } = useActiveElement();
  const dispatch = useDispatch();

  // Every time vertices change, that counts as an edit and is commited.
  useEffect(() => {
    commitChanges();
  }, [vertices]);

  return (
    <PolygonDeleteVertices
      vertices={vertices}
      onDeleteVertex={handleDeleteVertex}
    />
  );

  function handleDeleteVertex (index: number) {
    if (id) {
      MapperHistory.push({
        type: 'delete_vertices',
        elementId: id,
        index,
        vertices: [vertices[index]],
      });
    }

    setVertices(prev => {
      const upd = [...prev];
      upd.splice(index, 1);

      return upd;
    });
  }
}

export default PolygonDeleteVerticesTool;
