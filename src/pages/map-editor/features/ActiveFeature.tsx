
import type { MapperFeature } from 'models/MapDocument';
import useMapEditorUi from 'state/mapEditor/useUi';
import NoTool from '../tools/NoTool';
import PolygonDrawVerticesTool from '../tools/PolygonDrawVerticesTool';

export interface ActiveFeatureProps {
  feature: MapperFeature;
}

function ActiveFeature ({
  feature,
}: ActiveFeatureProps) {
  const ui = useMapEditorUi();

  if (feature.type === 'Polygon') {
    if (ui.tool === 'draw_vertices') return (
      <PolygonDrawVerticesTool polygon={feature} />
    )
  }

  return (
    <NoTool feature={feature} />
  );
}
export default ActiveFeature;
