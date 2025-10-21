import { Text } from '@mantine/core';
import { useSelector } from 'react-redux';
import type { RootState } from 'state/store';
import Element from './Element';
import styles from './ElementPanel.module.scss';
import Ribbon from "./Ribbon";

export interface ElementPanelProps {
  
}

function ElementPanel (props: ElementPanelProps) {
  const doc = useSelector((state: RootState) => state.mapEditorDoc);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <Text lineClamp={1}>{doc.content.name}</Text>
      </div>
      <Ribbon />
      <div className={styles.treeContainer}>
        <Element element={doc.content} depth={-1} />
      </div>
    </div>
  );
}

export default ElementPanel;
