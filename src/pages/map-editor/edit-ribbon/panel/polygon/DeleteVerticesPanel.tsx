import { Button, SegmentedControl } from '@mantine/core';
import { CursorIcon, LineSegmentsIcon } from '@phosphor-icons/react';
import DescriptiveTooltip from 'components/DescriptiveTooltip';
import { useActiveElement, type DeleteMode } from 'context/useActiveElement';
import type { Position } from 'geojson';
import { MapperHistory } from 'pages/map-editor/MapperHistory';
import { allowLabelShiftClick } from 'utils';
import BasePanel from '../BasePanel';
import Description from '../Description';
import styles from './DeleteVerticesPanel.module.scss';

export interface DeleteVerticesPanelProps {
  
}

function DeleteVerticesPanel (props: DeleteVerticesPanelProps) {
  const active = useActiveElement();
  const polygon = active.getPolygon();

  return (
    <BasePanel className={styles.panel} name="Delete vertices tool">
      <BasePanel.Keys onKey={handleKey} />

      <Description>
        Select one of the two delete modes to choose how to delete vertices.
      </Description>

      <BasePanel.Ribbon label="Mode">
        <SegmentedControl
          value={active.deleteMode}
          onChange={v => active.setDeleteMode(v as DeleteMode)}
          onClick={evt => allowLabelShiftClick(evt.nativeEvent)}
          data={[
            {
              value: 'individual',
              label: (
                <DescriptiveTooltip
                  label="Individual"
                  description="Click on individual vertices to remove them."
                >
                  <CursorIcon size={24} weight='thin' />
                </DescriptiveTooltip>
              ),
            },
            {
              value: 'section',
              label: (
                <DescriptiveTooltip
                  label="Section"
                  description="Select two vertices. This will form a path between the two. Then, use the 'Delete vertices' button to delete all vertices in the path, excluding both ends."
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
        label="Delete section"
      >
        <Button
          size='compact-sm'
          variant='light'
          onClick={handleReversePath}
        >
          Reverse path
        </Button>

        <Button
          size='compact-sm'
          color='red'
          onClick={deletePath}
        >
          Delete vertices
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
