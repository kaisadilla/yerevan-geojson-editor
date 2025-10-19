import { useActiveElement } from 'context/useActiveElement';
import Logger from 'Logger';
import { useDispatch } from 'react-redux';
import PolygonDeleteVertices from '../features/PolygonDeleteVertices';
import { MapperHistory } from '../MapperHistory';
 
export interface PolygonDeleteVerticesToolProps {
  
}

function PolygonDeleteVerticesTool (props: PolygonDeleteVerticesToolProps) {
  const active = useActiveElement();
  const dispatch = useDispatch();

  const polygon = active.getPolygon();
  if (!polygon) return null;

  const indices = active.getDeletePath();

  return (<>
    <PolygonDeleteVertices
      vertices={polygon.vertices}
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
    if (!polygon) return;

    MapperHistory.push({
      type: 'delete_vertices',
      elementId: polygon.id,
      index,
      vertices: [polygon.vertices[index]],
    });

    active.setVertices(prev => {
      const upd = [...prev];
      upd.splice(index, 1);

      return upd;
    });
  }

  function updateDeletePath (index: number) {
    active.setDeletePath(prev => {
      console.log(prev);
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
