import styles from './DrawVerticesPanel.module.scss';

import { MagnetIcon, MapPinIcon } from '@phosphor-icons/react';
import DescriptiveTooltip from 'components/DescriptiveTooltip';
import Slider from 'components/Slider';
import ToggleButton from 'components/ToggleButton';
import Constants from 'Constants';
import MathExt from 'MathExt';
import { useDispatch } from 'react-redux';
import { MapperUiActions } from 'state/mapper/uiSlice';
import useMapperUi from 'state/mapper/useUi';
import BasePanel from "../BasePanel";
import Description from '../Description';

export interface DrawVerticesPanelProps {
  
}

function DrawVerticesPanel (props: DrawVerticesPanelProps) {
  const ui = useMapperUi();
  const dispatch = useDispatch();

  return (
    <BasePanel className={styles.panel} name="Draw vertices tool">
      <Description>Click anywhere on the map to add the next vertex of your polygon. When you are done, click on the first vertex to close it, or simply deselect the draw tool and it will close automatically.</Description>
      
      <h3>Options</h3>
      <BasePanel.Ribbon>
        <DescriptiveTooltip
          label="Snap to nearby features"
          description="When enabled, the cursor will automatically snap to nearby features such as vertices or points, making it easy to draw the same line in different features."
        >
          <ToggleButton
            active={ui.toolSettings.snap}
            onChange={handleChangeSnap}
          >
            <MagnetIcon size={24} weight='thin' />
          </ToggleButton>
        </DescriptiveTooltip>

        <DescriptiveTooltip
          label="Show vertices"
          description="Whether to show a marker on each vertex of the polygon."
        >
          <ToggleButton
            active={ui.toolSettings.showVertices}
            onChange={handleChangeShowVertices}
          >
            <MapPinIcon size={24} weight='thin' />
          </ToggleButton>
        </DescriptiveTooltip>
      </BasePanel.Ribbon>
      
      <Slider
        label="Snap distance"
        labelWidth={120}
        description="The distance, in pixels, under which the cursor will snap to nearby features."
        min={Constants.minSnapDistance}
        max={Constants.maxSnapDistance}
        value={ui.toolSettings.snapDistance}
        onChange={handleChangeSnapDistance}
      />

      <Slider
        label="Pencil step"
        labelWidth={120}
        description="The distance, in pixels, between vertices laid out while right-clicking."
        min={Constants.minPencilStep}
        max={Constants.maxPencilStep}
        value={ui.toolSettings.pencilStep}
        onChange={handleChangePencilStep}
      />

      <Slider
        label="Vertex size"
        labelWidth={120}
        description="The size of the vertices on the map (visual only)."
        min={Constants.minVertexSize}
        max={Constants.maxVertexSize}
        value={ui.toolSettings.vertexSize}
        onChange={handleChangeVertexSize}
      />
    </BasePanel>
  );

  function handleChangeSnap (value: boolean) {
    dispatch(MapperUiActions.setToolSettings({
      key: 'snap',
      value,
    }));
  }

  function handleChangeSnapDistance (value: number) {
    dispatch(MapperUiActions.setToolSettings({
      key: 'snapDistance',
      value: MathExt.clamp(
        value, Constants.minSnapDistance, Constants.maxSnapDistance
      ),
    }));
  }

  function handleChangePencilStep (value: number) {
    dispatch(MapperUiActions.setToolSettings({
      key: 'pencilStep',
      value: MathExt.clamp(
        value, Constants.minPencilStep, Constants.maxPencilStep
      ),
    }));
  }

  function handleChangeVertexSize (value: number) {
    dispatch(MapperUiActions.setToolSettings({
      key: 'vertexSize',
      value: MathExt.clamp(
        value, Constants.minVertexSize, Constants.maxVertexSize
      ),
    }));
  }

  function handleChangeShowVertices (value: boolean) {
    dispatch(MapperUiActions.setToolSettings({
      key: 'showVertices',
      value,
    }));
  }
}

export default DrawVerticesPanel;
