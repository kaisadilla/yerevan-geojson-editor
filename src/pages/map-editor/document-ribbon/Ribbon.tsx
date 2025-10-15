import { Button as MButton, Menu } from '@mantine/core';
import { FileArrowDownIcon, FileArrowUpIcon, FilePlusIcon, FloppyDiskIcon, FolderOpenIcon, GearIcon } from '@phosphor-icons/react';
import Button from 'components/Button';
import DescriptiveTooltip from 'components/DescriptiveTooltip';
import { Redo, Undo } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapperHistory } from '../MapperHistory';
import styles from './Ribbon.module.scss';
import useRedo from './buttons/useRedo';
import useUndo from './buttons/useUndo';

export interface EditorRibbonProps {
  
}

function DocumentRibbon (props: EditorRibbonProps) {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const { handleUndo } = useUndo();
  const { handleRedo } = useRedo();

  useEffect(() => {
    MapperHistory.onHistoryChange(handleHistoryChange);

    return () => MapperHistory.offHistoryChange(handleHistoryChange);
  }, []);

  return (
    <div className={styles.ribbon}>
      <Menu width={200}>
        <Menu.Target>
          <MButton
            classNames={{root: styles.toolButton}}
            variant='light'
          >
            Map editor
          </MButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item>
            Map editor
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <div className={styles.documentRibbon}>
        <DescriptiveTooltip
          label="New document"
          description="Create a new blank document."
        >
          <Button>
            <FilePlusIcon size={24} weight='thin' />
          </Button>
        </DescriptiveTooltip>

        <DescriptiveTooltip
          label="Open document"
          description="Opens a different Leaflys document. For GeoJson documents from other origins, use 'Import' instead."
        >
          <Button>
            <FolderOpenIcon size={24} weight='thin' />
          </Button>
        </DescriptiveTooltip>

        <DescriptiveTooltip
          label="Save document"
          description="Saves this document, preserving all Leaflys-related information for future use inside this app."
        >
          <Button>
            <FloppyDiskIcon size={24} weight='thin' />
          </Button>
        </DescriptiveTooltip>

        <DescriptiveTooltip
          label="Import GeoJSON"
          description="Add the contents of a GeoJson file (partially or completely) to this document."
        >
          <Button>
            <FileArrowDownIcon size={24} weight='thin' />
          </Button>
        </DescriptiveTooltip>

        <DescriptiveTooltip
          label="Export GeoJSON"
          description="Save this document as a regular GeoJson file, stripping all Leaflys-related fields. If you want to use that file in Leaflys later, use 'Save' instead."
        > 
          <Button>
            <FileArrowUpIcon size={24} weight='thin' />
          </Button>
        </DescriptiveTooltip>

        <DescriptiveTooltip label="Undo"> 
          <Button
            onClick={handleUndo}
            disabled={canUndo === false}
          >
            <Undo />
          </Button>
        </DescriptiveTooltip>

        <DescriptiveTooltip label="Redo"> 
          <Button
            onClick={handleRedo}
            disabled={canRedo === false}
          >
            <Redo />
          </Button>
        </DescriptiveTooltip>

        <DescriptiveTooltip
          label="Settings"
          description="Edit settings and properties related to this document and the app."
        > 
          <Button>
            <GearIcon size={24} weight='thin' />
          </Button>
        </DescriptiveTooltip>
      </div>
    </div>
  );

  function handleHistoryChange (hasPast: boolean, hasFuture: boolean) {
    setCanUndo(hasPast);
    setCanRedo(hasFuture);
  }
}

export default DocumentRibbon;
