import type { MapperGroup } from "models/MapDocument";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { getAllElements, getElement, idExists, isElementHidden } from "./docSlice";

export default function useMapperDoc () {
  const doc = useSelector((state: RootState) => state.mapEditorDoc);

  return {
    ...doc,

    getAllElements: (group?: MapperGroup) =>
      getAllElements(group ?? doc.content),

    getElement: (elementId: string) =>
      getElement(doc.content, elementId, true),

    idExists: (elementId: string, recursive: boolean) =>
      idExists(doc.content, elementId, recursive),

    isElementHidden: (elementId: string) =>
      isElementHidden(doc.content, elementId),
  };
}
