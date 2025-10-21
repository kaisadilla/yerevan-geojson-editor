import type { Position } from 'geojson';
import GLT from 'GLT';
import { Marker, Polygon, Polyline } from 'react-leaflet';
import useMapperSettings from 'state/mapper/useSettings';
import useMapperUi from 'state/mapper/useUi';
import styles from './PolygonDeleteVertices.module.scss';
import useMarkers from './useMarkers';

export interface PolygonDeleteVerticesProps {
  vertices: Position[];
  deletePath?: number[] | null;
  onDeleteVertex?: (index: number) => void;
}

function PolygonDeleteVertices ({
  vertices,
  deletePath,
  onDeleteVertex,
}: PolygonDeleteVerticesProps) {
  const ui = useMapperUi();
  const settings = useMapperSettings();

  const latlngVertices = GLT.gj.coords.leaflet(vertices);
  const ring = [...latlngVertices, latlngVertices[0]];

  const highlightSet = deletePath ? new Set(deletePath) : null;

  const { deleteVertex, selectedDeleteVertex } = useMarkers();

  return (<>
    {latlngVertices.map((v, i) => <Marker
      key={i}
      position={v}
      icon={highlightSet?.has(i) ? selectedDeleteVertex : deleteVertex}
      eventHandlers={{
        click: () => onDeleteVertex?.(i),
      }}
    />)}
    <Polygon
      className={styles.polygon}
      positions={ring}
      weight={settings.lineWidth}
      color={settings.colors.active}
    />
    {deletePath && <Polyline
      positions={deletePath.map(i => GLT.gj.coord.leaflet(vertices[i]))}
      weight={settings.lineWidth}
      color={settings.colors.delete}
    />}
  </>);
}

export default PolygonDeleteVertices;
