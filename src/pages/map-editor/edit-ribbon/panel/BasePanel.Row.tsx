import type React from 'react';
import type { DivProps } from 'types';
import { $cl } from 'utils';
import styles from './BasePanel.Row.module.scss';

export interface BasePanel_RowProps extends DivProps {
  children: React.ReactNode;
}

function BasePanel_Row ({
  children,
  className,
  ...divProps
}: BasePanel_RowProps) {

  return (
    <div {...divProps} className={$cl(styles.row, className)}>
      {children}
    </div>
  );
}

export default BasePanel_Row;
