import { Tabs } from '@mantine/core';
import { useActiveElement } from 'context/useActiveElement';
import { useState } from 'react';
import useMapEditorDoc from 'state/mapEditor/useDoc';
import styles from './Details.module.scss';
import Metadata from './Metadata';
import PropertiesTable from './PropertiesTable';
import Source from './Source';

type TabId = 'properties' | 'source' | 'actions';

export interface DetailsProps {
  
}

function Details (props: DetailsProps) {
  const doc = useMapEditorDoc();
  const active = useActiveElement();

  const [tab, setTab] = useState<TabId>('properties');

  const element = active.getElement();

  if (!element) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2>{element.name}</h2>
      </div>

      <Tabs
        value={tab}
        onChange={v => setTab(v as TabId)}
        classNames={{
          root: styles.propsContainer
        }}
      >
        <Tabs.List>
          <Tabs.Tab value='properties'>Properties</Tabs.Tab>
          <Tabs.Tab value='source'>Source</Tabs.Tab>
          <Tabs.Tab value='actions'>Actions</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel
          classNames={{panel: styles.propsPanel}}
          value='properties'
        >
          <PropertiesTable element={element} />
        </Tabs.Panel>

        <Tabs.Panel value='source'>
          <Source element={element} />
        </Tabs.Panel>

        <Tabs.Panel value='actions'>
          Optimize vertices, reduce precision, etc.
        </Tabs.Panel>
      </Tabs>

      <div className={styles.metadata}>
        <Metadata element={element} />
      </div>
    </div>
  );
}

export default Details;
