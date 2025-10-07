import { useSelector } from "react-redux";
import type { RootState } from "state/store";

export default function useMapEditorMap () {
  const map = useSelector((state: RootState) => state.mapEditorMap);

  return {
    ...map,
  };
}
