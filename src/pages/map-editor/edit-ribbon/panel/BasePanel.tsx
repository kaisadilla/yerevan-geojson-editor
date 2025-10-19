import { CaretDoubleDownIcon, CaretDoubleUpIcon } from '@phosphor-icons/react';
import Button from 'components/Button';
import DescriptiveTooltip from 'components/DescriptiveTooltip';
import { useKeyboard } from 'context/useKeyboard';
import type React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MapperUiActions } from 'state/mapper/uiSlice';
import useMapperUi from 'state/mapper/useUi';
import { $cl } from 'utils';
import BasePanel_FeatureMenu from './BasePanel.FeatureMenu';
import BasePanel_Keys from './BasePanel.Keys';
import styles from './BasePanel.module.scss';
import BasePanel_Ribbon from './BasePanel.Ribbon';
import BasePanel_Row from './BasePanel.Row';

export interface PanelProps {
  name: string;
  className?: string;
  children: React.ReactNode;
}

function BasePanel ({
  name,
  className,
  children,
}: PanelProps) {
  const ui = useMapperUi();
  const keyboard = useKeyboard();
  const dispatch = useDispatch();

  useEffect(() => {
    // Shift will collapse the panel. Ctrl + shift will expand it.
    if (keyboard.shift) {
      dispatch(MapperUiActions.setSettingsPanelExpanded(keyboard.ctrl));
    }
  }, [keyboard.shift]);

  if (keyboard.shift === false && ui.isSettingsPanelExpanded === false) return (
    <div className={styles.panel}>
      <DescriptiveTooltip
        label={`Expand settings for ${name}.`}
        description="🛈 You can use 'shift' to temporarily expand the panel or 'ctrl + shift' to leave it expanded."
      >
        <Button onClick={handleExpand}>
          <CaretDoubleDownIcon size={24} weight='thin' />
        </Button>
      </DescriptiveTooltip>
    </div>
  )

  return (
    <div className={styles.panel} data-expanded={true}>
      <div className={styles.header}>
        <DescriptiveTooltip
          label="Collapse"
          shortcut="Shift"
        >
          <Button onClick={handleCollapse}>
            <CaretDoubleUpIcon size={24} weight='thin' />
          </Button>
        </DescriptiveTooltip>
        <h3>{name}</h3>
      </div>
      <div className={$cl(styles.content, className)}>
        {children}
      </div>
    </div>
  );

  function handleExpand () {
    dispatch(MapperUiActions.setSettingsPanelExpanded(true));
  }

  function handleCollapse () {
    dispatch(MapperUiActions.setSettingsPanelExpanded(false));
  }
}

BasePanel.Ribbon = BasePanel_Ribbon;
BasePanel.Keys = BasePanel_Keys;
BasePanel.FeatureMenu = BasePanel_FeatureMenu;
BasePanel.Row = BasePanel_Row;

export default BasePanel;
