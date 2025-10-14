import { Button, SegmentedControl } from '@mantine/core';
import { CursorIcon, LineSegmentsIcon } from '@phosphor-icons/react';
import DescriptiveTooltip from 'components/DescriptiveTooltip';
import { useActiveElement, type DeleteMode } from 'context/useActiveElement';
import BasePanel from '../BasePanel';
import Description from '../Description';
import styles from './DeleteVerticesPanel.module.scss';

export interface DeleteVerticesPanelProps {
  
}

function DeleteVerticesPanel (props: DeleteVerticesPanelProps) {
  const active = useActiveElement();

  return (
    <BasePanel className={styles.panel} name="Delete vertices tool">
      <Description>
        Select one of the two delete modes to choose how to delete vertices.
      </Description>

      <BasePanel.Ribbon label="Mode">
        <SegmentedControl
          value={active.deleteMode}
          onChange={v => active.setDeleteMode(v as DeleteMode)}
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
        <Button size='compact-sm' variant='light'>
          Reverse path
        </Button>

        <Button size='compact-sm' color='red'>
          Delete vertices
        </Button>
      </BasePanel.Ribbon>}
    </BasePanel>
  );
}

export default DeleteVerticesPanel;
