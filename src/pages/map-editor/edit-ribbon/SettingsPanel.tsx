import useMapEditorUi from 'state/mapEditor/useUi';
import DrawVerticesPanel from './polygon/DrawVerticesPanel';

export interface SettingsPanelProps {
  
}

function SettingsPanel (props: SettingsPanelProps) {
  const ui = useMapEditorUi();

  if (ui.tool === 'draw_vertices') return <DrawVerticesPanel />

  return null;
}

export default SettingsPanel;
