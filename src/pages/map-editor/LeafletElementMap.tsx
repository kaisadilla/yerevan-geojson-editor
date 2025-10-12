import type { MapperElementType, MapperPoint, MapperPolygon } from 'models/MapDocument';
import useMapEditorDoc from 'state/mapEditor/useDoc';
import ActiveFeature from './features/ActiveFeature';
import MapPoint from './features/MapPoint';
import MapPolygon from './features/MapPolygon';

export interface LeafletElementMapProps {
  
}

function LeafletElementMap (props: LeafletElementMapProps) {
  const doc = useMapEditorDoc();

  const elements = doc.getAllElements();

  const points = getFeaturesOfType('Point');
  const polygons = getFeaturesOfType('Polygon');

  const selected = doc.getSelectedElement();

  return (
    <>
      {points.map(p => <MapPoint
        key={p.id + "_" + doc.selectedId}
        point={p}
      />)}
      {polygons.map(p => <MapPolygon
        key={p.id + "_" + doc.selectedId}
        polygon={p}
      />)}
      
      {selected
        && selected.type !== 'Group'
        && selected.type !== 'Collection'
        && doc.isElementHidden(selected.id) === false
        && <ActiveFeature feature={selected} />}
    </>
  );

  function getFeaturesOfType (type: 'Point') : MapperPoint[];
  function getFeaturesOfType (type: 'Polygon') : MapperPolygon[];
  function getFeaturesOfType (type: MapperElementType) {
    return elements.filter(e => doc.isElementHidden(e.id) === false
      && e.id !== doc.selectedId
      && e.type === type
    );
  }
}

export default LeafletElementMap;
