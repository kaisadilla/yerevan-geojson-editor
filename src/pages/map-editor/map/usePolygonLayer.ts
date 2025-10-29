import { useActiveElement } from "context/useActiveElement";
import GLT from "GLT";
import type { LeafletMouseEvent } from "leaflet";
import Logger from "Logger";
import { shapeToPolygon, type MapperGroup, type MapperShape } from "models/MapDocument";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import useMapperDoc from "state/mapper/useDoc";
import useMapperSettings from "state/mapper/useSettings";
import type { Collection } from "types";

export default function usePolygonLayer (
  group: MapperGroup,
  onClick?: (evt: LeafletMouseEvent, elementId: string) => void,
) {
  const doc = useMapperDoc();
  const map = useMap();
  const settings = useMapperSettings();
  const active = useActiveElement();

  const lPolygons = useRef<Collection<L.Polygon>>({});

  const groups = group.elements.filter(el => el.type === 'Group');
  const polygons = group.elements.filter(el => el.type === 'Polygon');

  // On mount, build the leaflet polygons. On dismount, delete them from the map.
  useEffect(() => {
    Logger.info("Polygon layer rebuilt.");

    buildPolygons();

    return () => {
      clearPolygons();
    }
  }, [group.id]);

  useEffect(() => {
    for (const [k, v] of Object.entries(lPolygons.current)) {
      v.off('click');
      v.on('click', (evt: LeafletMouseEvent) => onClick?.(evt, k));
    }
  }, [onClick]);

  return {
    groups,
    /**
     * Builds all polygons currently in the document, adding to the map those that
     * should be currently visible.
     */
    buildPolygons,
    hidePolygon,
    showPolygon,
    /**
     * Removes the polygon with the id given, if it exists.
     */
    deletePolygon,
    updatePolygon,
    /**
     * Removes all polygons from the map, but keeps them in cache.
     */
    hideAll,
    /**
     * Shows all existing leaflet polygons that are not hidden themselves.
     */
    showAll,
  }

  function buildPolygons () {
    clearPolygons();

    for (const p of polygons) {
      const regularP = shapeToPolygon(p);

      const verts = GLT.gj.coords.leaflet(regularP.vertices);
      const holes = regularP.holes.map(h => GLT.gj.coords.leaflet(h.vertices));

      const lPol = L.polygon([verts, ...holes] as any, {
        color: settings.colors.default,
        weight: settings.lineWidth,
      }); // ts - wrong typing

      lPol.on('click', (evt: LeafletMouseEvent) => onClick?.(evt, p.id));

      lPolygons.current[p.id] = lPol;

      if (p.isHidden === false && p.id !== active.id) {
        lPol.addTo(map);
      }
    }
  }
 
  /**
   * Removes all polygons in the map and discards them.
   */
  function clearPolygons () {
    for (const p of Object.values(lPolygons.current)) {
      map.removeLayer(p);
    }

    lPolygons.current = {};
  }

  function deletePolygon (id: string) {
    if (lPolygons.current[id]) {
      map.removeLayer(lPolygons.current[id]);
    }

    delete lPolygons.current[id];
  }

  function updatePolygon (el: MapperShape) {
    const p = lPolygons.current[el.id];
    if (!p) return;

    const regularP = shapeToPolygon(el);

    const verts = GLT.gj.coords.leaflet(regularP.vertices);
    const holes = regularP.holes.map(h => GLT.gj.coords.leaflet(h.vertices));

    p.setLatLngs([verts, ...holes] as any); // ts - wrong typing
  }

  function hidePolygon (id: string) {
    if (lPolygons.current[id]) {
      map.removeLayer(lPolygons.current[id]);
    }
  }

  function showPolygon (id: string) {
    if (lPolygons.current[id]) {
      map.addLayer(lPolygons.current[id]);
    }
  }

  function hideAll () {
    for (const p of Object.values(lPolygons.current)) {
      map.removeLayer(p);
    }
  }

  function showAll () {
    for (const p of polygons) {
      if (p.isHidden === false && lPolygons.current[p.id]) {
        map.addLayer(lPolygons.current[p.id]);
      }
    }
  }
}
