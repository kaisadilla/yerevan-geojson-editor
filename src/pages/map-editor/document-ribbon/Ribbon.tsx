import { Button as MButton, Menu } from '@mantine/core';
import { FileArrowDownIcon, FileArrowUpIcon, FilePlusIcon, FloppyDiskIcon, FolderOpenIcon, GearIcon } from '@phosphor-icons/react';
import Local from 'Local';
import Button from 'components/Button';
import DescriptiveTooltip from 'components/DescriptiveTooltip';
import { getLocaleIcon, getLocaleName, LOCALE_NAMES } from 'i18n';
import { Redo, Undo } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isEventTargetEditable } from 'utils';
import { MapperHistory } from '../MapperHistory';
import styles from './Ribbon.module.scss';
import useImport from './buttons/useImport';
import useOpen from './buttons/useOpen';
import useRedo from './buttons/useRedo';
import useSave from './buttons/useSave';
import useUndo from './buttons/useUndo';

export interface EditorRibbonProps {
  
}

function DocumentRibbon (props: EditorRibbonProps) {
  const { t, i18n } = useTranslation();

  const { handleUndo } = useUndo();
  const { handleRedo } = useRedo();
  const { handleOpen } = useOpen();
  const { handleSave } = useSave();
  const { handleImport } = useImport();

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    MapperHistory.onHistoryChange(handleHistoryChange);

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      MapperHistory.offHistoryChange(handleHistoryChange);
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  return (
    <div className={styles.ribbon}>
      <Menu width={200}>
        <Menu.Target>
          <MButton
            classNames={{root: styles.toolButton}}
            variant='light'
          >
            {t("mapper.name")}
          </MButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item>
            {t("mapper.name")}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <div className={styles.documentRibbon}>
        <DescriptiveTooltip
          label={t("ribbon.new.name")}
          description={t("ribbon.new.desc")}
        >
          <Button>
            <FilePlusIcon size={24} weight='thin' />
          </Button>
        </DescriptiveTooltip>

        <DescriptiveTooltip
          label={t("ribbon.open.name")}
          description={t("ribbon.open.desc")}
        >
          <Button
            onClick={handleOpen}
          >
            <FolderOpenIcon size={24} weight='thin' />
          </Button>
        </DescriptiveTooltip>

        <DescriptiveTooltip
          label={t("ribbon.save.name")}
          description={t("ribbon.save.desc")}
        >
          <Button
            onClick={handleSave}
          >
            <FloppyDiskIcon size={24} weight='thin' />
          </Button>
        </DescriptiveTooltip>

        <DescriptiveTooltip
          label={t("ribbon.import.name")}
          description={t("ribbon.import.desc")}
        >
          <Button
            onClick={handleImport}
          >
            <FileArrowDownIcon size={24} weight='thin' />
          </Button>
        </DescriptiveTooltip>

        <DescriptiveTooltip
          label={t("ribbon.export.name")}
          description={t("ribbon.export.desc")}
        > 
          <Button>
            <FileArrowUpIcon size={24} weight='thin' />
          </Button>
        </DescriptiveTooltip>

        <DescriptiveTooltip
          label={t("ribbon.undo.name")}
          shortcut="Ctrl + Z"
        > 
          <Button
            onClick={handleUndo}
            disabled={canUndo === false}
          >
            <Undo />
          </Button>
        </DescriptiveTooltip>

        <DescriptiveTooltip
          label={t("ribbon.redo.name")}
          shortcut="Ctrl + Y"
        > 
          <Button
            onClick={handleRedo}
            disabled={canRedo === false}
          >
            <Redo />
          </Button>
        </DescriptiveTooltip>

        <DescriptiveTooltip
          label={t("ribbon.settings.name")}
          description={t("ribbon.settings.desc")}
        > 
          <Button>
            <GearIcon size={24} weight='thin' />
          </Button>
        </DescriptiveTooltip>
      </div>

      <div className={styles.appRibbon}>
        <Menu
          classNames={{
            dropdown: styles.languageMenu,
            item: styles.languageMenuItem,
          }}
        >
          <Menu.Target>
            <DescriptiveTooltip
              label={t("ribbon.language.name")}
              description={t("ribbon.language.desc")}
            > 
              <Button className={styles.langButton}>
                <img
                  className={styles.langIcon}
                  src={getLocaleIcon(i18n.language)}
                />
              </Button>
            </DescriptiveTooltip>
          </Menu.Target>

          <Menu.Dropdown>
              <Menu.Label>{t("ribbon.language.name")}</Menu.Label>
            {Object.keys(LOCALE_NAMES).map(k => (
              <Menu.Item
                key={k}
                onClick={() => handleChangeLanguage(k)}
                data-active={k === i18n.language}
              >
                <div className={styles.container}>
                  <img className={styles.langIcon} src={getLocaleIcon(k)} />
                  <div className={styles.name}>{getLocaleName(k)}</div>
                </div>
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </div>
    </div>
  );

  function handleHistoryChange (hasPast: boolean, hasFuture: boolean) {
    setCanUndo(hasPast);
    setCanRedo(hasFuture);
  }

  function handleKeyDown (evt: KeyboardEvent) {
    if (isEventTargetEditable(evt.target)) return;

    if (evt.code === 'KeyZ') {
      handleUndo();
    }
    else if (evt.code === 'KeyY') {
      handleRedo();
    }
  }

  function handleChangeLanguage (key: string) {
    i18n.changeLanguage(key);
    Local.setLocale(key);
  }
}

export default DocumentRibbon;
