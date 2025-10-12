import * as turf from '@turf/turf';
import Fmt from "Fmt";
import type { MapperElement, MapperPolygon } from "models/MapDocument";
import styles from './Metadata.module.scss';

export interface MetadataProps {
  element: MapperElement;
}

function Metadata ({
  element,
}: MetadataProps) {

  if (element.type === 'Polygon') return (<_Polygon
    polygon={element}
  />);

  return null;
}

interface _PolygonProps {
  polygon: MapperPolygon;
}

function _Polygon ({
  polygon
}: _PolygonProps) {
  const gj = turf.polygon([polygon.vertices]);

  const area =  turf.area(gj) / 1_000_000;
  const vertices = gj.geometry.coordinates.reduce(
    (acc, cur) => acc += cur.length, 0
  );

  return (
    <div className={styles.panel}>
      <div className={styles.datum}>
        <div className={styles.title}>Area</div>
        <div className={styles.value}>{Fmt.number(area)} km²</div>
      </div>
      <div className={styles.datum}>
        <div className={styles.title}>Vertices</div>
        <div className={styles.value}>{Fmt.number(vertices, 0)}</div>
      </div>
    </div>
  );
}


export default Metadata;
