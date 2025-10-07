import Convert from 'Convert';
import styles from './EditPolygon.module.scss';

import type { LPolygon } from 'models/MapDocument';
import { Marker, Polygon, Polyline } from "react-leaflet";
import { useGjEditorState } from "state/mapEditor/docSlice";
import useMapEditorMap from 'state/mapEditor/useMap';
import useMapEditorUi from 'state/mapEditor/useUi';

export interface EditPolygonProps {
  polygon: LPolygon;
}

function EditPolygon ({
  polygon,
}: EditPolygonProps) {
  const ui = useMapEditorUi();

  if (ui.tool === 'draw_vertices') {
    return <_DrawPolygon polygon={polygon} />
  }

  return (
    <_ActivePolygon polygon={polygon} />
  );
}

interface _ActivePolygonProps {
  polygon: LPolygon;
}

function _ActivePolygon ({
  polygon,
}: _ActivePolygonProps) {
  const ctx = useGjEditorState();

  return (
    <Polygon
      className={styles.polygon}
      positions={Convert.geoJson.polygon.leafletPositions(polygon)}
      weight={2}
      color={ctx.content.properties.activeColor}
    />
  );
}

interface _DrawPolygonProps {
  polygon: LPolygon;
}

function _DrawPolygon ({
  polygon,
}: _DrawPolygonProps) {
  const doc = useGjEditorState();

  const rings = Convert.geoJson.polygon.leafletPositions(polygon);

  return (<>
    <Polygon
      className={styles.polygon}
      positions={Convert.geoJson.polygon.leafletPositions(polygon)}
      weight={0}
      color={doc.content.properties.activeColor}
    />
    <Polyline
      positions={[rings[0].slice(0, -1)]}
      weight={2}
      color={doc.content.properties.activeColor}
    />
    <_B polygon={polygon} />
  </>);
}

interface _BProps {
  polygon: LPolygon;
}

function _B ({
  polygon
}: _BProps) {
  const map = useMapEditorMap();
  const doc = useGjEditorState();

  const editPointer = L.divIcon({
    className: styles.editPointer,
    iconSize: [12, 12],
  });

  const rings = Convert.geoJson.polygon.leafletPositions(polygon);

  return (
    <>
    {map.hoveredCoords && <Polyline
      positions={[
        rings[0][rings.length - 1],
        Convert.geoJson.coord.leafletPosition(map.hoveredCoords)
      ]}
      dashArray="7, 8, 1, 8"
      color={doc.content.properties.activeColor}
      weight={2}
    />}
    {map.hoveredCoords && <Marker
      position={Convert.geoJson.coord.leafletPosition(map.hoveredCoords)}
      icon={editPointer}
    >

    </Marker>}
    </>
  );
}



export default EditPolygon;
