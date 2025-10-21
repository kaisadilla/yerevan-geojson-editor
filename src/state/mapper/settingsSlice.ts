import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface MapperSettingsSlice {
  colors: {
    default: string;
    active: string;
    activeParent: string;
    activePseudo: string;
    activeSibling: string;
    delete: string;
  };
  lineWidth: number;
};

const initialState: MapperSettingsSlice = {
  colors: {
    default: "var(--color-primary-d1)",
    active: "#ff9500",
    activeParent: "#a78270",
    activePseudo: "#ff9500",
    activeSibling: "#000000",
    delete: "#ff0000",
  },
  lineWidth: 2,
};

const mapperSettingsSlice = createSlice({
  name: "mapEditorSettings",
  initialState,
  reducers: {
    setActiveColor (state, action: PayloadAction<string>) {
      const color = action.payload;

      state.colors.active = color;
    },
  },
});

export const mapperSettingsReducer = mapperSettingsSlice.reducer;
export const MapperSettingsActions = mapperSettingsSlice.actions;
