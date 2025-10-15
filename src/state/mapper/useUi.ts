import { useSelector } from "react-redux";
import type { RootState } from "../store";

export default function useMapperUi () {
  const ui = useSelector((state: RootState) => state.mapEditorUi);

  return {
    ...ui,
  };
}
