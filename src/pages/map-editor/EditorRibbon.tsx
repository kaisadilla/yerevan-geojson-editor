import { Button as MButton, Menu } from '@mantine/core';
import { FileArrowDownIcon, FileArrowUpIcon, FilePlusIcon, FloppyDiskIcon, FolderOpenIcon, GearIcon } from '@phosphor-icons/react';
import Button from 'components/Button';
import DescriptiveTooltip from 'components/DescriptiveTooltip';
import { Redo, Undo } from 'lucide-react';
import styles from './EditorRibbon.module.scss';

export interface EditorRibbonProps {
  
}

function EditorRibbon (props: EditorRibbonProps) {

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
          <Button>
            <Undo />
          </Button>
        </DescriptiveTooltip>

        <DescriptiveTooltip label="Redo"> 
          <Button>
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
}

export default EditorRibbon;
