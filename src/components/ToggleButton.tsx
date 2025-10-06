import { $cl } from 'utils';
import styles from './ToggleButton.module.scss';

export interface ToggleButtonProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange'>
{
  active: boolean;
  onChange?: (active: boolean) => void;
}

function ToggleButton ({
  className,
  children,
  active,
  onChange,
  ...buttonProps
}: ToggleButtonProps) {

  return (
    <button
      {...buttonProps}
      className={$cl(styles.toggle, className)}
      onClick={() => onChange?.(!active)}
      data-active={active}
    >
      {children}
    </button>
  );
}

export default ToggleButton;
