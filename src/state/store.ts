import { configureStore } from "@reduxjs/toolkit";
import { geoJsonDocReducer } from "./geojsonDocSlice";

export const store = configureStore({
  reducer: {
    geojsonDoc: geoJsonDocReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
