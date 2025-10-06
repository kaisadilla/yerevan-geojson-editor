import { createSlice, type PayloadAction, type WritableDraft } from "@reduxjs/toolkit";
import type { Feature, GeoJsonObject, GeoJsonProperties, Geometry, Point, Polygon } from "geojson";
import Logger from "Logger";
import { useSelector } from "react-redux";
import type { RootState } from "./store";

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
export type LPoint = Feature<Point, LGeoJsonProperties>;
export type LPolygon = Feature<Polygon, LGeoJsonProperties>;

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

export type LElementType = GeoJsonObject["type"] | "FeatureCollection";

export type GjEditorDocumentTool = 'new-point'
  | 'new-line'
  | 'new-polygon'
  | 'new-square'
  | 'new_circle'
  ;

export type GjEditorPolygonTool = 'draw_vertices'
  | 'move_vertices'
  | 'cut'
  | 'delete_vertices'
  | 'union'
  | 'difference'
  | 'intersect'
  | 'set_origin'
  | 'move_shape'
  ;

export type GjEditorTool = GjEditorDocumentTool | GjEditorPolygonTool;

interface GjEditorState {
  content: LGroup;
  selectedId: string | null;
  /**
   * The editing tool currently in use, or `null` if no tool is selected.
   */
  tool: GjEditorTool | null;
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
          coordinates: [72.0, 0.5]
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
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [10.920410156250002, 47.47266286861342],
              [7.558593750000001, 47.57652571374621],
              [8.173828125000002, 48.96579381461063],
              [6.65771484375, 49.15296965617042],
              [5.976562500000001, 51.055207338584964],
              [6.174316406250001, 51.781435604431195],
              [7.075195312500001, 52.37559917665913],
              [6.789550781250001, 52.549636074382306],
              [7.053222656250001, 52.61639023304539],
              [7.053222656250001, 53.474969999548556],
              [7.426757812500001, 53.68369534495075],
              [8.305664062500002, 53.501117042943186],
              [8.789062500000002, 53.93021986394],
              [8.591308593750002, 54.901882187385006],
              [9.843750000000002, 54.78801734817893],
              [10.195312500000002, 54.41892996865827],
              [11.162109375, 54.380557368630654],
              [10.700683593750002, 53.969012350740314],
              [13.491210937500002, 54.61025498157912],
              [14.150390625000002, 53.93021986394],
              [14.040527343750002, 53.72271667491848],
              [14.370117187500002, 53.553362785528094],
              [14.23828125, 52.8823912222619],
              [14.633789062500002, 52.44261787120725],
              [14.985351562500002, 51.28940590271679],
              [14.897460937500002, 50.90303283111257],
              [14.370117187500002, 51.02757633780243],
              [14.370117187500002, 50.94458443495011],
              [12.23876953125, 50.24720490139267],
              [12.041015625000002, 50.30337575356313],
              [12.7001953125, 49.439556958940855],
              [13.820800781250002, 48.719961222646276],
              [12.810058593750002, 48.16608541901253],
              [13.051757812500002, 47.82790816919329],
              [12.985839843750002, 47.517200697839414],
              [12.0849609375, 47.724544549099676],
              [10.920410156250002, 47.47266286861342]
            ]
          ]
        },
        properties: {
          name: "Germany",
          id: "ger-many",
          hidden: false,
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [14.150390625000002, 53.93021986394],
              [15.270996093750002, 54.12382170046237],
              [16.347656250000004, 54.30370443989811],
              [16.479492187500004, 54.49556752187409],
              [17.666015625000004, 54.78801734817893],
              [18.479003906250004, 54.813348417419284],
              [18.588867187500004, 54.457266680933856],
              [18.918457031250004, 54.34214886448344],
              [19.379882812500004, 54.29088164657006],
              [19.885253906250004, 54.41892996865827],
              [21.401367187500004, 54.3549556895541],
              [22.741699218750004, 54.36775852406841],
              [23.291015625000004, 54.265224078605684],
              [23.994140625000004, 53.09402405506328],
              [23.950195312500004, 52.77618568896171],
              [23.159179687500004, 52.29504228453735],
              [23.642578125000004, 52.10650519075632],
              [23.620605468750004, 51.90361280788357],
              [23.510742187500004, 51.631657349449995],
              [24.125976562500004, 50.86144411058926],
              [23.928222656250004, 50.88917404890332],
              [24.169921875, 50.583236614805905],
              [23.906250000000004, 50.45750402042058],
              [23.620605468750004, 50.331436330838834],
              [22.65380859375, 49.56797785892715],
              [22.895507812500004, 49.05227025601607],
              [21.950683593750004, 49.25346477497736],
              [21.73095703125, 49.41097319969587],
              [20.917968750000004, 49.396675075193976],
              [19.92919921875, 49.23912083246701],
              [19.445800781250004, 49.596470070892686],
              [19.094238281250004, 49.52520834197442],
              [17.006835937500004, 50.42951794712289],
              [16.655273437500004, 50.02185841773447],
              [16.193847656250004, 50.47149085139956],
              [16.413574218750004, 50.597186230587035],
              [14.897460937500002, 50.90303283111257],
              [14.985351562500002, 51.28940590271679],
              [14.633789062500002, 52.44261787120725],
              [14.23828125, 52.8823912222619],
              [14.370117187500002, 53.553362785528094],
              [14.040527343750002, 53.72271667491848],
              [14.150390625000002, 53.93021986394]
            ]
          ]
        },
        properties: {
          name: "Poland",
          id: "poulan",
          hidden: false,
        },
      },
    ],
  },
  selectedId: null,
  tool: null,
}

const gjEditorSlice = createSlice({
  name: 'geoJsonDoc',
  initialState,
  reducers: {
    addFeature (state, action: PayloadAction<LFeature>) {
      state.content.features.push(action.payload);
    },

    setProperty (state, action: PayloadAction<{
      elementId: string,
      key: string,
      value: any,
    }>) {
      const { elementId, key, value } = action.payload;

      const el = getElement(state.content, elementId, true);
      if (!el) return;

      el.properties[key] = value;
    },

    moveElement (state, action: PayloadAction<{
      elementId: string,
      targetId: string,
      position: 'before' | 'inside' | 'after',
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
        const targetEl = getElement(targetGroup, targetId, false);

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
    },

    setTool (state, action: PayloadAction<GjEditorTool | null>) {
      const tool = action.payload;

      state.tool = tool;
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

/**
 * Gets the element with the id given in the group given; or `null` if no
 * element was found.
 * @param group The group where the element is.
 * @param elementId The id of the element to find.
 * @param recursive If true, the search will be recursive.
 */
function getElement (
  group: WritableDraft<LGroup>, elementId: string, recursive: boolean
) : LElement | null {
  for (const f of group.features) {
    if (f.properties.id === elementId) return f;

    if (recursive && f.type === 'FeatureCollection') {
      const found = getElement(f, elementId, true);
      if (found !== null) return found;
    }
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

export function useGjEditorState () {
  const ctx = useSelector((state: RootState) => state.gjEditor);

  return {
    ...ctx,
    getAllElements: (group: LGroup | null = null) => 
      getAllElements(group ?? ctx.content),
    getSelectedElement: () => getSelectedElement(ctx),
  }
}

function getAllElements (group: LGroup) : LElement[] {  
  const arr = [] as LElement[];

  for (const f of group.features) {
    arr.push(f);

    if (f.type === 'FeatureCollection') {
      arr.push(...getAllElements(f));
    }
  }
  
  return arr;
}

function getSelectedElement (ctx: GjEditorState) {
  if (ctx.selectedId === null) return null;

  return getElement(ctx.content, ctx.selectedId, true);
}
