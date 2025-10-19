import { Button, Checkbox } from '@mantine/core';
import { useActiveElement } from 'context/useActiveElement';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { MapperUiActions } from 'state/mapper/uiSlice';
import useMapperDoc from 'state/mapper/useDoc';
import useMapperUi from 'state/mapper/useUi';
import BasePanel from '../BasePanel';
import Description from '../Description';

export interface UnionPanelProps {
  
}

function UnionPanel (props: UnionPanelProps) {
  const doc = useMapperDoc();
  const active = useActiveElement();
  const ui = useMapperUi();
  const dispatch = useDispatch();

  const { t } = useTranslation('ui');

  const polygon = active.getPolygon();
  const options = doc.content.elements.filter(
    e => e.type === 'Polygon' && e.id !== polygon?.id
  );

  const [value, setValue] = useState(options.length > 0 ? options[0].id : null);

  return (
    <BasePanel name="Union tool">
      <Description>
        {t("tools.union.settings.description")}
      </Description>

      <BasePanel.Row>
        <BasePanel.FeatureMenu
          elements={options}
          value={value}
          onChange={setValue}
          placeholder="Select a feature..."
        />

        <Button
          color='red'
          onClick={handleJoin}
          disabled={value === null}
        >
          Join
        </Button>
      </BasePanel.Row>

      <h3>Options</h3>

      <Checkbox
        label="Delete polygons added to this one."
        checked={ui.toolSettings.deleteFeaturesUsedByCombine}
        onChange={handleChangeDeleteFeatures}
      />
    </BasePanel>
  );

  function handleChangeDeleteFeatures (evt: React.ChangeEvent<HTMLInputElement>) {
    dispatch(MapperUiActions.setToolSettings({
      key: 'deleteFeaturesUsedByCombine',
      value: evt.target.checked,
    }));
  }

  function handleJoin () {
    if (!value) return;

    active.union(value, ui.toolSettings.deleteFeaturesUsedByCombine);
  }
}

export default UnionPanel;
