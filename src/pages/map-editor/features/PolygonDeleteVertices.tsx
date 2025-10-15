import deleteImg from 'assets/img/marker_delete.png';
import type { Position } from 'geojson';
import GLT from 'GLT';
import { Marker, Polygon, Polyline } from 'react-leaflet';
import useMapperSettings from 'state/mapper/useSettings';
import useMapperUi from 'state/mapper/useUi';
import styles from './PolygonDeleteVertices.module.scss';

export interface PolygonDeleteVerticesProps {
  vertices: Position[];
  onDeleteVertex?: (index: number) => void;
}

function PolygonDeleteVertices ({
  vertices,
  onDeleteVertex,
}: PolygonDeleteVerticesProps) {
  const ui = useMapperUi();
  const settings = useMapperSettings();

  const latlngVertices = GLT.gj.coords.leaflet(vertices);
  const ring = [...latlngVertices, latlngVertices[0]];

  const deleteIcon = L.icon({
      iconUrl: deleteImg,
      iconSize: [ui.toolSettings.deleteVertexSize, ui.toolSettings.deleteVertexSize],
  });

  return (<>
    {latlngVertices.map((v, i) => <Marker
      key={i}
      position={v}
      icon={deleteIcon}
      eventHandlers={{
        click: () => onDeleteVertex?.(i),
      }}
    />)}
    <Polygon
      className={styles.polygon}
      positions={ring}
      weight={0}
      color={settings.colors.active}
    />
    <Polyline
      positions={ring}
      weight={settings.lineWidth}
      color={settings.colors.active}
    />
  </>);
}

export default PolygonDeleteVertices;
