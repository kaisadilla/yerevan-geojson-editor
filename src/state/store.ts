import { configureStore } from "@reduxjs/toolkit";
import { gjEditorReducer } from "./geojsonDocSlice";

export const store = configureStore({
  reducer: {
    gjEditor: gjEditorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
