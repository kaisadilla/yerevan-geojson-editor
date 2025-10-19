import * as turf from "@turf/turf";
import type { Position } from "geojson";
import GLT from "GLT";
import Logger from "Logger";
import type { MapperElement, MapperPolygon } from "models/MapDocument";
import { createContext, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { MapperDocActions } from "state/mapper/docSlice";
import { MapperUiActions } from "state/mapper/uiSlice";
import useMapperDoc from "state/mapper/useDoc";
import { getStateSetterValue, type StateSetter } from "types";

export type DeleteMode = 'individual' | 'section';
export type DeletePath = {
  start: number | null;
  end: number | null;
};

interface InternalState {
  id: string | null;
  stroke: Position[];
  deleteMode: DeleteMode;
  deletePath: DeletePath;
  reverseDeletePath: boolean;
}

interface ActiveElementValue extends InternalState {
  getElement: () => MapperElement | null;
  getPolygon: () => MapperPolygon | null;
  setElement: (elementId: string | null, commitChanges: boolean) => void;
  setVertices: (verts: StateSetter<Position[]>) => void;
  setStroke: (verts: StateSetter<Position[]>) => void;
  commitStroke: () => void;
  setDeleteMode: (mode: DeleteMode) => void;
  setDeletePath: (value: StateSetter<DeletePath>) => void;
  setDeletePathReverse: (value: boolean) => void;
  /**
   * Returns an array with all the indices currently included in the delete path.
   */
  getDeletePath: () => number[] | null;
  union: (targetId: string, deleteTarget: boolean) => void;
}

const ActiveElementContext = createContext(undefined as ActiveElementValue | undefined);

export const ActiveElementProvider = ({ children }: any) => {
  const [state, setState] = useState<InternalState>(initState);

  const doc = useMapperDoc();
  const dispatch = useDispatch();

  function getElement () {
    if (state.id === null) return null;

    return doc.getElement(state.id);
  }

  function getPolygon () : MapperPolygon | null {
    const el = getElement();

    if (el?.type === 'Polygon') return el;
    return null;
  }

  function setElement (elementId: string | null, commit: boolean) {
    if (commit) {
      commitStroke();
    }

    dispatch(MapperUiActions.setTool(null));

    setState(prev => ({
      ...prev,
      id: elementId,
      stroke: [],
    }));
  }

  function setVertices (verts: StateSetter<Position[]>) {
    if (state.id === null) return;

    const el = doc.getElement(state.id);
    if (!el) return;

    if (el.type !== 'Polygon') return;

    const vertices = getStateSetterValue(verts, el.vertices);

    dispatch(MapperDocActions.updatePolygonVertices({
      elementId: el.id,
      vertices,
    }));
  }

  function setStroke (verts: StateSetter<Position[]>) {
    setState(prev => ({
      ...prev,
      stroke: getStateSetterValue(verts, prev.stroke),
    }));
  }

  function commitStroke () {
    if (state.id === null) return;
    
    const el = doc.getElement(state.id);
    if (el === null) return;

    if (el.type === 'Polygon') {
      dispatch(MapperDocActions.updatePolygonVertices({
        elementId: el.id,
        vertices: [...el.vertices, ...state.stroke],
      }));
    }

    setState(prev => ({ ...prev, stroke: [] }));
  }

  function setDeleteMode (mode: DeleteMode) {
    setState(prev => ({
      ...prev,
      deleteMode: mode,
      deletePath: { start: null, end: null },
    }));
  }

  function setDeletePath (value: StateSetter<DeletePath>) {
    setState(prev => ({
      ...prev,
      deletePath: getStateSetterValue(value, prev.deletePath),
    }))
  }

  function setDeletePathReverse (value: boolean) {
    setState(prev => ({
      ...prev,
      reverseDeletePath: value,
    }));
  }

  function getDeletePath () : number[] | null {
    const polygon = getPolygon();
    if (!polygon) return null;

    if (state.deletePath.start === null) return null;
    if (state.deletePath.end === null) return [state.deletePath.start];

    if (polygon.vertices.length === 0) return [];
    
    const indices: number[] = [];

    let i = state.deletePath.start;

    if (state.reverseDeletePath === false) {
      while (true) {
        indices.push(i);
        if (i === state.deletePath.end) break;

        i++;
        if (i >= polygon.vertices.length) i = 0;
      }
    }
    else {
      while (true) {
        indices.push(i);
        if (i === state.deletePath.end) break;

        i--;
        if (i < 0) i = polygon.vertices.length - 1;
      }
    }

    return indices;
  }

  function union (targetId: string, deleteTarget: boolean) {
    const el = getPolygon();
    if (!el) return;

    const target = doc.getElement(targetId);
    if (target?.type !== 'Polygon') return;

    const poly1 = GLT.mapper.polygon.turf(el);
    const poly2 = GLT.mapper.polygon.turf(target);

    const fusion = turf.union(turf.featureCollection([poly1, poly2]));

    if (fusion?.geometry.type === 'Polygon') {
      dispatch(MapperDocActions.updatePolygonVertices({
        elementId: el.id,
        vertices: fusion.geometry.coordinates[0],
      }));
    }
    else if (fusion?.geometry.type === 'MultiPolygon') {
      Logger.error("Not yet implemented.");
    }
    
    if (deleteTarget === false) return;

    dispatch(MapperDocActions.deleteElement(target.id));
  }

  return (
    <ActiveElementContext.Provider value={{
      ...state,
      getElement,
      getPolygon,
      setElement,
      setVertices,
      setStroke,
      commitStroke,
      setDeleteMode,
      setDeletePath,
      setDeletePathReverse,
      getDeletePath,
      union,
    }}>
      {children}
    </ActiveElementContext.Provider>
  );
}

export function useActiveElement () : ActiveElementValue {
  const ctx = useContext(ActiveElementContext);

  if (!ctx) {
    throw new Error("<ActiveElementProvider> not found.")
  }

  return ctx;
}

function initState () : InternalState {
  return {
    id: null,
    stroke: [],
    deleteMode: 'individual',
    deletePath: {
      start: null,
      end: null,
    },
    reverseDeletePath: false,
  };
}
