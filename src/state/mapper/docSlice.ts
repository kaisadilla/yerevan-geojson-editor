import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Position } from "geojson";
import Logger from "Logger";
import { ContainerType, isContainer, isPseudoContainer, isShape, type MapperDocument, type MapperElement, type MapperGroup, type MapperPolygon } from "models/MapDocument";
import { v4 as uuid } from 'uuid';

interface MapperDocState {
  content: MapperDocument;
}

function getSampleDocument () : MapperDocument {
  const doc: MapperDocument = {
    type: 'Group',
    id: 'root',
    name: 'Sample Document',
    properties: [],
    isHidden: false,
    elements: [],
  };

  doc.elements.push({
    type: 'Point',
    id: uuid(),
    name: 'Lonely dot',
    properties: [
      {
        id: "prop1",
        name: "interesting",
        value: "yes"
      }
    ],
    isHidden: false,
    position: [72.0, 0.5],
  });

  doc.elements.push({
    type: 'Point',
    id: uuid(),
    name: 'Gibraltar',
    properties: [
      {
        id: "prop1",
        name: "interesting",
        value: "yes"
      }
    ],
    isHidden: false,
    position: [-5.3459155, 36.1089314],
  });

  doc.elements.push({
    type: 'LineString',
    id: uuid(),
    name: 'Straight line',
    properties: [],
    isHidden: false,
    positions: [
      [75.0, 0.0],
      [95.0, 20.0],
    ],
  });

  const someGroup: MapperGroup = {
    type: 'Group',
    id: uuid(),
    name: "Some group",
    properties: [],
    isHidden: false,
    elements: [],
  };
  doc.elements.push(someGroup);

  someGroup.elements.push({
    type: 'Point',
    id: uuid(),
    name: "Dot inside a group",
    properties: [],
    isHidden: false,
    position: [-34.4, 61.3],
  });

  const innerGroup: MapperGroup = {
    type: 'Group',
    id: uuid(),
    name: "Inner group",
    properties: [],
    isHidden: false,
    elements: [],
  };
  someGroup.elements.push(innerGroup);

  innerGroup.elements.push({
    type: 'Point',
    id: uuid(),
    name: "Nested dot",
    properties: [],
    isHidden: false,
    position: [34.4, -61.3],
  });

  doc.elements.push({
    type: 'Polygon',
    id: uuid(),
    name: "Germany",
    properties: [],
    isHidden: false,
    vertices: [
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
    ],
    holes: [
      {
        type: 'Polygon',
        id: uuid(),
        name: "This is not visible",
        properties: [],
        isHidden: false,
        vertices: [
          [12.139892578125002, 50.958426723359935],
          [11.447753906250002, 51.15178610143037],
          [11.392822265625, 51.37178037591739],
          [10.656738281250002, 51.6521108615692],
          [10.601806640625002, 51.998410382390325],
          [11.008300781250002, 52.10650519075632],
          [10.920410156250002, 52.44261787120725],
          [10.78857421875, 52.8226825580693],
          [11.634521484375, 53.04781795911469],
          [12.205810546875002, 52.86249745970948],
          [12.304687500000002, 52.0862573323384],
          [13.128662109375002, 51.890053935216926],
          [13.139648437500002, 51.66574141105715],
          [12.54638671875, 51.6180165487737],
          [12.260742187500002, 51.549751017014195],
          [12.205810546875002, 51.41291212935532],
          [12.293701171875002, 51.089722918116315],
        ],
        holes: [],
      },
      {
        type: 'Polygon',
        id: uuid(),
        name: "",
        properties: [],
        isHidden: false,
        vertices: [
          [8.745117187500002, 50.21909462044748],
          [8.283691406250002, 49.809631563563094],
          [8.767089843750002, 49.52520834197442],
          [9.052734375000002, 49.28214015975995],
          [9.118652343750002, 49.095452162534826],
          [9.42626953125, 49.196064000723794],
          [9.514160156250002, 49.38237278700955],
          [9.667968750000002, 49.51094351526262],
          [9.865722656250002, 49.49667452747045],
          [9.843750000000002, 49.69606181911566],
          [9.602050781250002, 49.809631563563094],
          [9.162597656250002, 49.738681639280024],
        ],
        holes: [],
      },
    ],
  });

  doc.elements.push({
    type: 'Polygon',
    id: uuid(),
    name: "Poland",
    properties: [],
    isHidden: false,
    vertices: [
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
    ],
    holes: [],
  });

  doc.elements.push({
    type: 'Polygon',
    id: uuid(),
    name: "Sample feature",
    properties: [],
    isHidden: false,
    vertices: [
      [44.866462, 40.178873],
      [45.7456, 36.102376],
      [32.558527, 24.846565],
      [49.350067, 30.524413],
      [58.317277, 35.960223],
      [48.470928, 40.111689],
    ],
    holes: [],
  });

  return doc;
}

const initialState: MapperDocState = {
  content: getSampleDocument(),
}

const mapperDocSlice = createSlice({
  name: 'mapperDoc',
  initialState,
  reducers: {
    setDocument (state, action: PayloadAction<MapperDocument>) {
      const doc = action.payload;

      state.content = doc;
    },

    addElement (state, action: PayloadAction<{
      element: MapperElement,
      groupId?: string | null,
      index?: number | null,
    }>) {
      const { element } = action.payload;
      let { groupId, index } = action.payload;
      groupId ??= null;
      index ??= null;

      const existingEl = getElement(state.content, element.id, true);
      if (existingEl) {
        Logger.error(
          `An element with id '${element.id}' already exists, so it won't be ` +
          `added.`
        );
        return;
      }

      if (groupId === null || groupId === state.content.id) {
        insertElement(state.content, element, index);
      }
      else {
        const group = getElement(state.content, groupId, true);

        if (!group || ContainerType.has(group.type) === false) {
          Logger.error(
            `Element with id '${groupId}' either doesn't exist, or isn't a group.`
          )
        }
        else {
          insertElement(group, element, index);
        }
      }
    },

    deleteElement (state, action: PayloadAction<string>) {
      const targetParent = getElementParent(state.content, action.payload);
      if (!targetParent) return;

      removeElement(targetParent, action.payload);
    },

    changeElement (state, action: PayloadAction<{
      elementId: string,
      update: Partial<Omit<MapperElement, 'id'>>
    }>) {
      const { elementId, update } = action.payload;

      const el = getElement(state.content, elementId, true);
      if (!el) return;

      Object.assign(el, update);
    },

    moveElement (state, action: PayloadAction<{
      elementId: string,
      containerId: string,
      index: number | null,
    }>) {
      const { elementId, containerId } = action.payload;
      let { index } = action.payload;

      const element = getElement(state.content, elementId, true);
      const elParent = getElementParent(state.content, elementId);

      const container = getElement(state.content, containerId, true);
      const containerParent = getElementParent(state.content, containerId);

      if (element === null || elParent === null) {
        Logger.error(`Can't find element with id '${elementId}'.`,
          element, elParent
        );
        return;
      }
      if (container === null) {
        Logger.error(`Can't find element with id '${containerId}'.`,
          container
        );
        return;
      }

      // When the element is being moved to the same parent it's already in.
      if (index !== null && elParent.id === container.id) {
        const currentIndex = getElementIndex(elParent, element.id);

        // If its current index is lower than its targeted index, we have to
        // account for its removal.
        if (currentIndex !== null && currentIndex < index) {
          index--;
        }
      }

      if (container.type === 'Group' || container.type === 'Collection') {
        _remove();
        insertElement(container, element, index);
      }
      else if (isShape(container)) {
        if (containerParent && isShape(containerParent)) {
          Logger.warn("Holes cannot receive children.");
        }
        else if (isShape(element) === false) {
          Logger.warn("Shapes can only receive other shapes as children.");
        }
        else if (element.holes.length > 0) {
          Logger.warn("Shapes cannot receive shapes with holes as children.");
        }
        else {
          _remove();
          insertElement(container, element, index);
        }
      }
      else {
        Logger.warn(`Element of type '${element.type}' cannot receive children.`);
      }

      function _remove () {
        const removed = removeElement(elParent!, element!.id);
        if (!removed) Logger.error("Error while removing element.");
      }
    },

    setElementName (state, action: PayloadAction<{
      elementId: string,
      name: string,
    }>) {
      const { elementId, name } = action.payload;

      const el = getElement(state.content, elementId, true);
      if (!el) return;

      el.name = name;
    },

    setHidden (state, action: PayloadAction<{
      elementId: string,
      value: boolean,
    }>) {
      const { elementId, value } = action.payload;

      const el = getElement(state.content, elementId, true);
      if (!el) return;

      el.isHidden = value;
    },

    setPropertyName (state, action: PayloadAction<{
      elementId: string,
      propertyId: string,
      name: string,
    }>) {
      const { elementId, propertyId, name } = action.payload;

      const el = getElement(state.content, elementId, true);
      if (!el) return;

      for (const prop of el.properties) {
        if (prop.id === propertyId) {
          prop.name = name;
          return;
        }
      }
    },

    setPropertyValue (state, action: PayloadAction<{
      elementId: string;
      propertyId: string;
      value: string;
    }>) {
      const { elementId, propertyId, value } = action.payload;

      const el = getElement(state.content, elementId, true);
      if (!el) return;

      for (const prop of el.properties) {
        if (prop.id === propertyId) {
          prop.value = value;
          return;
        }
      }
    },

    addProperty (state, action: PayloadAction<{
      elementId: string;
      propertyId?: string;
      name: string;
      value: string;
    }>) {
      const { elementId, propertyId, name, value } = action.payload;

      const el = getElement(state.content, elementId, true);
      if (!el) return;

      el.properties.push({
        id: propertyId ?? uuid(),
        name,
        value,
      });
    },

    updatePointPosition (state, action: PayloadAction<{
      elementId: string;
      position: Position;
    }>) {
      const { elementId, position } = action.payload;

      const el = getElement(state.content, elementId, true);
      if (!el) return;

      if (el.type !== 'Point') return;

      el.position = position;
    },

    updatePolygon (state, action: PayloadAction<{
      elementId: string,
      update: Partial<Omit<MapperPolygon, 'id'>>
    }>) {
      const { elementId, update } = action.payload;

      const el = getElement(state.content, elementId, true);
      if (!el) return;

      if (el.type !== 'Polygon') return;

      Object.assign(el, update);
    },
    
    updatePolygonVertices (state, action: PayloadAction<{
      elementId: string,
      vertices: Position[],
    }>) {
      const { elementId, vertices } = action.payload;

      const el = getElement(state.content, elementId, true);
      if (!el) return;

      if (el.type !== 'Polygon') return;

      el.vertices = vertices;
    },
  },
});

export const mapperDocReducer = mapperDocSlice.reducer;
export const MapperDocActions = mapperDocSlice.actions;

// #region Helper functions
/**
 * Retrieves the element with the id given from the container given, if it
 * exists there.
 * @param container The container to search in.
 * @param elementId The element to look for.
 * @param recursive If true, subgroups will also be searched.
 */
export function getElement (
  container: MapperElement, elementId: string, recursive: boolean
) : MapperElement | null {
  if (container.id === elementId) return container;

  const children = getChildrenArray(container);
  if (!children) return null;

  for (const el of children) {
    if (el.id === elementId) return el;

    if (recursive && isContainer(el)) {
      const found = getElement(el, elementId, true);
      if (found !== null) return found;
    }
  }

  return null;
}

/**
 * Locates the group the element with the id given belongs to.
 * @param container 
 * @param elementId 
 * @returns 
 */
export function getElementParent (
  container: MapperElement, elementId: string
) : MapperElement | null {
  const children = getChildrenArray(container);
  if (!children) return null;

  for (const el of children) {
    if (el.id === elementId) return container;

    if (isContainer(el)) {
      const found = getElementParent(el, elementId);
      if (found !== null) return found;
    }
  }

  return null;
}

/**
 * Locates the position of the element with the id given in its group.
 * @param container 
 * @param elementId 
 * @returns 
 */
export function getElementIndex (
  container: MapperElement, elementId: string
) : number | null {
  const parent = getElementParent(container, elementId);
  if (!parent) return null;

  const children = getChildrenArray(parent);
  if (!children) return null;

  for (let i = 0; i < children.length; i++) {
    if (children[i].id === elementId) return i;
  }

  return null;
}

/**
 * Return whether the element with the id given is hidden, either by itself or
 * by being in a group that is hidden altogether.
 * @param container The group from which to start searching.
 * @param elementId The id of the element to check.
 * @param isParentHidden True if the group from which we are searching is hidden,
 * either by itself or by its parent.
 * @returns 
 */
export function isElementHidden (
  container: MapperElement, elementId: string, isParentHidden: boolean = false
) : boolean | null {
  const children = getChildrenArray(container);
  if (!children) return null;

  for (const el of children) {
    if (el.id === elementId) return isParentHidden || el.isHidden;

    if (isContainer(el)) {
      const found = isElementHidden(el, elementId, isParentHidden || el.isHidden);
      if (found !== null) return found;
    }
  }

  return null;
}

/**
 * Removes an element from the group given and returns it. Returns `null` if an
 * element is not found. This function is not recursive.
 * @param container The group where the element is.
 * @param elementId The id of the element to remove.
 */
export function removeElement (container: MapperElement, elementId: string) {
  const children = getChildrenArray(container);
  if (!children) return null;

  for (let i = 0; i < children.length; i++) {
    const el = children[i];

    if (el.id !== elementId) continue;

    children.splice(i, 1);
    return el;
  }

  return null;
}

/**
 * Adds an element to the group given, either as the first or the last element
 * of the group.
 * @param container The group to add the element to.
 * @param element The element to add.
 * @param index The index at which the element will be in the group.
 */
export function insertElement (
  container: MapperElement,
  element: MapperElement,
  index: number | null,
) {
  const children = getChildrenArray(container);
  if (!children) return;

  if (index === null) {
    children.push(element);
  }
  else {
    children.splice(index, 0, element);
  }
}

/**
 * Adds an element to the group given, before or after the element given. If the
 * reference element given is not found, the element to append will be added at
 * the end of the group.
 * @param container The group to add the element to.
 * @param element The element to add.
 * @param referenceId The id of the element to use as reference.
 * @param position Whether the element will be added before or after that one.
 */
export function insertElementBetween (
  container: MapperElement,
  element: MapperElement,
  referenceId: string,
  position: 'before' | 'after',
) {
  const children = getChildrenArray(container);
  if (!children) return;

  let index = children.findIndex(el => el.id === referenceId);

  if (index === -1) {
    children.push(element);
    return;
  }

  if (position === 'after') index++;
  
  children.splice(index, 0, element);
}

/**
 * Returns a flat array containing all elements in the given group, including
 * elements in all of its subgroups. This array also contains the subgroups
 * themselves as elements.
 * @param container The group from which to retrieve elements.
 * @param includePseudo Include elements that don't map to GeoJson elements
 * (that is, holes in shapes).
 */
export function getAllElements (
  container: MapperElement, includePseudo: boolean
) : MapperElement[] {  
  let children = getChildrenArray(container);
  if (!children) return [];

  const arr = [] as MapperElement[];

  for (const el of children) {
    arr.push(el);

    if (isContainer(el) && (includePseudo || isPseudoContainer(el) === false)) {
      arr.push(...getAllElements(el, includePseudo));
    }
  }
  
  return arr;
}

/**
 * Returns true if an element with the id given exists in the group given.
 * @param container The group in which the element may exist.
 * @param elementId The id of the element to look for.
 * @param recursive If true, subgroups will also be searched.
 * @returns 
 */
export function idExists (
  container: MapperElement, elementId: string, recursive: boolean
) : boolean {
  let children = getChildrenArray(container);
  if (!children) return false;

  for (const el of children) {
    if (el.id === elementId) return true;

    if (recursive && isContainer(el)) {
      if (idExists(el, elementId, true)) return true;
    }
  }

  return false;
}

/**
 * Given an element, returns the ORIGINAL ARRAY with its children. Modifying
 * this array will modify the children of the element.
 * If the element cannot have children (is not a container), this will return
 * `null`.
 * @param container The container element.
 * @returns 
 */
function getChildrenArray (container: MapperElement) : MapperElement[] | null {
  if (container.type === 'Group') return container.elements;
  if (container.type === 'Collection') return container.elements;
  if (container.type === 'Polygon') return container.holes;
  if (container.type === 'Rectangle') return container.holes;
  if (container.type === 'Circle') return container.holes;

  return null;
}

// #endregion Helper functions
