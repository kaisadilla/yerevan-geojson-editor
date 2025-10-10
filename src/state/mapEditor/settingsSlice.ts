import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface MapEditorSettingsSlice {
  colors: {
    active: string;
  };
};

const initialState: MapEditorSettingsSlice = {
  colors: {
    active: "#ff9500"
  },
};

const mapEditorSettingsSlice = createSlice({
  name: "mapEditorSettings",
  initialState,
  reducers: {
    setActiveColor (state, action: PayloadAction<string>) {
      const color = action.payload;

      state.colors.active = color;
    },
  },
});

export const mapEditorSettingsReducer = mapEditorSettingsSlice.reducer;
export const mapEditorSettingsActions = mapEditorSettingsSlice.actions;
