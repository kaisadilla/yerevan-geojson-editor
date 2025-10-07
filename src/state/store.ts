import { configureStore } from "@reduxjs/toolkit";
import { mapEditorDocReducer } from "./mapEditor/docSlice";
import { mapEditorMapReducer } from "./mapEditor/mapSlice";
import { mapEditorUiReducer } from "./mapEditor/uiSlice";

export const store = configureStore({
  reducer: {
    mapEditorDoc: mapEditorDocReducer,
    mapEditorUi: mapEditorUiReducer,
    mapEditorMap: mapEditorMapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
