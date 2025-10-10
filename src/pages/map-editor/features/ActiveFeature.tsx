
import type { LFeature, LPolygon } from 'models/MapDocument';
import useMapEditorUi from 'state/mapEditor/useUi';
import NoTool from '../tools/NoTool';
import PolygonDrawVerticesTool from '../tools/PolygonDrawVerticesTool';

export interface ActiveFeatureProps {
  feature: LFeature;
}

function ActiveFeature ({
  feature,
}: ActiveFeatureProps) {
  const ui = useMapEditorUi();

  if (feature.geometry.type === 'Polygon') {
    const f = feature as LPolygon;
    if (ui.tool === 'draw_vertices') return (
      <PolygonDrawVerticesTool polygon={f} />
    )
  }

  return (
    <NoTool feature={feature} />
  );
}
export default ActiveFeature;
