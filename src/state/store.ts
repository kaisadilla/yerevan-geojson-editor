import { configureStore } from "@reduxjs/toolkit";
import { mapEditorDocReducer } from "./mapper/docSlice";
import { mapEditorSettingsReducer } from "./mapper/settingsSlice";
import { mapEditorUiReducer } from "./mapper/uiSlice";

export const store = configureStore({
  reducer: {
    mapEditorDoc: mapEditorDocReducer,
    mapEditorUi: mapEditorUiReducer,
    mapEditorSettings: mapEditorSettingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
