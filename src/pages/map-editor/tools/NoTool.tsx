import { useActiveElement } from 'context/useActiveElement';
import GLT from 'GLT';
import type { MapperFeature, MapperPolygon } from 'models/MapDocument';
import { Polygon } from 'react-leaflet';
import useMapperSettings from 'state/mapper/useSettings';
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
  const settings = useMapperSettings();
  const active = useActiveElement();

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
