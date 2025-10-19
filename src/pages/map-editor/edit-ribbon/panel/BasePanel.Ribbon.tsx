import { $cl } from 'utils';
import styles from './BasePanel.Ribbon.module.scss';

export interface _RibbonProps {
  label?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

function BasePanel_Ribbon ({
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

export default BasePanel_Ribbon;
