import { Text, Tooltip, type TooltipProps } from '@mantine/core';
import { Keyboard } from 'lucide-react';
import styles from './DescriptiveTooltip.module.scss';

export interface DescriptiveTooltipProps extends Omit<TooltipProps, 'label'> {
  label?: string;
  description?: string;
  shortcut?: string;
  children: React.ReactNode;
}

function DescriptiveTooltip ({
  label,
  description,
  shortcut,
  children,
  ...tooltipProps
}: DescriptiveTooltipProps) {

  return (
    <Tooltip
      {...tooltipProps}
      classNames={{
        tooltip: styles.tooltip,
      }}
      label={
        <>
          {label && <div className={styles.header} data-desc={!!description}>
            <h3>{label}</h3>
            {shortcut && <div className={styles.shortcut}>
              <Keyboard />
              <span>{shortcut}</span>
            </div>}
          </div>}
          {description && <div className={styles.description}>
            <Text classNames={{ root: styles.textRoot }}>
              {description}
            </Text>
          </div>}
        </>
      }
    >
      {children}
    </Tooltip>
  );
}

export default DescriptiveTooltip;
