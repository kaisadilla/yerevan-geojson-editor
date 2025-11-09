import { getChildren, isContainer, type MapperElement } from "models/MapDocument";
import { useMap } from "react-leaflet";
import MapPoint from "../features/MapPoint";

export interface PointLayerProps {
  group: MapperElement;
}

function PointLayer ({
  group,
}: PointLayerProps) {
  const map = useMap();

  const children = getChildren(group);

  if (!children) return null;

  const points = children.filter(e => e.type === 'Point');
  const innerGroups = children.filter(e => isContainer(e));

  return (<>
    {points.filter(p => p.isHidden === false).map(p => <MapPoint
      key={p.id}
      point={p}
    />)}
    {innerGroups.filter(g => g.isHidden === false).map(g => <PointLayer
      key={g.id}
      group={g}
    />)}
  </>);
}

export default PointLayer;
