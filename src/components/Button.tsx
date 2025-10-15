import { $cl } from 'utils';
import styles from './Button.module.scss';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>
{
  onClick?: () => void;
}

function Button ({
  className,
  children,
  onClick,
  ...buttonProps
}: ButtonProps) {

  return (
    <button
      {...buttonProps}
      className={$cl(styles.button, className)}
      onClick={() => onClick?.()}
    >
      {children}
    </button>
  );
}

export default Button;
