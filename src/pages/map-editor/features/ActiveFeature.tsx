
import type { MapperFeature } from 'models/MapDocument';
import useMapperUi from 'state/mapper/useUi';
import NoTool from '../tools/NoTool';
import PolygonDeleteVerticesTool from '../tools/PolygonDeleteVerticesTool';
import PolygonDrawVerticesTool from '../tools/PolygonDrawVerticesTool';
import PolygonSetOriginTool from '../tools/PolygonSetOriginTool';

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
    if (ui.tool === 'set_origin') return (
      <PolygonSetOriginTool />
    )
  }

  return (
    <NoTool feature={feature} />
  );
}
export default ActiveFeature;
