import { configureStore } from "@reduxjs/toolkit";
import { mapperDocReducer } from "./mapper/docSlice";
import { mapperSettingsReducer } from "./mapper/settingsSlice";
import { mapperUiReducer } from "./mapper/uiSlice";

export const store = configureStore({
  reducer: {
    mapEditorDoc: mapperDocReducer,
    mapEditorUi: mapperUiReducer,
    mapEditorSettings: mapperSettingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
