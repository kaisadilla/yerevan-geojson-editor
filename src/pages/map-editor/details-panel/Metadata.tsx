import { useThrottledCallback } from '@mantine/hooks';
import * as turf from '@turf/turf';
import { useActiveElement } from 'context/useActiveElement';
import Fmt from "Fmt";
import type { Position } from 'geojson';
import type { MapperElement, MapperPolygon } from "models/MapDocument";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const el = active.getElement();

  const { t } = useTranslation();

  const [data, setData] = useState({
    area: 0,
    vertices: 0,
  });

  const updateMetrics = useThrottledCallback(
    (vertices: Position[]) => {
      const count = vertices.length;

      let area = 0;
      if (vertices.length > 2) {
        const gj = turf.polygon([[...vertices, vertices[0]]]);
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
    const el = active.getElement();
    if (el?.type !== 'Polygon') return;

    updateMetrics([...el.vertices, ...active.stroke]);
  }, [el, active.stroke, updateMetrics]);

  return (
    <div className={styles.panel}>
      <div className={styles.datum}>
        <div className={styles.title}>
          {t("metadata.area.name")}
        </div>
        <div className={styles.value}>
          {t("metadata.area.value", { value: Fmt.number(data.area) })}
        </div>
      </div>
      <div className={styles.datum}>
        <div className={styles.title}>
          {t("metadata.verts.name")}
        </div>
        <div className={styles.value}>
          {Fmt.number(data.vertices, 0)}
        </div>
      </div>
    </div>
  );
}


export default Metadata;
