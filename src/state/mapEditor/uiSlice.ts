import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface MapEditorUiState {
  /**
   * The editing tool currently in use, or `null` if no tool is selected.
   */
  tool: MapEditorTool | null;
  isSettingsPanelExpanded: boolean;
}

const initialState: MapEditorUiState = {
  tool: null,
  isSettingsPanelExpanded: false,
}

const mapEditorUiSlice = createSlice({
  name: "mapEditorUi",
  initialState,
  reducers: {
    setTool (state, action: PayloadAction<MapEditorTool | null>) {
      const tool = action.payload;

      state.tool = tool;
    },
    setSettingsPanelExpanded (state, action: PayloadAction<boolean>) {
      const value = action.payload;

      state.isSettingsPanelExpanded = value;
    },
  },
});

export const mapEditorUiReducer = mapEditorUiSlice.reducer;
export const mapEditorUiActions = mapEditorUiSlice.actions;

export type MapEditorDocumentTool = 'new-point'
  | 'new-line'
  | 'new-polygon'
  | 'new-square'
  | 'new_circle'
  ;

export type MapEditorPolygonTool = 'draw_vertices'
  | 'move_vertices'
  | 'cut'
  | 'delete_vertices'
  | 'union'
  | 'difference'
  | 'intersect'
  | 'set_origin'
  | 'move_shape'
  ;

export type MapEditorTool = MapEditorDocumentTool | MapEditorPolygonTool;
