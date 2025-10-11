import { Input, Slider as MSlider, type SliderProps as MSliderProps } from '@mantine/core';
import { QuestionIcon } from '@phosphor-icons/react';
import DescriptiveTooltip from './DescriptiveTooltip';
import styles from './Slider.module.scss';

export interface SliderProps extends MSliderProps {
  label: string;
  labelWidth?: number;
  description?: string;
}

function Slider ({
  label,
  labelWidth,
  description,
  ...sliderProps
}: SliderProps) {

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
      <MSlider
        {...sliderProps}
      />
    </Input.Wrapper>
  );
}

export default Slider;
