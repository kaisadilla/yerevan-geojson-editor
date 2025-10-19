import { createSlice, type PayloadAction, type WritableDraft } from "@reduxjs/toolkit";

const TOOLS_THAT_AUTO_EXPAND_SETTINGS = new Set<MapperTool>([
  'union',
  'difference',
  'intersect',
]);

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
    showVertices: boolean;
    deleteVertexSize: number;
    deleteFeaturesUsedByCombine: boolean;
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
    showVertices: true,
    deleteVertexSize: 20,
    deleteFeaturesUsedByCombine: false,
  },
}

const mapperUiSlice = createSlice({
  name: "mapEditorUi",
  initialState,
  reducers: {
    setTool (state, action: PayloadAction<MapperTool | null>) {
      const tool = action.payload;

      state.tool = tool;

      if (tool && TOOLS_THAT_AUTO_EXPAND_SETTINGS.has(tool)) {
        state.isSettingsPanelExpanded = true;
      }
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
