import { configureStore } from "@reduxjs/toolkit";
import { mapEditorDocReducer } from "./mapEditor/docSlice";
import { mapEditorSettingsReducer } from "./mapEditor/settingsSlice";
import { mapEditorUiReducer } from "./mapEditor/uiSlice";

export const store = configureStore({
  reducer: {
    mapEditorDoc: mapEditorDocReducer,
    mapEditorUi: mapEditorUiReducer,
    mapEditorSettings: mapEditorSettingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
