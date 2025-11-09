import { useActiveElement } from "context/useActiveElement";
import type { LeafletMouseEvent } from "leaflet";
import { isShape, type MapperElement } from "models/MapDocument";
import { useEffect, useState } from "react";
import Mapper, { type MapperActiveElementChangeEvent, type MapperAddElementEvent, type MapperDeleteElementEvent, type MapperHideEvent, type MapperUpdateElementEvent } from "state/mapper/events";
import useMapperDoc from "state/mapper/useDoc";
import useMapperUi from "state/mapper/useUi";
import usePolygonLayer from "./usePolygonLayer";

export interface PolygonLayerProps {
  group: MapperElement;
}

function PolygonLayer ({
  group,
}: PolygonLayerProps) {
  const [isHidden, setHidden] = useState(group.isHidden);

  const doc = useMapperDoc();
  const ui = useMapperUi();
  const active = useActiveElement();

  const layer = usePolygonLayer(
    group,
    handlePolygonClick,
  );

  // Listeners for Mapper events.
  useEffect(() => {
    Mapper.on('activeElementChange', handleActiveElementChange);
    Mapper.on('addElement', handleAddElement);
    Mapper.on('deleteElement', handleDeleteElement);
    Mapper.on('updateElement', handleUpdateElement);
    Mapper.on('hide', handleHideElement);

    return () => {
      Mapper.off('activeElementChange', handleActiveElementChange);
      Mapper.off('addElement', handleAddElement);
      Mapper.off('deleteElement', handleDeleteElement);
      Mapper.off('updateElement', handleUpdateElement);
      Mapper.off('hide', handleHideElement);
    }
  }, [
    doc,
    handleActiveElementChange,
    handleAddElement,
    handleUpdateElement,
    handleUpdateElement,
    handleHideElement,
  ]);

  // When this group is shown or hidden, add or remove leaflet polygons to the
  // map.
  useEffect(() => {
    if (isHidden) {
      layer.hideAll();
    }
    else {
      layer.showAll();
    }
  }, [isHidden]);

  useEffect(() => {
    let activeParent: string | null = null;

    if (active.id !== null) {
      const parent = doc.getParent(active.id);
      if (parent && isShape(parent)) {
        activeParent = parent.id;
      }
    }

    layer.setActive(activeParent);
  }, [active.id]);

  return isHidden
    ? null
    : layer.innerGroups.map(g => <PolygonLayer key={g.id} group={g} />);
  
  function handlePolygonClick (evt: LeafletMouseEvent, id: string) {
    if (evt.originalEvent.ctrlKey) {
      if (ui.tool === 'union') {
        active.union(id, ui.toolSettings.deleteFeaturesUsedByCombine);
      }
      else if (ui.tool === 'difference') {
        active.difference(
          id, ui.toolSettings.deleteFeaturesUsedByDifference
        );
      }
      else if (ui.tool === 'intersection') {
        active.intersection(
          id, ui.toolSettings.deleteFeaturesUsedByCombine
        )
      }
    }
    else {
      active.setElement(id);
    }
  }

  function handleActiveElementChange (evt: MapperActiveElementChangeEvent) {
    if (evt.oldElementId) layer.showPolygon(evt.oldElementId);
    if (evt.newElementId) layer.hidePolygon(evt.newElementId);
  }

  function handleAddElement (evt: MapperAddElementEvent) {
    if (isShape(evt.element) === false) return;
    if (evt.groupId !== group.id) return;

    layer.addPolygon(evt.element);
  }

  function handleDeleteElement (evt: MapperDeleteElementEvent) {
    layer.deletePolygon(evt.elementId);
  }

  function handleUpdateElement (evt: MapperUpdateElementEvent) {
    if (isShape(evt.update) === false) return;

    const parent = doc.latest().getParent(evt.elementId);

    if (parent && isShape(parent)) {
      layer.updatePolygon(parent);
    }
    else {
      layer.updatePolygon(evt.update);
    }
  }

  function handleHideElement (evt: MapperHideEvent) {
    if (evt.elementId === group.id) {
      setHidden(evt.hidden);
    }
    else {
      if (evt.hidden) {
        layer.hidePolygon(evt.elementId);
      }
      else {
        layer.showPolygon(evt.elementId);
      }
    }
  }
}

export default PolygonLayer;
