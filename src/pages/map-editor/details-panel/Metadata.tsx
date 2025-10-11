import * as turf from "@turf/turf";
import Fmt from "Fmt";
import type { LElement, LPolygon } from 'models/MapDocument';
import styles from './Metadata.module.scss';

export interface MetadataProps {
  element: LElement;
}

function Metadata ({
  element,
}: MetadataProps) {

  if (element.type === 'Feature') {
    if (element.geometry.type === 'Polygon') return (<_Polygon
      polygon={element as LPolygon}
    />);
  }

  return null;
}

interface _PolygonProps {
  polygon: LPolygon;
}

function _Polygon ({
  polygon
}: _PolygonProps) {
  const area = turf.area(polygon) / 1_000_000;
  const vertices = polygon.geometry.coordinates.reduce(
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
