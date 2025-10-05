import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Feature, GeoJsonProperties, Geometry } from "geojson";

/**
 * Represents a set of properties in a GeoJson element that contains properties
 * specific to Leaflys.
 */
export type LGeoJsonProperties = GeoJsonProperties & {
  name: string;
  id: string;
};

/**
 * Represents a Feature that contains Leaflys properties.
 */
export type LFeature = Feature<Geometry, LGeoJsonProperties>;

/**
 * Represents a FeatureCollection that can also contain nested FeatureCollections.
 * This is not valid GeoJson.
 */
export type LGroup = {
  type: 'FeatureCollection';
  features: LElement[];
  properties: LGeoJsonProperties;
}

/**
 * Represents either a GeoJson feature or a Leaflys group.
 */
export type LElement = LFeature | LGroup;

interface GjEditorState {
  content: LGroup;
  selectedId: string | null;
}

const initialState: GjEditorState = {
  content: {
    type: 'FeatureCollection',
    properties: {
      name: "Root",
      id: "w1"
    },
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [102.0, 0.5]
        },
        properties: {
          name: "Lonely dot",
          id: "a"
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
          id: "b"
        }
      },
      {
        type: 'FeatureCollection',
        properties: {
          name: "Some group",
          id: "w2",
        },
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-34.4, 61.3]
            },
            properties: {
              name: "Dot inside a group",
              id: "c"
            }
          },
          {
            type: 'FeatureCollection',
            properties: {
              name: "Inner group",
              id: "w3",
            },
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [34.4, -61.3]
                },
                properties: {
                  name: "Nested dot",
                  id: "d"
                }
              }
            ]
          },
        ]
      },
    ],
  },
  selectedId: null,
}

const gjEditorSlice = createSlice({
  name: 'geoJsonDoc',
  initialState,
  reducers: {
    addFeature (state, action: PayloadAction<LFeature>) {
      state.content.features.push(action.payload);
    },

    moveFeature (state, action: PayloadAction<{
      elementId: string,
      targetId: string,
      position: 'above' | 'in' | 'below'
    }>) {
      const { elementId, targetId, position } = action.payload;

      console.log(`Moving ${elementId} to ${targetId}`);
    },
    
    setSelected (state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    }
  },
});

export const gjEditorReducer = gjEditorSlice.reducer;
export const gjEditorActions = gjEditorSlice.actions;
