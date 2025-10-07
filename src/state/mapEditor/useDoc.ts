import type { WritableDraft } from "@reduxjs/toolkit";
import type { LElement, LGroup, LMemoryDocument } from "models/MapDocument";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export default function useMapEditorDoc () {
  const doc = useSelector((state: RootState) => state.mapEditorDoc);

  return {
    ...doc,
    getAllElements: (group: LGroup | null = null) => 
      getAllElements(group ?? doc.content),
    getSelectedElement: () => getSelectedElement(doc.content, doc.selectedId),
  }
}

function getAllElements (group: LGroup) : LElement[] {  
  const arr = [] as LElement[];

  for (const f of group.features) {
    arr.push(f);

    if (f.type === 'FeatureCollection') {
      arr.push(...getAllElements(f));
    }
  }
  
  return arr;
}

function getSelectedElement (document: LMemoryDocument, selectedId: string | null) {
  if (selectedId === null) return null;

  return getElement(document, selectedId, true);
}

// TODO: Remove
/**
 * Gets the element with the id given in the group given; or `null` if no
 * element was found.
 * @param group The group where the element is.
 * @param elementId The id of the element to find.
 * @param recursive If true, the search will be recursive.
 */
function getElement (
  group: WritableDraft<LGroup>, elementId: string, recursive: boolean
) : LElement | null {
  for (const f of group.features) {
    if (f.properties.id === elementId) return f;

    if (recursive && f.type === 'FeatureCollection') {
      const found = getElement(f, elementId, true);
      if (found !== null) return found;
    }
  }

  return null;
}
