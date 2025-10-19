import useMapperUi from 'state/mapper/useUi';
import DeleteVerticesPanel from './panel/polygon/DeleteVerticesPanel';
import DrawVerticesPanel from './panel/polygon/DrawVerticesPanel';
import UnionPanel from './panel/polygon/UnionPanel';

export interface SettingsPanelProps {
  
}

function SettingsPanel (props: SettingsPanelProps) {
  const ui = useMapperUi();

  if (ui.tool === 'draw_vertices') return <DrawVerticesPanel />;
  if (ui.tool === 'delete_vertices') return <DeleteVerticesPanel />;
  if (ui.tool === 'union') return <UnionPanel />;

  return null;
}

export default SettingsPanel;
