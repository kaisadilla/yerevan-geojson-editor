import styles from './DrawVerticesPanel.module.scss';

import { Checkbox, Slider, Tooltip } from '@mantine/core';
import BasePanel from "../panel/BasePanel";
import Description from '../panel/Description';

export interface DrawVerticesPanelProps {
  
}

function DrawVerticesPanel (props: DrawVerticesPanelProps) {

  return (
    <BasePanel className={styles.panel} name="Draw vertices tool">
      <Description>Click anywhere on the map to add the next vertex of your polygon. When you are done, click on the first vertex to close it, or simply deselect the draw tool and it will close automatically.</Description>
      
      <Checkbox label="Snap to nearby features." />
      <Tooltip.Floating label="When the mouse gets close to a vertex from another feature, snap to it.">
        <div>(help icon)</div>
      </Tooltip.Floating>
      
      <Slider label="Snap distance" />
      <Slider label="Pencil step" />
    </BasePanel>
  );
}

export default DrawVerticesPanel;
