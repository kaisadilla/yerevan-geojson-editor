import { Input } from '@mantine/core';
import { QuestionIcon } from '@phosphor-icons/react';
import DescriptiveTooltip from './DescriptiveTooltip';
import styles from './LabeledControl.module.scss';

export interface LabeledControlProps {
  label: string;
  labelWidth?: number;
  description?: string;
  children: React.ReactNode;
}

function LabeledControl ({
  label,
  labelWidth,
  description,
  children,
}: LabeledControlProps) {

  return (
    <Input.Wrapper
      classNames={{
        root: styles.wrapper,
      }}
      label={<>
        {label}
        {description && <DescriptiveTooltip
          description={description}
        >
          <QuestionIcon size={16} />
        </DescriptiveTooltip>}
      </>}
      labelProps={{
        className: styles.label,
        style: {
          width: labelWidth,
        }
      }}
    >
      {children}
    </Input.Wrapper>
  );
}

export default LabeledControl;
