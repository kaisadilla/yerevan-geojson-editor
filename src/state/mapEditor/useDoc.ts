import type { MapperDocument, MapperGroup } from "models/MapDocument";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { getAllElements, getElement, idExists } from "./docSlice";

export default function useMapEditorDoc () {
  const doc = useSelector((state: RootState) => state.mapEditorDoc);

  return {
    ...doc,

    getAllElements: (group?: MapperGroup) =>
      getAllElements(group ?? doc.content),

    getSelectedElement: () => getSelectedElement(doc.content, doc.selectedId),

    idExists: (elementId: string, recursive: boolean) =>
      idExists(doc.content, elementId, recursive),
  }
}

function getSelectedElement (document: MapperDocument, selectedId: string | null) {
  if (selectedId === null) return null;

  return getElement(document, selectedId, true);
}
