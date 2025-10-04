import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

export type LGeoJsonProperties = GeoJsonProperties & {
  group?: string;
};
export type GeoJsonDocFeature = Feature<Geometry, LGeoJsonProperties>;

interface GeoJsonDocState {
  content: FeatureCollection<Geometry, LGeoJsonProperties>;
}

const initialState: GeoJsonDocState = {
  content: {
    type: 'FeatureCollection',
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [102.0, 0.5]
        },
        properties: {
          name: "Lonely dot",
          group: ""
        }
      },
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [75.0, 0.0],
            [95.0, 20.0],
          ],
        },
        properties: {
          name: "Straight line",
          group: ""
        }
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-34.4, 61.3]
        },
        properties: {
          name: "Dot inside a group",
          group: "Some group"
        }
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [34.4, -61.3]
        },
        properties: {
          name: "Nested dot",
          group: "Some group\\Inner group"
        }
      }
    ],
  },
}

const geoJsonDocSlice = createSlice({
  name: 'geoJsonDoc',
  initialState,
  reducers: {
    addFeature (state, action: PayloadAction<GeoJsonDocFeature>) {
      state.content.features.push(action.payload);
    },
  },
});

export const geoJsonDocReducer = geoJsonDocSlice.reducer;
export const geoJsonDocActions = geoJsonDocSlice.actions;
