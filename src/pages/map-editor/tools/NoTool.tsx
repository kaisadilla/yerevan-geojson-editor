import GLT from 'GLT';
import type { LFeature, LPolygon } from 'models/MapDocument';
import { Polygon } from 'react-leaflet';
import useMapEditorSettings from 'state/mapEditor/useSettings';
import styles from './NoTool.module.scss';

export interface NoToolProps {
  feature: LFeature;
}

function NoTool ({
  feature,
}: NoToolProps) {
  if (feature.geometry.type === 'Polygon') return (
    <_Polygon polygon={feature as LPolygon} />
  );
}

interface _PolygonProps {
  polygon: LPolygon;
}

function _Polygon ({
  polygon,
}: _PolygonProps) {
  const settings = useMapEditorSettings();

  return (
    <Polygon
      key={polygon.properties.id}
      className={styles.polygon}
      positions={GLT.gj.polygon.leafletPositions(polygon)}
      weight={2}
      color={settings.colors.active}
    />
  );
}


export default NoTool;
