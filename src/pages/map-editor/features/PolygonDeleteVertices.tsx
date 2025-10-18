import deleteImg from 'assets/img/marker_delete.png';
import deleteSelectedImg from 'assets/img/marker_delete_selected.png';
import type { Position } from 'geojson';
import GLT from 'GLT';
import { Marker, Polygon, Polyline } from 'react-leaflet';
import useMapperSettings from 'state/mapper/useSettings';
import useMapperUi from 'state/mapper/useUi';
import styles from './PolygonDeleteVertices.module.scss';

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

  const deleteIcon = L.icon({
      iconUrl: deleteImg,
      iconSize: [ui.toolSettings.deleteVertexSize, ui.toolSettings.deleteVertexSize],
  });
  const deleteSelectedIcon = L.icon({
      iconUrl: deleteSelectedImg,
      iconSize: [ui.toolSettings.deleteVertexSize, ui.toolSettings.deleteVertexSize],
  });

  return (<>
    {latlngVertices.map((v, i) => <Marker
      key={i}
      position={v}
      icon={highlightSet?.has(i) ? deleteSelectedIcon : deleteIcon}
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
