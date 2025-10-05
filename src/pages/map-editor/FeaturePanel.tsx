import type { BaseEventPayload, DropTargetLocalizedData, ElementDragType } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Text, Tooltip } from '@mantine/core';
import type { GeoJsonObject } from 'geojson';
import { Circle, Folder, FolderPlus, MapPin, Pentagon, Square, Waypoints } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { gjEditorActions, type LElement, type LFeature, type LGroup } from 'state/geojsonDocSlice';
import type { RootState } from 'state/store';
import { $cl } from 'utils';
import MaterialSymbol from '../../components/MaterialSymbol';
import styles from './FeaturePanel.module.scss';

type ElementType = GeoJsonObject["type"] | "FeatureCollection";
type DropTarget = 'above' | 'in' | 'below'

const HIERARCHY_INDENT_WIDTH = 16

export interface FeaturePanelProps {
  
}

function FeaturePanel (props: FeaturePanelProps) {
  const doc = useSelector((state: RootState) => state.gjEditor);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <Text lineClamp={1}>[Document Name]</Text>
      </div>
      <_Ribbon />
      <div className={styles.treeContainer}>
        <_Element element={doc.content} depth={-1} />
      </div>
    </div>
  );
}

interface _ElementProps {
  element: LFeature | LGroup;
  depth: number;
}

function _Element ({
  element,
  depth,
}: _ElementProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [expanded, setExpanded] = useState(true);
  const [isDragged, setDragged] = useState(false);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  const ctx = useSelector((state: RootState) => state.gjEditor);
  const dispatch = useDispatch();

  // Drag & Drop
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanupDrag = draggable({
      element: el,
      onDragStart: () => setDragged(true),
      onDrop: () => setDragged(false),
      getInitialData: () => ({
        id: element.properties.id,
        name: element.properties.name,
        type: element.type,
      }),
    });

    const cleanupDrop = dropTargetForElements({
      element: el,
      getData: () => ({
        id: element.properties.id,
        name: element.properties.name,
        type: element.type,
      }),
      onDragEnter: handleDrag,
      onDrag: handleDrag,
      onDragLeave: () => setDropTarget(null),
      onDrop: handleDrop,
    });

    return () => {
      cleanupDrag();
      cleanupDrop();
    }
  }, [element, dispatch, dropTarget]);

  let children = null as LElement[] | null;
  let type: ElementType = 'FeatureCollection';

  if (element.type === 'FeatureCollection') {
    children = element.features;
  }
  else {
    type = element.geometry.type;
  }

  const hierarchyIndent = HIERARCHY_INDENT_WIDTH * depth;

  return (<>
    {depth >= 0 && <div
      ref={ref}
      className={$cl(styles.element)}
      role='button'
      onClick={handleClick}
      data-selected={ctx.selectedId === element.properties.id}
      data-dragged={isDragged}
      data-drop-target={dropTarget}
    >
      {(dropTarget === 'above' || dropTarget === 'below') && <div
        className={styles.dropTarget}
        style={{
          width: `calc(100% - ${hierarchyIndent})`,
          left: hierarchyIndent,
          top: dropTarget === 'above' ? -2 : undefined,
          bottom: dropTarget === 'below' ? -2 : undefined,
        }}
      />}

      <div
        className={styles.hierarchy}
        style={{width: hierarchyIndent}}
      >
        <div className={styles.bar} />
      </div>

      <div className={styles.collapseContainer}>
        {children !== null && <button
          className={styles.collapseButton}
          onClick={() => setExpanded(prev => !prev)}
        >
          {expanded && <MaterialSymbol icon="arrow_drop_down" />}
          {expanded === false && <MaterialSymbol icon="arrow_right" />}
        </button>}
      </div>

      <div className={styles.type}>
        {type === 'FeatureCollection' && <Folder />}
        {type === 'Point' && <MapPin />}
        {type === 'LineString' && <Waypoints />}
        {type === 'Polygon' && <Pentagon />}
      </div>

      <div className={styles.name}>
        <Text lineClamp={1}>{element.properties.name}</Text>
      </div>
    </div>}
    {children !== null && isDragged === false && <div
      className={styles.folderContent}
      data-visible={expanded}
      data-drop-target={dropTarget}
    >
      {children.map((c, i) => <_Element
        key={c.properties.id}
        element={c}
        depth={depth + 1}
      />)}
    </div>}
  </>)

  function handleClick () {
    if (ctx.selectedId === element.properties.id) return;

    dispatch(gjEditorActions.setSelected(element.properties.id));
  }
  
  function handleDrag ({
    source,
    location
  }: BaseEventPayload<ElementDragType> & DropTargetLocalizedData) {
    if (source.data.id === element.properties.id) return;
    if (ref.current === null) return;

    const rect = ref.current.getBoundingClientRect();
    const y = location.current.input.clientY;
    const ratio = (y - rect.top) / rect.height;

    if (element.type === 'FeatureCollection') {
      if (ratio < 0.33) setDropTarget('above');
      else if (ratio < 0.67) setDropTarget('in');
      else setDropTarget('below');
    }
    else {
      if (ratio < 0.5) setDropTarget('above');
      else setDropTarget('below');
    }
  };

  function handleDrop ({
    source
  }: BaseEventPayload<ElementDragType> & DropTargetLocalizedData) {
    const target = dropTarget;
    setDropTarget(null);

    if (source.data.id === element.properties.id) return;
    if (target === null) return;

    dispatch(gjEditorActions.moveFeature({
      elementId: element.properties.id,
      targetId: source.data.id as string,
      position: target,
    }))
  }
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

export default FeaturePanel;
