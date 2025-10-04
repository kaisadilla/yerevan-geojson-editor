import { Text, Tooltip } from '@mantine/core';
import Logger from 'Logger';
import { Circle, Eye, EyeOff, FolderPlus, MapPin, Pentagon, Square, Waypoints } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { GeoJsonDocFeature } from 'state/geojsonDocSlice';
import type { RootState } from 'state/store';
import { $cl } from 'utils';
import MaterialSymbol from '../../components/MaterialSymbol';
import styles from './FeaturePanel.module.scss';

const HIERARCHY_INDENT_WIDTH = 16

export interface FeaturePanelProps {
  
}

function FeaturePanel (props: FeaturePanelProps) {
  const doc = useSelector((state: RootState) => state.geojsonDoc);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <Text lineClamp={1}>[Document Name]</Text>
      </div>
      <_Ribbon />
      <div className={styles.treeContainer}>
        {false && <_Group
          depth={0}
          name="Root folder"
        />}
        <_Tree features={doc.content.features} group="" />
      </div>
    </div>
  );
}

interface _TreeProps {
  features: GeoJsonDocFeature[];
  group: string;
}

function _Tree ({
  features,
  group,
}: _TreeProps) {
  const path = group.split("\\");
  const depth = group === "" ? -1 : path.length - 1;
  const groupName = path[depth];

  // Features contained directly in this group.
  const feats = [] as GeoJsonDocFeature[];
  // Features contained in groups nested inside this one.
  const subgroups = {} as Record<string, GeoJsonDocFeature[]>;

  for (const feat of features) {
    const fGroup = feat.properties?.group ?? "";

    if (fGroup === group) {
      feats.push(feat);
      continue;
    }

    if (group !== "" && fGroup.startsWith(group + "\\") === false) {
      Logger.warn(
        `Feature in group '${fGroup}' should not be part of the collection given
        to the tree representing '${group}'.`
      );
      continue;
    }

    const subgroupKey = fGroup.split("\\")[depth + 1];

    if (!subgroups[subgroupKey]) subgroups[subgroupKey] = [];
    subgroups[subgroupKey].push(feat);
  }

  const $elements = (<>
    {feats.map((f, i) => <_Feature
      key={i}
      name={f.properties.name}
      depth={depth + 1}
    />)}
    {Object.keys(subgroups).map((sg, i) => <_Tree
      key={i}
      features={subgroups[sg]}
      group={subgroups[sg][0].properties.group ?? ""}
    />)}
  </>);

  return (
    <div className={styles.featureTree}>
      {depth === -1 && $elements}
      {depth !== -1 && <_Group
        name={groupName}
        depth={depth}
        children={$elements}
      />}
    </div>
  );
}

function _Ribbon () {
  return (
    <div className={styles.ribbon}>
      <Tooltip.Floating label="Point">
        <button>
          <MapPin />
        </button>
      </Tooltip.Floating>

      <Tooltip.Floating label="Line">
        <button>
          <Waypoints />
        </button>
      </Tooltip.Floating>

      <Tooltip.Floating label="Polygon">
        <button>
          <Pentagon />
        </button>
      </Tooltip.Floating>

      <Tooltip.Floating label="Square">
        <button>
          <Square />
        </button>
      </Tooltip.Floating>

      <Tooltip.Floating label="Circle">
        <button>
          <Circle />
        </button>
      </Tooltip.Floating>

      <Tooltip.Floating label="Group">
        <button>
          <FolderPlus />
        </button>
      </Tooltip.Floating>
    </div>
  );
}

interface _FeatureProps {
  depth: number;
  name: string;
}

function _Feature ({
  depth,
  name,
}: _FeatureProps) {
  const [visible, setVisible] = useState(true);

  return (
    <div className={$cl(styles.element, styles.feature)} role='button'>
      <_HierarchyBar depth={depth} />
      <div className={styles.collapseGap} />
      <div className={styles.name}>
        <Text lineClamp={1}>{name}</Text>
      </div>
      <div className={$cl(styles.ribbon, styles.hoverOnly)}>
        <button onClick={() => setVisible(prev => !prev)}>
          {visible && <Eye />}
          {visible === false && <EyeOff />}
        </button>
      </div>
    </div>
  );
}

interface _GroupProps {
  depth: number;
  name: string;
  children: React.ReactNode;
}

function _Group ({
  depth,
  name,
  children,
}: _GroupProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      <div className={$cl(styles.element, styles.folder)} role='button'>
        <_HierarchyBar depth={depth} />
        <button
          className={styles.collapseIcon}
          onClick={() => setExpanded(prev => !prev)}
        >
          {expanded && <MaterialSymbol icon="arrow_drop_down" />}
          {expanded === false && <MaterialSymbol icon="arrow_right" />}
        </button>
        <div className={styles.name}>
          <Text lineClamp={1}>{name}</Text>
        </div>
      </div>
      <div className={styles.folderContent} data-visible={expanded}>
        {children}
      </div>
    </>
  );
}

interface _HierarchyBarProps {
  depth: number;
}

function _HierarchyBar ({
  depth,
}: _HierarchyBarProps) {
  return (
    <div
      className={styles.hierarchy}
      style={{width: HIERARCHY_INDENT_WIDTH * depth}}
    >
      <div className={styles.bar} />
    </div>
  );
}



export default FeaturePanel;
