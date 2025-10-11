import { Input, Slider as MSlider, Tooltip, type SliderProps as MSliderProps } from '@mantine/core';
import { QuestionIcon } from '@phosphor-icons/react';
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
        {description && <Tooltip
          label={description}
        >
          <QuestionIcon size={16} />
        </Tooltip>}
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
