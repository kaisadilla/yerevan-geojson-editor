import { Button, SegmentedControl } from '@mantine/core';
import { CursorIcon, LineSegmentsIcon } from '@phosphor-icons/react';
import DescriptiveTooltip from 'components/DescriptiveTooltip';
import { useActiveElement, type DeleteMode } from 'context/useActiveElement';
import type { Position } from 'geojson';
import { MapperHistory } from 'pages/map-editor/MapperHistory';
import { useTranslation } from 'react-i18next';
import { allowLabelShiftClick } from 'utils';
import BasePanel from '../BasePanel';
import styles from './DeleteVerticesPanel.module.scss';

export interface DeleteVerticesPanelProps {
  
}

function DeleteVerticesPanel (props: DeleteVerticesPanelProps) {
  const active = useActiveElement();
  const polygon = active.getPolygon();

  const { t } = useTranslation();

  return (
    <BasePanel className={styles.panel} name="Delete vertices tool">
      <BasePanel.Keys onKey={handleKey} />

      <BasePanel.Desc>
        {t("tool.polygon.delete_vertices.settings.desc")}
      </BasePanel.Desc>

      <BasePanel.Ribbon
        label={t("tool.polygon.delete_vertices.settings.section.mode")}
      >
        <SegmentedControl
          value={active.deleteMode}
          onChange={v => active.setDeleteMode(v as DeleteMode)}
          onClick={evt => allowLabelShiftClick(evt.nativeEvent)}
          data={[
            {
              value: 'individual',
              label: (
                <DescriptiveTooltip
                  label={
                    t("tool.polygon.delete_vertices.settings.mode.individual.name")
                  }
                  description={
                    t("tool.polygon.delete_vertices.settings.mode.individual.desc")
                  }
                >
                  <CursorIcon size={24} weight='thin' />
                </DescriptiveTooltip>
              ),
            },
            {
              value: 'section',
              label: (
                <DescriptiveTooltip
                  label={
                    t("tool.polygon.delete_vertices.settings.mode.section.name")
                  }
                  description={
                    t("tool.polygon.delete_vertices.settings.mode.section.desc")
                  }
                >
                  <LineSegmentsIcon size={24} weight='thin' />
                </DescriptiveTooltip>
              )
            }
          ]}
        />
      </BasePanel.Ribbon>

      {active.deleteMode === 'section' && <BasePanel.Ribbon
        containerClassName={styles.deleteSectionRibbon}
        label={t("tool.polygon.delete_vertices.settings.section.delete_section")}
      >
        <Button
          size='compact-sm'
          variant='light'
          onClick={handleReversePath}
        >
          {t("tool.polygon.delete_vertices.settings.delete_section.reverse")}
        </Button>

        <Button
          size='compact-sm'
          color='red'
          onClick={deletePath}
        >
          {t("tool.polygon.delete_vertices.settings.delete_section.delete")}
        </Button>
      </BasePanel.Ribbon>}
    </BasePanel>
  );

  function handleKey (code: string) {
    if (code === 'KeyQ') {
      active.setDeleteMode('individual');
    }
    else if (code === 'KeyW') {
      active.setDeleteMode('section');
    }
  }

  function handleReversePath () {
    active.setDeletePathReverse(!active.reverseDeletePath);
  }

  function deletePath () {
    if (!polygon) return;

    const indexArr = active.getDeletePath();
    if (indexArr === null) return;

    const indices = new Set(indexArr);

    const before = [...polygon.vertices];
    const after: Position[] = [];

    for (let i = 0; i < before.length; i++) {
      if (
        indices.has(i) === false
        || indexArr[0] === i 
        || indexArr[indexArr.length - 1] === i
      ) {
        after.push(before[i]);
      }
    }

    MapperHistory.push({
      type: 'change_vertices',
      elementId: polygon.id,
      before,
      after,
    });

    active.setVertices(after);
    active.setDeletePath({ start: null, end: null });
  }
}

export default DeleteVerticesPanel;
