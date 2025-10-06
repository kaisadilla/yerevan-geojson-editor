/// <reference types="vite-plugin-svgr/client" />
import { Tooltip } from "@mantine/core";
import { IntersectSquareIcon, PolygonIcon, SubtractSquareIcon, UniteSquareIcon } from "@phosphor-icons/react";
import ToggleButton from "components/ToggleButton";
import { Eraser, Goal, Move, Pencil, Scissors } from 'lucide-react';
import type React from "react";
import { useDispatch } from "react-redux";
import { gjEditorActions, useGjEditorState, type GjEditorTool, type LElementType } from "state/geojsonDocSlice";
import styles from './EditRibbon.module.scss';

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

  return (
    <div className={styles.ribbon}>
      {type === 'Polygon' && <_Polygon />}
    </div>
  );
}

interface _PolygonProps {
  
}

function _Polygon (props: _PolygonProps) {
  return (
    <div className={styles.toolset}>
      <div className={styles.title}>Polygon</div>
      
      <_Toggle label="Draw vertices" tool='draw_vertices'>
        <Pencil />
      </_Toggle>

      <_Toggle label="Move vertices" tool='move_vertices'>
        <PolygonIcon width={24} height={24} weight='thin' />
      </_Toggle>

      <_Toggle label="Cut shape" tool='cut'>
        <Scissors />
      </_Toggle>

      <_Toggle label="Delete vertices" tool='delete_vertices'>
        <Eraser />
      </_Toggle>

      <_Toggle label="Add other polygon" tool='union'>
        <UniteSquareIcon width={24} height={24} weight='thin' />
      </_Toggle>

      <_Toggle label="Subtract other polygon" tool='difference'>
        <SubtractSquareIcon width={24} height={24} weight='thin' />
      </_Toggle>

      <_Toggle label="Keep intersection with other polygon" tool='intersect'>
        <IntersectSquareIcon width={24} height={24} weight='thin' />
      </_Toggle>

      <_Toggle label="Set first vertex" tool='set_origin'>
        <Goal />
      </_Toggle>

      <_Toggle label="Move polygon" tool='move_shape'>
        <Move />
      </_Toggle>
    </div>
  );
}

interface _ToggleProps {
  label: string;
  tool: GjEditorTool;
  children: React.ReactElement;
}

function _Toggle ({
  label,
  tool,
  children,
}: _ToggleProps) {
  const ctx = useGjEditorState();
  const dispatch = useDispatch();

  return (
    <Tooltip.Floating label={label} position='bottom' offset={30}>
      <ToggleButton
        active={ctx.tool === tool}
        onChange={v => setTool(tool, v)}
      >
        {children}
      </ToggleButton>
    </Tooltip.Floating>
  );

  function setTool (tool: GjEditorTool, value: boolean) {
    dispatch(gjEditorActions.setTool(value ? tool : null));
  }
}



export default EditRibbon;
