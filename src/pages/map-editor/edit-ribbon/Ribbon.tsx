/// <reference types="vite-plugin-svgr/client" />
import { IntersectSquareIcon, PolygonIcon, SubtractSquareIcon, UniteSquareIcon } from "@phosphor-icons/react";
import DescriptiveTooltip from "components/DescriptiveTooltip";
import ToggleButton from "components/ToggleButton";
import { Eraser, Goal, Move, Pencil, Scissors } from 'lucide-react';
import type { LElementType } from "models/MapDocument";
import type React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGjEditorState } from "state/mapEditor/docSlice";
import { mapEditorUiActions, type MapEditorTool } from "state/mapEditor/uiSlice";
import useMapEditorUi from "state/mapEditor/useUi";
import styles from './Ribbon.module.scss';

export interface EditRibbonProps {
  
}

function EditRibbon (props: EditRibbonProps) {
  const ctx = useGjEditorState();

  const el = ctx.getSelectedElement();
  let type: LElementType | null = null;

  if (el?.type === 'FeatureCollection') {
    type = 'FeatureCollection'
  }
  else if (el?.type === 'Feature') {
    type = el.geometry.type;
  }

  if (el?.properties._leaflys_hidden) return <div className={styles.ribbon} />;

  return (
    <div className={styles.ribbon}>
      {type === 'Polygon' && <_Polygon />}
    </div>
  );
}

interface _PolygonProps {
  
}

function _Polygon (props: _PolygonProps) {
  const ui = useMapEditorUi();
  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  return (
    <div className={styles.toolset}>
      <div className={styles.title}>Polygon</div>
      <_Toggle
        tool='draw_vertices'
        shortcut="1"
        label="Draw vertices"
        description="Add new vertices to this polygon."
      >
        <Pencil />
      </_Toggle>

      <_Toggle
        tool='move_vertices'
        shortcut="2"
        label="Move vertices"
        description="Move the vertices that make up this polygon, and add new vertices between them."
      >
        <PolygonIcon width={24} height={24} weight='thin' />
      </_Toggle>

      <_Toggle
        tool='cut'
        shortcut="3"
        label="Cut shape"
        description="Draw a new shape that will be cut from this one."
      >
        <Scissors />
      </_Toggle>

      <_Toggle
        tool='delete_vertices'
        shortcut="4"
        label="Delete vertices"
        description="Remove individual vertices, or entire sections of the shape."
      >
        <Eraser />
      </_Toggle>

      <_Toggle
        tool='union'
        shortcut="5"
        label="Add other polygon"
        description="Choose other polygons to add their area to this one."
      >
        <UniteSquareIcon width={24} height={24} weight='thin' />
      </_Toggle>

      <_Toggle
        tool='difference'
        shortcut="6"
        label="Subtract other polygon"
        description="Choose other polygons to remove their area from this one."
      >
        <SubtractSquareIcon width={24} height={24} weight='thin' />
      </_Toggle>

      <_Toggle
        tool='intersect'
        shortcut="7"
        label="Keep intersection with other polygon"
        description="Choose another polygon to remove all area in this polygon that isn't shared with the one chosen."
      >
        <IntersectSquareIcon width={24} height={24} weight='thin' />
      </_Toggle>

      <_Toggle
        tool='set_origin'
        shortcut="8"
        label="Set first vertex"
        description="Choose which vertex becomes the first vertex of the shape."
      >
        <Goal />
      </_Toggle>

      <_Toggle
        tool='move_shape'
        shortcut="9"
        label="Move polygon"
        description="Move the polygon itself around the map."
      >
        <Move />
      </_Toggle>
    </div>
  );

  function handleKeyDown (evt: KeyboardEvent) {
    const tool: MapEditorTool | null = (() => {
      if (evt.key === '1') return 'draw_vertices';
      else if (evt.key === '2') return 'move_vertices';
      else if (evt.key === '3') return 'cut';
      else if (evt.key === '4') return 'delete_vertices';
      else if (evt.key === '5') return 'union';
      else if (evt.key === '6') return 'difference';
      else if (evt.key === '7') return 'intersect';
      else if (evt.key === '8') return 'set_origin';
      else if (evt.key === '9') return 'move_shape';
      return null;
    })();

    if (tool) {
      dispatch(mapEditorUiActions.setTool(tool === ui.tool ? null : tool));
    }
  }
}

interface _ToggleProps {
  tool: MapEditorTool;
  label: string;
  description?: string;
  shortcut?: string;
  children: React.ReactElement;
}

function _Toggle ({
  tool,
  label,
  description,
  shortcut,
  children,
}: _ToggleProps) {
  const doc = useGjEditorState();
  const ui = useMapEditorUi();
  const dispatch = useDispatch();

  return (
    <DescriptiveTooltip
      label={label}
      description={description}
      shortcut={shortcut}
      position='bottom'
      offset={16}
    >
      <ToggleButton
        active={ui.tool === tool}
        onChange={v => setTool(tool, v)}
      >
        {children}
      </ToggleButton>
    </DescriptiveTooltip>
  );

  function setTool (tool: MapEditorTool, value: boolean) {
    dispatch(mapEditorUiActions.setTool(value ? tool : null));
  }
}



export default EditRibbon;
