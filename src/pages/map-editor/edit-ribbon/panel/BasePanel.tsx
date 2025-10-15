import { Tooltip } from '@mantine/core';
import { CaretDoubleDownIcon, CaretDoubleUpIcon } from '@phosphor-icons/react';
import Button from 'components/Button';
import type React from 'react';
import { useDispatch } from 'react-redux';
import { MapperUiActions } from 'state/mapper/uiSlice';
import useMapperUi from 'state/mapper/useUi';
import { $cl } from 'utils';
import styles from './BasePanel.module.scss';

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
  const dispatch = useDispatch();

  if (ui.isSettingsPanelExpanded === false) return (
    <div className={styles.panel}>
      <Tooltip.Floating label={`Expand settings for ${name}.`}>
        <Button onClick={handleExpand}>
          <CaretDoubleDownIcon size={24} weight='thin' />
        </Button>
      </Tooltip.Floating>
    </div>
  )

  return (
    <div className={styles.panel} data-expanded={true}>
      <div className={styles.header}>
        <Tooltip.Floating label="Collapse">
          <Button onClick={handleCollapse}>
            <CaretDoubleUpIcon size={24} weight='thin' />
          </Button>
        </Tooltip.Floating>
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

interface _RibbonProps {
  label?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

function _Ribbon ({
  label,
  containerClassName,
  children,
}: _RibbonProps) {

  return (
    <div className={styles.ribbon}>
      {label && <h3>
        {label}
      </h3>}
      <div className={$cl(styles.items, containerClassName)}>
        {children}
      </div>
    </div>
  );
}

BasePanel.Ribbon = _Ribbon;

export default BasePanel;
