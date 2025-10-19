import { Select, type SelectProps } from '@mantine/core';
import type { MapperElement } from 'models/MapDocument';

export interface BasePanel_FeatureMenuProps extends Omit<SelectProps, 'data'> {
  elements: MapperElement[];
}

function BasePanel_FeatureMenu ({
  elements,
  value,
  onChange,
  ...selectProps
}: BasePanel_FeatureMenuProps) {
  const sel = elements.find(f => f.id === value);

  return (
    <Select
      {...selectProps}
      data={elements.map(f => ({
        value: f.id,
        label: f.name,
      }))}
      value={value}
      onChange={onChange}
    />
  );
}

export default BasePanel_FeatureMenu;
