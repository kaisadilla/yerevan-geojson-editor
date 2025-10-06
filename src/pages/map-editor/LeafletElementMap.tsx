import type { GeoJsonObject } from 'geojson';
import { useGjEditorState, type LPoint, type LPolygon } from 'state/geojsonDocSlice';
import MapPoint from './features/MapPoint';
import MapPolygon from './features/MapPolygon';

export interface LeafletElementMapProps {
  
}

function LeafletElementMap (props: LeafletElementMapProps) {
  const ctx = useGjEditorState();

  const elements = ctx.getAllElements();

  const points = getFeaturesOfType('Point') as LPoint[];
  const polygons = getFeaturesOfType('Polygon') as LPolygon[];

  return (
    <>
      {points.map(p => <MapPoint
        key={p.properties.id}
        point={p}
      />)}
      {polygons.map(p => <MapPolygon
        key={p.properties.id}
        polygon={p}
      />)}
    </>
  );

  function getFeaturesOfType (type: GeoJsonObject['type']) {
    return elements.filter(e => e.properties.hidden === false
      && e.properties.id !== ctx.selectedId
      && e.type === 'Feature'
      && e.geometry.type === type
    );
  }
}

export default LeafletElementMap;
