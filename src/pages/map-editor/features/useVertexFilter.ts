import type { Position } from "geojson";
import type { LeafletDragEndEvent, LeafletEvent } from "leaflet";
import { useEffect, useState } from "react";
import { useMap, useMapEvent } from "react-leaflet";
import useMapperSettings from "state/mapper/useSettings";

const MARGIN = 26;
const MAX = 120;

export default function useVertexFilter (latlngVertices: Position[]) {
  const map = useMap();
  const settings = useMapperSettings();

  const [visibleIndices, setVisibleIndices] = useState(getVisibleIndices);

  useEffect(() => {
    setVisibleIndices(getVisibleIndices());
  }, [latlngVertices.length]);

  useMapEvent('zoomend', (evt: LeafletEvent) => {
    setVisibleIndices(getVisibleIndices());
  });
  useMapEvent('dragend', (evt: LeafletDragEndEvent) => {
    setVisibleIndices(getVisibleIndices());
  });

  function getVisibleIndices () : number[] {

    const bounds = map.getBounds();
    const indices: number[] = [];

    for (let i = 0; i < latlngVertices.length; i++) {
      if (bounds.contains(latlngVertices[i])) {
        indices.push(i);
      }
    }

    // At bigger zooms, we don't hide any visible vertices anymore, to
    // make sure the user can eventually see all vertices even if the polygon is
    // extremely complex.
    if (
      indices.length <= MAX
      || map.getZoom() > settings.optimization.maxZoomForVertexSkip
    ) return indices;

    // To keep consistency in the vertices shown and ommited as we move through
    // the map, we need to add the offset of the current viewport to the
    // relative screen position of each vertex.
    const topLeft = map.getPixelBounds().min;

    const filteredIndices: number[] = [];
    const seen = new Set<string>();

    for (const i of indices) {
      const p = map.latLngToContainerPoint(L.latLng(latlngVertices[i]));
      p.x += topLeft.x;
      p.y += topLeft.y;

      const str = `${Math.floor(p.x / MARGIN)},${Math.floor(p.y / MARGIN)}`;

      if (seen.has(str)) continue;

      filteredIndices.push(i);
      seen.add(str);
    }

    return filteredIndices;
  }

  return {
    /**
     * The indices of the vertices that are currently visible.
     */
    visibleIndices,
  }
}
