import { useActiveElement } from "context/useActiveElement";
import type { LeafletMouseEvent } from "leaflet";
import { isShape, type MapperGroup } from "models/MapDocument";
import { useEffect, useState } from "react";
import Mapper, { type MapperActiveElementChangeEvent, type MapperDeleteElementEvent, type MapperHideEvent, type MapperUpdateElementEvent } from "state/mapper/events";
import useMapperDoc from "state/mapper/useDoc";
import useMapperUi from "state/mapper/useUi";
import usePolygonLayer from "./usePolygonLayer";

export interface PolygonLayerProps {
  group: MapperGroup;
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
    Mapper.on('deleteElement', handleDeleteElement);
    Mapper.on('updateElement', handleUpdateElement);
    Mapper.on('hide', handleHideElement);

    return () => {
      Mapper.off('activeElementChange', handleActiveElementChange);
      Mapper.off('deleteElement', handleDeleteElement);
      Mapper.off('updateElement', handleUpdateElement);
      Mapper.off('hide', handleHideElement);
    }
  }, []);

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

  return isHidden
    ? <div>null {group.name}</div>
    : layer.groups.map(g => <PolygonLayer key={g.id} group={g} />);
  
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

  function handleDeleteElement (evt: MapperDeleteElementEvent) {
    layer.deletePolygon(evt.elementId);
  }

  function handleUpdateElement (evt: MapperUpdateElementEvent) {
    if (isShape(evt.update) === false) return;

    layer.updatePolygon(evt.update);
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
