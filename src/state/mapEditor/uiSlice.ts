import { createSlice, type PayloadAction, type WritableDraft } from "@reduxjs/toolkit";

interface MapEditorUiState {
  /**
   * The editing tool currently in use, or `null` if no tool is selected.
   */
  tool: MapEditorTool | null;
  isSettingsPanelExpanded: boolean;
  toolSettings: {
    snap: boolean;
    snapDistance: number;
    pencilStep: number;
    vertexSize: number;
    deleteVertexSize: number;
  };
}

const initialState: MapEditorUiState = {
  tool: null,
  isSettingsPanelExpanded: false,
  toolSettings: {
    snap: false,
    snapDistance: 20,
    pencilStep: 10,
    vertexSize: 12,
    deleteVertexSize: 20,
  },
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

    setToolSettings<K extends keyof MapEditorUiState['toolSettings']> (
      state: WritableDraft<MapEditorUiState>, action: PayloadAction<{
        key: K,
        value: MapEditorUiState['toolSettings'][K],
      }>
    ) {
      const { key, value } = action.payload;

      state.toolSettings[key] = value;
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
