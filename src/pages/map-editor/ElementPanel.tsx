import type { BaseEventPayload, DropTargetLocalizedData, ElementDragType } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Text } from '@mantine/core';
import DescriptiveTooltip from "components/DescriptiveTooltip";
import { useActiveElement } from "context/useActiveElement";
import { Boxes, Circle, Eye, EyeOff, Folder, FolderPlus, MapPin, Pentagon, Square, Waypoints } from 'lucide-react';
import type { MapperElement } from "models/MapDocument";
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapEditorDocActions } from 'state/mapper/docSlice';
import useMapEditorDoc from "state/mapper/useDoc";
import type { RootState } from 'state/store';
import { $cl } from 'utils';
import MaterialSymbol from '../../components/MaterialSymbol';
import styles from './ElementPanel.module.scss';

type DropTarget = 'before' | 'inside' | 'after'

const HIERARCHY_INDENT_WIDTH = 16

export interface ElementPanelProps {
  
}

function ElementPanel (props: ElementPanelProps) {
  const doc = useSelector((state: RootState) => state.mapEditorDoc);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <Text lineClamp={1}>{doc.content.name}</Text>
      </div>
      <_Ribbon />
      <div className={styles.treeContainer}>
        <_Element element={doc.content} depth={-1} />
      </div>
    </div>
  );
}

interface _ElementProps {
  element: MapperElement;
  depth: number;
  validDropTarget?: boolean;
}

function _Element ({
  element,
  depth,
  validDropTarget = true,
}: _ElementProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [expanded, setExpanded] = useState(true);
  const [isDragged, setDragged] = useState(false);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  validDropTarget = validDropTarget && isDragged === false;

  const doc = useMapEditorDoc();
  const active = useActiveElement();
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
        id: element.id,
        name: element.name,
        type: element.type,
      }),
    });

    const cleanupDrop = dropTargetForElements({
      element: el,
      getData: () => ({
        id: element.id,
        name: element.name,
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

  let children = null as MapperElement[] | null;
  let type = element.type;

  if (element.type === 'Group') {
    children = element.elements;
  }

  const hierarchyIndent = HIERARCHY_INDENT_WIDTH * depth;
  const isHidden = doc.isElementHidden(element.id) ?? false;

  return (<>
    {depth >= 0 && <div
      ref={ref}
      className={$cl(
        styles.element,
        type === 'Group' && styles.folder
      )}
      role='button'
      onClick={handleClick}
      data-selected={active.id === element.id}
      data-dragged={isDragged}
      data-drop-target={dropTarget}
      data-valid-drop-target={validDropTarget}
      data-hidden={isHidden}
    >
      {validDropTarget && (dropTarget === 'before' || dropTarget === 'after') && <div
        className={styles.dropTarget}
        style={{
          width: `calc(100% - ${hierarchyIndent})`,
          left: hierarchyIndent,
          top: dropTarget === 'before' ? -2 : undefined,
          bottom: dropTarget === 'after' ? -2 : undefined,
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
        {type === 'Group' && <Folder />}
        {type === 'Point' && <MapPin />}
        {type === 'LineString' && <Waypoints />}
        {type === 'Polygon' && <Pentagon />}
        {type === 'Collection' && <Boxes />}
      </div>

      <div className={styles.name}>
        <Text lineClamp={1}>{element.name}</Text>
      </div>

      <div
        className={$cl(styles.ribbon, styles.hoverOnly)}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={handleToggleVisibility}>
          {element.isHidden === false && <Eye />}
          {element.isHidden && <EyeOff />}
        </button>
      </div>
    </div>}

    {children !== null && <div
      className={styles.folderContent}
      data-visible={expanded}
      data-drop-target={dropTarget}
    >
      {children.map((c, i) => <_Element
        key={c.id}
        element={c}
        depth={depth + 1}
        validDropTarget={validDropTarget}
      />)}
    </div>}
  </>)

  function handleClick () {
    if (active.id === element.id) return;

    active.setElement(element.id, true);
  }
  
  function handleDrag ({
    source,
    location
  }: BaseEventPayload<ElementDragType> & DropTargetLocalizedData) {
    if (validDropTarget === false) return;
    if (source.data.id === element.id) return;
    if (ref.current === null) return;

    const rect = ref.current.getBoundingClientRect();
    const y = location.current.input.clientY;
    const ratio = (y - rect.top) / rect.height;

    if (element.type === 'Group' || element.type === 'Collection') {
      if (ratio < 0.33) setDropTarget('before');
      else if (ratio < 0.67) setDropTarget('inside');
      else if (expanded) setDropTarget('inside');
      else setDropTarget('after');
    }
    else {
      if (ratio < 0.5) setDropTarget('before');
      else setDropTarget('after');
    }
  };

  function handleDrop ({
    source
  }: BaseEventPayload<ElementDragType> & DropTargetLocalizedData) {
    const target = dropTarget;
    setDropTarget(null);

    if (validDropTarget === false) return;
    if (source.data.id === element.id) return;
    if (target === null) return;

    dispatch(MapEditorDocActions.moveElement({
      elementId: source.data.id as string,
      targetId: element.id,
      position: target,
    }));
  }

  function handleToggleVisibility () {
    dispatch(MapEditorDocActions.setHidden({
      elementId: element.id,
      value: !element.isHidden,
    }));
  }
}

function _Ribbon () {
  return (
    <div className={styles.ribbon}>
      <DescriptiveTooltip
        label="Group"
        description="A folder to group features together. This is a Leaflys-only feature: the document will be flattened when saved."
      >
        <button>
          <FolderPlus />
        </button>
      </DescriptiveTooltip>

      <DescriptiveTooltip
        label="Point"
      >
        <button>
          <MapPin />
        </button>
      </DescriptiveTooltip>

      <DescriptiveTooltip
        label="Line"
      >
        <button>
          <Waypoints />
        </button>
      </DescriptiveTooltip>

      <DescriptiveTooltip
        label="Polygon"
      >
        <button>
          <Pentagon />
        </button>
      </DescriptiveTooltip>

      <DescriptiveTooltip
        label="Square"
      >
        <button>
          <Square />
        </button>
      </DescriptiveTooltip>

      <DescriptiveTooltip
        label="Circle"
      >
        <button>
          <Circle />
        </button>
      </DescriptiveTooltip>

      <DescriptiveTooltip
        label="Geometry collection"
        description="A GeoJson collection of features. Leaflys will automatically pick the correct collection type on save. As per GeoJson standard, the contents of a GeoJson collection are not independent and will not retain their individual properties."
      >
        <button>
          <Boxes />
        </button>
      </DescriptiveTooltip>
    </div>
  );
}

export default ElementPanel;
