import { useActiveElement } from 'context/useActiveElement';
import { isPseudoContainer, shapeToPolygon, type MapperElement, type MapperElementType, type MapperLine, type MapperPoint, type MapperPolygon } from 'models/MapDocument';
import useMapperDoc from 'state/mapper/useDoc';
import ActiveFeature from './features/ActiveFeature';
import MapPoint from './features/MapPoint';
import MapPolygon from './features/MapPolygon';

export interface LeafletElementMapProps {
  
}

function LeafletElementMap (props: LeafletElementMapProps) {  
  const doc = useMapperDoc();
  const active = useActiveElement();

  const elements = doc.getAllElements(false);

  const points = getFeaturesOfType('Point');
  const lines = getFeaturesOfType('LineString');
  const polygons = getFeaturesOfType('Polygon');

  const selected = active.getElement();

  let siblings: MapperElement[] | null = null;

  if (selected && isPseudoContainer(selected)) {
    // If this element has holes, then it's a shape with holes.
    if (selected.holes.length > 0) {
      siblings = selected.holes;
    }
    // If it doesn't, then it may be a hole itself.
    else {
      const parent = doc.getParent(selected.id);
      if (parent && isPseudoContainer(parent)) {
        // The siblings are all the holes in its parent, except itself.
        siblings = parent.holes.filter(h => h.id !== selected.id);
      }
    }
  }


  return (
    <>
      {points.map(p => <MapPoint
        key={p.id + "_" + active.id}
        point={p}
      />)}
      {polygons.map(p => <MapPolygon
        key={p.id + "_" + active.id}
        polygon={p}
        isParent={
          !!selected
          && isPseudoContainer(p)
          && !!p.holes.find(h => h.id === selected.id)
        }
      />)}
      {siblings && siblings.map(s => <MapPolygon
        key={s.id + "_" + active.id}
        polygon={shapeToPolygon(s as any)}
        isSibling
      />)}

      <ActiveFeature />
    </>
  );

  function getFeaturesOfType (type: 'Point') : MapperPoint[];
  function getFeaturesOfType (type: 'LineString') : MapperLine[];
  function getFeaturesOfType (type: 'Polygon') : MapperPolygon[];
  function getFeaturesOfType (type: MapperElementType) {
    return elements.filter(e => doc.isElementHidden(e.id) === false
      && e.id !== active.id
      && e.type === type
    );
  }
}

export default LeafletElementMap;
