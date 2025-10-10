import type { GeoJsonObject } from 'geojson';
import type { LPoint, LPolygon } from 'models/MapDocument';
import { useGjEditorState } from 'state/mapEditor/docSlice';
import ActiveFeature from './features/ActiveFeature';
import MapPoint from './features/MapPoint';
import MapPolygon from './features/MapPolygon';

export interface LeafletElementMapProps {
  
}

function LeafletElementMap (props: LeafletElementMapProps) {
  const ctx = useGjEditorState();

  const elements = ctx.getAllElements();

  const points = getFeaturesOfType('Point') as LPoint[];
  const polygons = getFeaturesOfType('Polygon') as LPolygon[];

  const selected = ctx.getSelectedElement();

  return (
    <>
      {points.map(p => <MapPoint
        key={p.properties.id + "_" + ctx.selectedId}
        point={p}
      />)}
      {polygons.map(p => <MapPolygon
        key={p.properties.id + "_" + ctx.selectedId}
        polygon={p}
      />)}
      
      {selected
        && selected.type === 'Feature'
        && selected.properties.hidden === false // TODO: Check if parent group is hidden.
        && <ActiveFeature feature={selected} />}
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
