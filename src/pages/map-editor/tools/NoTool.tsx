import GLT from 'GLT';
import type { MapperFeature, MapperPolygon } from 'models/MapDocument';
import { Polygon } from 'react-leaflet';
import useMapEditorSettings from 'state/mapEditor/useSettings';
import styles from './NoTool.module.scss';

export interface NoToolProps {
  feature: MapperFeature;
}

function NoTool ({
  feature,
}: NoToolProps) {
  if (feature.type === 'Polygon') return (
    <_Polygon polygon={feature} />
  );
}

interface _PolygonProps {
  polygon: MapperPolygon;
}

function _Polygon ({
  polygon,
}: _PolygonProps) {
  const settings = useMapEditorSettings();

  return (
    <Polygon
      key={polygon.id}
      className={styles.polygon}
      positions={[
        GLT.gj.coords.leaflet(polygon.vertices),
        ...polygon.holes.map(h => GLT.gj.coords.leaflet(h)),
      ]}
      weight={2}
      color={settings.colors.active}
    />
  );
}


export default NoTool;
