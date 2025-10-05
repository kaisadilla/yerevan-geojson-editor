import { createSlice, type PayloadAction, type WritableDraft } from "@reduxjs/toolkit";
import type { Feature, GeoJsonProperties, Geometry } from "geojson";
import Logger from "Logger";

/**
 * Represents a set of properties in a GeoJson element that contains properties
 * specific to Leaflys.
 */
export type LGeoJsonProperties = GeoJsonProperties & {
  name: string;
  id: string;
  hidden: boolean;
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
      id: "w1",
      hidden: false,
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
          id: "a",
          hidden: false,
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
          id: "b",
          hidden: false,
        }
      },
      {
        type: 'FeatureCollection',
        properties: {
          name: "Some group",
          id: "w2",
          hidden: false,
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
              id: "c",
              hidden: false,
            }
          },
          {
            type: 'FeatureCollection',
            properties: {
              name: "Inner group",
              id: "w3",
              hidden: false,
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
                  id: "d",
                  hidden: false,
                }
              }
            ]
          },
        ]
      },
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [55.0, 0.0],
            [25.0, 20.0],
          ],
        },
        properties: {
          name: "Straight line",
          id: "xx3",
          hidden: false,
        }
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

    moveElement (state, action: PayloadAction<{
      elementId: string,
      targetId: string,
      position: 'before' | 'inside' | 'after'
    }>) {
      const { elementId, targetId, position } = action.payload;

      const originGroup = locateFeatureGroup(state.content, elementId);
      const targetGroup = locateFeatureGroup(state.content, targetId);

      if (originGroup === null) {
        Logger.error(`Can't find element with id '${elementId}'.`);
        return;
      }
      if (targetGroup === null) {
        Logger.error(`Can't find element with id '${targetId}'.`);
        return;
      }

      const originEl = removeElement(originGroup, elementId);
      if (originEl === null) {
        Logger.error("Error while moving element.");
        return;
      }

      if (position === 'inside') {
        const targetEl = getElement(targetGroup, targetId);

        if (targetEl && targetEl.type === 'FeatureCollection') {
          targetEl.features.push(originEl);
        }
        else {
          Logger.warn("Target element cannot contain children.");
        }
      }
      else {
        insertElement(targetGroup, originEl, targetId, position);
      }
    },
    
    setSelected (state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    }
  },
});

export const gjEditorReducer = gjEditorSlice.reducer;
export const gjEditorActions = gjEditorSlice.actions;

function locateFeatureGroup (
  group: WritableDraft<LGroup>, elementId: string
) : LGroup | null {
  for (const f of group.features) {
    if (f.properties.id === elementId) return group;

    if (f.type === 'FeatureCollection') {
      const found = locateFeatureGroup(f, elementId);
      if (found !== null) return found;
    }
  }

  return null;
}

function getElement (group: WritableDraft<LGroup>, elementId: string) {
  for (const f of group.features) {
    if (f.properties.id === elementId) return f;
  }

  return null;
}

/**
 * Removes an element from the group given and returns it. Returns `null` if an
 * element is not found.
 * @param group The group where the element is.
 * @param elementId The id of the element to remove.
 */
function removeElement (
  group: WritableDraft<LGroup>, elementId: string
): LElement | null {
  for (let i = 0; i < group.features.length; i++) {
    const el = group.features[i];

    if (el.properties.id !== elementId) continue;

    group.features.splice(i, 1);
    return el;
  }

  return null;
}

/**
 * Adds an element to the group given, before or after the element given. If the
 * reference element given is not found, the element to append will be added at
 * the end of the group.
 * @param group The group to add the element to.
 * @param element The element to add.
 * @param referenceId The id of the element to use as reference.
 * @param position Whether the element will be added before or after that one.
 */
function insertElement (
  group: WritableDraft<LGroup>,
  element: LElement,
  referenceId: string,
  position: 'before' | 'after',
) {
  let index = group.features.findIndex(f => f.properties.id === referenceId);

  if (index === -1) {
    group.features.push(element);
    return;
  }

  if (position === 'after') index++;
  
  group.features.splice(index, 0, element);
}
