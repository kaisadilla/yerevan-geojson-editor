import { useKeyboardCtx } from 'context/useKeyboard';
import type { Position } from 'geojson';
import GLT from 'GLT';
import useKeyboard from 'hook/useKeyboard';
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
  color?: string;
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
  vertices,
  color,
  onAddVertex,
  onCompleteStroke,
}: PolygonDrawProps) {
  const ui = useMapperUi();
  const settings = useMapperSettings();

  color ??= settings.colors.active;

  const latlngVertices = vertices.map(c => GLT.gj.coord.leaflet(c));
  
  const { firstVertex } = useMarkers();

  return (<>
    {ui.toolSettings.showVertices && <_MarkerLayer
      latlngVertices={latlngVertices}
    />}
    {latlngVertices.length > 0 && <Polygon
      className={styles.polygon}
      positions={latlngVertices}
      weight={0}
      color={color}
    />}
    {latlngVertices.length > 0 && <Polyline
      positions={[latlngVertices]}
      weight={settings.lineWidth}
      color={color}
    />}
    {latlngVertices.length > 0 && <Marker
      position={latlngVertices[0]}
      icon={firstVertex}
    />}
    <_NextVertex
      vertices={vertices}
      color={color}
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
  vertices: Position[];
  color: string;
  onAddVertex?: (pos: Position, isStroke: boolean) => void;
  onCompleteStroke?: () => void;
}

function _NextVertex ({
  vertices,
  color,
  onAddVertex,
  onCompleteStroke,
}: _NextVertexProps) {
  const [hoveredCoords, setHoveredCoords] = useState<Position | null>();
  const [drawingLine, setDrawingLine] = useState(false);
  const [straightLine, setStraightLine] = useState(false);
  const lastVertex = useRef<Position>(vertices[vertices.length - 1]);

  const doc = useMapperDoc();
  const ui = useMapperUi();
  const settings = useMapperSettings();
  const keyboard = useKeyboardCtx();
  const map = useMap();
  
  const { volatileVertex } = useMarkers();
  const { down, up } = useKeyboard();

  down['z'] = () => setStraightLine(true);
  up['z'] = () => setStraightLine(false);

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
        GLT.gj.coord.leaflet(vertices[vertices.length - 1]),
        GLT.gj.coord.leaflet(hoveredCoords)
      ]}
      dashArray="7, 8, 1, 8"
      color={color}
      weight={2}
    />}
    {hoveredCoords && <Marker
      position={GLT.gj.coord.leaflet(hoveredCoords)}
      icon={volatileVertex}
    >
      {
        vertices.length > 2 && keyboard.ctrl === false && <Tooltip
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
      const pxStart = map.latLngToLayerPoint(GLT.gj.coord.leaflet(vertices[0]));
      const pxCursor = map.latLngToLayerPoint(cursorPos);

      if (MathExt.vec2distance(pxStart, pxCursor) < 20) {
        cursorPos = GLT.gj.coord.leafletObj(vertices[0]);
      }
    }

    const hoveredCoords = GLT.leaflet.coord.gj(cursorPos);

    if (straightLine) {
      const lastVert = vertices[vertices.length - 1];
      const distLng = hoveredCoords[0] - lastVert[0];
      const distLat = hoveredCoords[1] - lastVert[1];

      if (Math.abs(distLng) < Math.abs(distLat)) {
        hoveredCoords[0] = lastVert[0];
      }
      else {
        hoveredCoords[1] = lastVert[1];
      }
    }

    setHoveredCoords(hoveredCoords);

    if (drawingLine === false) return;
    if (!hoveredCoords) return;
    if (vertices.length < 2) return;

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
