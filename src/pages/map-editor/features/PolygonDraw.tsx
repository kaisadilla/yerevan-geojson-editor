import { useKeyboard } from 'context/useKeyboard';
import type { Position } from 'geojson';
import GLT from 'GLT';
import type { LatLngExpression, LeafletMouseEvent } from "leaflet";
import MathExt from 'MathExt';
import { useEffect, useRef, useState } from 'react';
import { Marker, Polygon, Polyline, Tooltip, useMap } from 'react-leaflet';
import useMapperDoc from 'state/mapper/useDoc';
import useMapperSettings from 'state/mapper/useSettings';
import useMapperUi from 'state/mapper/useUi';
import MapEvents from '../MapEvents';
import styles from './PolygonDraw.module.scss';
import useMarkers from './useMarkers';

export interface PolygonDrawProps {
  /**
   * A list of positions that make up the polygon.
   */
  vertices: Position[];
  /**
   * Called every time one vertex is added to the polygon.
   * @param pos The position where the vertex is.
   * @param isStroke True when the position is added as part of a single
   * multi-position stroke (right-click behavior).
   */
  onAddVertex?: (pos: Position, isStroke: boolean) => void;
  /**
   * Called when the user completes a stroke. A stroke occurs when the user
   * presses the right button of the mouse, drags to form a path, and releases
   * the button.
   */
  onCompleteStroke?: () => void;
}

function PolygonDraw ({
  vertices: shape,
  onAddVertex,
  onCompleteStroke,
}: PolygonDrawProps) {
  const ui = useMapperUi();
  const settings = useMapperSettings();

  const latlngVertices = shape.map(c => GLT.gj.coord.leaflet(c));
  
  const { firstVertex } = useMarkers();

  return (<>
    {ui.toolSettings.showVertices && <_MarkerLayer
      latlngVertices={latlngVertices}
    />}
    <Polygon
      className={styles.polygon}
      positions={latlngVertices}
      weight={0}
      color={settings.colors.active}
    />
    <Polyline
      positions={[latlngVertices]}
      weight={settings.lineWidth}
      color={settings.colors.active}
    />
    <Marker
      position={latlngVertices[0]}
      icon={firstVertex}
    />
    <_NextVertex
      shape={shape}
      onAddVertex={onAddVertex}
      onCompleteStroke={onCompleteStroke}
    />
  </>);
}

interface _MarkerLayerProps {
  latlngVertices: LatLngExpression[];
}

function _MarkerLayer ({
  latlngVertices: lShape,
}: _MarkerLayerProps) {
  const ui = useMapperUi();

  const map = useMap();
  const markers = useRef<L.Marker[]>([]);
  
  const { vertex, noIcon } = useMarkers();

  useEffect(() => {
    if (markers.current.length > lShape.length) {
      for (let i = lShape.length; i < markers.current.length; i++) {
        map.removeLayer(markers.current[i]);
      }

      markers.current = markers.current.slice(0, lShape.length);
      return;
    }

    for (let i = markers.current.length; i < lShape.length; i++) {
      const m = L.marker(lShape[i], {
        icon: i === 0 ? noIcon : vertex
    }).addTo(map);
      markers.current.push(m);
    }

  }, [lShape, map]);

  useEffect(() => {
    return () => {
      for (const m of markers.current) {
        map.removeLayer(m);
      }
      markers.current = [];
    }
  }, []);

  return null;
}

interface _NextVertexProps {
  shape: Position[];
  onAddVertex?: (pos: Position, isStroke: boolean) => void;
  onCompleteStroke?: () => void;
}

function _NextVertex ({
  shape,
  onAddVertex,
  onCompleteStroke,
}: _NextVertexProps) {
  const doc = useMapperDoc();
  const ui = useMapperUi();
  const settings = useMapperSettings();
  const keyboard = useKeyboard();
  const map = useMap();

  const [hoveredCoords, setHoveredCoords] = useState<Position | null>();
  const [drawingLine, setDrawingLine] = useState(false);
  const lastVertex = useRef<Position>(shape[shape.length - 1]);
  
  const { volatileVertex } = useMarkers();

  useEffect(() => {
    const removeMouseMove = MapEvents.mouseMove(handleMouseMove);
    const removeLClick = MapEvents.leftClick(handleLeftClick);
    const removeRClick = MapEvents.rightClickDown(handleRightClickDown);
    const removeRClickUp = MapEvents.rightClickUp(handleRightClickUp);

    return () => {
      removeMouseMove();
      removeLClick();
      removeRClick();
      removeRClickUp();
    };
  }, [doc]);

  return (
    <>
    {hoveredCoords && <Polyline
      positions={[
        GLT.gj.coord.leaflet(shape[shape.length - 1]),
        GLT.gj.coord.leaflet(hoveredCoords)
      ]}
      dashArray="7, 8, 1, 8"
      color={settings.colors.active}
      weight={2}
    />}
    {hoveredCoords && <Marker
      position={GLT.gj.coord.leaflet(hoveredCoords)}
      icon={volatileVertex}
    >
      {
        shape.length > 2 && keyboard.ctrl === false && <Tooltip
          // @ts-ignore Tooltip's props interface is incorrect.
          permanent={true}
          direction='bottom'
          offset={[0, 10]}
          className={styles.editTooltip}
        >
          Click on the first point to finish.
        </Tooltip>
      }
    </Marker>}
    </>
  );

  function handleMouseMove (evt: LeafletMouseEvent) {
    let cursorPos = evt.latlng;

    if (keyboard.ctrl === false) {
      const pxStart = map.latLngToLayerPoint(GLT.gj.coord.leaflet(shape[0]));
      const pxCursor = map.latLngToLayerPoint(cursorPos);

      if (MathExt.vec2distance(pxStart, pxCursor) < 20) {
        cursorPos = GLT.gj.coord.leafletObj(shape[0]);
      }
    }

    const hoveredCoords = GLT.leaflet.coord.gj(cursorPos);
    setHoveredCoords(hoveredCoords);

    if (drawingLine === false) return;
    if (!hoveredCoords) return;
    if (shape.length < 2) return;

    const pxLast = map.latLngToLayerPoint(
      GLT.gj.coord.leaflet(lastVertex.current)
    );
    const pxCursor = map.latLngToLayerPoint(cursorPos);

    if (MathExt.vec2distance(pxLast, pxCursor) > ui.toolSettings.pencilStep) {
      onAddVertex?.(hoveredCoords, true);
      lastVertex.current = hoveredCoords;
    }
  }

  function handleLeftClick (evt: LeafletMouseEvent) {
    if (!hoveredCoords) return;

    onAddVertex?.(hoveredCoords, false);
  }

  function handleRightClickDown () {
    setDrawingLine(true);
  }

  function handleRightClickUp () {
    setDrawingLine(false);
    onCompleteStroke?.();
  }
}

export default PolygonDraw;
