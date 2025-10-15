import type { Position } from "geojson";
import type { MapperElement } from "models/MapDocument";
import { createContext, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { MapperDocActions } from "state/mapper/docSlice";
import useMapperDoc from "state/mapper/useDoc";

export type DeleteMode = 'individual' | 'section';
export type DeletePath = {
  start: Position | null;
  end: Position | null;
};

interface InternalState {
  id: string | null;
  vertices: Position[];
  deleteMode: DeleteMode;
  deletePath: DeletePath;
}

interface ActiveElementValue extends InternalState {
  getElement: () => MapperElement | null;
  setElement: (elementId: string | null, commitChanges: boolean) => void;
  setVertices: (value: (prev: Position[]) => Position[]) => void;
  setDeleteMode: (mode: DeleteMode) => void;
  setDeletePath: (value: (prev: DeletePath) => DeletePath) => void;
  commitChanges: () => void;
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

  function setActiveElement (elementId: string | null, commit: boolean) {
    if (commit) {
      commitChanges();
    }

    let el = null;
    if (elementId !== null) {
      el = doc.getElement(elementId);
    }

    if (el === null) {
      setState(prev => ({
        ...prev,
        id: null,
        vertices: []
      }));

      return;
    }

    let vertices: Position[] = [];
    if (el.type === 'Polygon') {
      vertices = [...el.vertices];
    }

    setState(prev => ({
      ...prev,
      id: elementId,
      vertices,
    }));
  }

  function setVertices (vertices: (prev: Position[]) => Position[]) {
    setState(prev => ({
      ...prev,
      vertices: vertices(prev.vertices),
    }));
  }

  function setDeleteMode (mode: DeleteMode) {
    setState(prev => ({
      ...prev,
      deleteMode: mode,
    }));
  }

  function setDeletePath (value: (prev: DeletePath) => DeletePath) {
    setState(prev => ({
      ...prev,
      deletePath: value(prev.deletePath),
    }))
  }

  function commitChanges () {
    if (state.id === null) return;
    
    const el = doc.getElement(state.id);
    if (el === null) return;

    if (el.type === 'Polygon') {
      dispatch(MapperDocActions.updatePolygonVertices({
        elementId: el.id,
        vertices: state.vertices,
      }));
    }
  }

  return (
    <ActiveElementContext.Provider value={{
      ...state,
      getElement,
      setElement: setActiveElement,
      setVertices,
      setDeleteMode,
      setDeletePath,
      commitChanges,
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
    vertices: [],
    deleteMode: 'individual',
    deletePath: {
      start: null,
      end: null,
    },
  };
}
