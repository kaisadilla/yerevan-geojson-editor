import GLT from 'GLT';
import { isPseudoContainer, type MapperFeature, type MapperPolygon } from 'models/MapDocument';
import { Polygon } from 'react-leaflet';
import useMapperDoc from 'state/mapper/useDoc';
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
  const doc = useMapperDoc();
  const settings = useMapperSettings();

  const parent = doc.getParent(polygon.id);
  const isPseudo = !!parent && isPseudoContainer(parent);

  return (
    <Polygon
      key={polygon.id}
      className={styles.polygon}
      positions={[
        GLT.gj.coords.leaflet(polygon.vertices)
      ]}
      weight={2}
      color={isPseudo ? settings.colors.activePseudo : settings.colors.active}
    />
  );
}


export default NoTool;
