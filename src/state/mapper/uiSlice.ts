import { createSlice, type PayloadAction, type WritableDraft } from "@reduxjs/toolkit";

interface MapperUiState {
  /**
   * The editing tool currently in use, or `null` if no tool is selected.
   */
  tool: MapperTool | null;
  isSettingsPanelExpanded: boolean;
  toolSettings: {
    snap: boolean;
    snapDistance: number;
    pencilStep: number;
    vertexSize: number;
    deleteVertexSize: number;
  };
}

const initialState: MapperUiState = {
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

const mapperUiSlice = createSlice({
  name: "mapEditorUi",
  initialState,
  reducers: {
    setTool (state, action: PayloadAction<MapperTool | null>) {
      const tool = action.payload;

      state.tool = tool;
    },

    setSettingsPanelExpanded (state, action: PayloadAction<boolean>) {
      const value = action.payload;

      state.isSettingsPanelExpanded = value;
    },

    setToolSettings<K extends keyof MapperUiState['toolSettings']> (
      state: WritableDraft<MapperUiState>, action: PayloadAction<{
        key: K,
        value: MapperUiState['toolSettings'][K],
      }>
    ) {
      const { key, value } = action.payload;

      state.toolSettings[key] = value;
    },
  },
});

export const mapperUiReducer = mapperUiSlice.reducer;
export const MapperUiActions = mapperUiSlice.actions;

export type MapperDocumentTool = 'new-point'
  | 'new-line'
  | 'new-polygon'
  | 'new-square'
  | 'new_circle'
  ;

export type MapperPolygonTool = 'draw_vertices'
  | 'move_vertices'
  | 'cut'
  | 'delete_vertices'
  | 'union'
  | 'difference'
  | 'intersect'
  | 'set_origin'
  | 'move_shape'
  ;

export type MapperTool = MapperDocumentTool | MapperPolygonTool;
