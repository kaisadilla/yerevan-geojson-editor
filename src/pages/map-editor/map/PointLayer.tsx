import { useActiveElement } from "context/useActiveElement";
import { getChildren, isContainer, type MapperElement } from "models/MapDocument";
import MapPoint from "../features/MapPoint";

export interface PointLayerProps {
  group: MapperElement;
}

function PointLayer ({
  group,
}: PointLayerProps) {
  const active = useActiveElement();

  const children = getChildren(group);

  if (!children) return null;

  const points = children.filter(e => e.type === 'Point');
  const innerGroups = children.filter(e => isContainer(e));

  return (<>
    {points.filter(p => p.isHidden === false && p.id !== active.id).map(p => <MapPoint
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
