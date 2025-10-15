import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface MapperSettingsSlice {
  colors: {
    active: string;
  };
  lineWidth: number;
};

const initialState: MapperSettingsSlice = {
  colors: {
    active: "#ff9500"
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
