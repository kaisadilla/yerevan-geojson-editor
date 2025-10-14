import { useThrottledCallback } from '@mantine/hooks';
import * as turf from '@turf/turf';
import { useActiveElement } from 'context/useActiveElement';
import Fmt from "Fmt";
import type { Position } from 'geojson';
import type { MapperElement, MapperPolygon } from "models/MapDocument";
import { useEffect, useState } from 'react';
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
  const active = useActiveElement();

  const [data, setData] = useState({
    area: 0,
    vertices: 0,
  });

  const updateMetrics = useThrottledCallback(
    (vertices: Position[]) => {
      const count = vertices.length;

      let area = 0;
      if (vertices.length > 2) {
        const gj = turf.polygon([[...active.vertices, active.vertices[0]]]);
        area = turf.area(gj) / 1_000_000;
      }

      setData({
        area,
        vertices: count,
      });
    },
    75
  );

  useEffect(() => {
    updateMetrics(active.vertices);
  }, [active.vertices, updateMetrics]);

  return (
    <div className={styles.panel}>
      <div className={styles.datum}>
        <div className={styles.title}>Area</div>
        <div className={styles.value}>{Fmt.number(data.area)} km²</div>
      </div>
      <div className={styles.datum}>
        <div className={styles.title}>Vertices</div>
        <div className={styles.value}>{Fmt.number(data.vertices, 0)}</div>
      </div>
    </div>
  );
}


export default Metadata;
