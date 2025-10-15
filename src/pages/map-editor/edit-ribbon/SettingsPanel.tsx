import useMapperUi from 'state/mapper/useUi';
import DeleteVerticesPanel from './panel/polygon/DeleteVerticesPanel';
import DrawVerticesPanel from './panel/polygon/DrawVerticesPanel';

export interface SettingsPanelProps {
  
}

function SettingsPanel (props: SettingsPanelProps) {
  const ui = useMapperUi();

  if (ui.tool === 'draw_vertices') return <DrawVerticesPanel />;
  if (ui.tool === 'delete_vertices') return <DeleteVerticesPanel />;

  return null;
}

export default SettingsPanel;
