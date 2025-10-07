import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LngLat } from "models/MapDocument";

interface MapEditorMapState {
  hoveredCoords: LngLat | null; 
}

const initialState: MapEditorMapState = {
  hoveredCoords: null,
}

const mapEditorMapSlice = createSlice({
  name: "mapEditorUi",
  initialState,
  reducers: {
    setHoveredCoords (state, action: PayloadAction<LngLat | null>) {
      const coords = action.payload;

      state.hoveredCoords = coords;
    }
  },
});

export const mapEditorMapReducer = mapEditorMapSlice.reducer;
export const mapEditorMapActions = mapEditorMapSlice.actions;
