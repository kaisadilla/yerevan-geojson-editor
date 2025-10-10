import { useSelector } from "react-redux";
import type { RootState } from "../store";

export default function useMapEditorUi () {
  const ui = useSelector((state: RootState) => state.mapEditorUi);

  return {
    ...ui,
  };
}
