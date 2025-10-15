import { useSelector } from "react-redux";
import type { RootState } from "state/store";

export default function useMapperSettings () {
  const settings = useSelector((state: RootState) => state.mapEditorSettings);

  return {
    ...settings,
  };
}
