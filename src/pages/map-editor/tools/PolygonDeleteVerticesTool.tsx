import { useActiveElement } from 'context/useActiveElement';
import Logger from 'Logger';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PolygonDeleteVertices from '../features/PolygonDeleteVertices';
import { MapperHistory } from '../MapperHistory';
 
export interface PolygonDeleteVerticesToolProps {
  
}

function PolygonDeleteVerticesTool (props: PolygonDeleteVerticesToolProps) {
  const active = useActiveElement();
  const dispatch = useDispatch();

  // Every time vertices change, that counts as an edit and is commited.
  useEffect(() => {
    active.commitChanges();
  }, [active.vertices]);

  const indices = active.getDeletePath();

  return (<>
    <PolygonDeleteVertices
      vertices={active.vertices}
      deletePath={active.deleteMode === 'section' ? indices : undefined}
      onDeleteVertex={handleDeleteVertex}
    />
  </>);

  function handleDeleteVertex (index: number) {
    if (active.deleteMode === 'individual') {
      deleteVertex(index);
    }
    else if (active.deleteMode === 'section') {
      updateDeletePath(index);
    }
    else {
      Logger.error(`Unknown delete mode: '${active.deleteMode}'.`);
    }
  }

  function deleteVertex (index: number) {
    if (active.id) {
      MapperHistory.push({
        type: 'delete_vertices',
        elementId: active.id,
        index,
        vertices: [active.vertices[index]],
      });
    }

    active.setVertices(prev => {
      const upd = [...prev];
      upd.splice(index, 1);

      return upd;
    });
  }

  function updateDeletePath (index: number) {
    active.setDeletePath(prev => {
      if (prev.start === null) return {
        start: index,
        end: null,
      };
      else return {
        start: prev.start,
        end: index,
      };
    });
  }
}

export default PolygonDeleteVerticesTool;
