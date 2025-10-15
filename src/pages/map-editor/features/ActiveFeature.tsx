
import type { MapperFeature } from 'models/MapDocument';
import useMapperUi from 'state/mapper/useUi';
import NoTool from '../tools/NoTool';
import PolygonDeleteVerticesTool from '../tools/PolygonDeleteVerticesTool';
import PolygonDrawVerticesTool from '../tools/PolygonDrawVerticesTool';

export interface ActiveFeatureProps {
  feature: MapperFeature;
}

function ActiveFeature ({
  feature,
}: ActiveFeatureProps) {
  const ui = useMapperUi();

  if (feature.type === 'Polygon') {
    if (ui.tool === 'draw_vertices') return (
      <PolygonDrawVerticesTool />
    )
    if (ui.tool === 'delete_vertices') return (
      <PolygonDeleteVerticesTool />
    )
  }

  return (
    <NoTool feature={feature} />
  );
}
export default ActiveFeature;
