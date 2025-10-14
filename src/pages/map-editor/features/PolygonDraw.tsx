import { useKeyboard } from 'context/useKeyboard';
import type { Position } from 'geojson';
import GLT from 'GLT';
import type { LatLngExpression, LeafletMouseEvent } from "leaflet";
import MathExt from 'MathExt';
import { useEffect, useRef, useState } from 'react';
import { Marker, Polygon, Polyline, Tooltip, useMap } from 'react-leaflet';
import useMapEditorDoc from 'state/mapEditor/useDoc';
import useMapEditorSettings from 'state/mapEditor/useSettings';
import useMapEditorUi from 'state/mapEditor/useUi';
import MapEvents from '../MapEvents';
import styles from './PolygonDraw.module.scss';

export interface PolygonDrawProps {
  /**
   * A list of positions that make up the polygon.
   */
  vertices: Position[];
  onAddVertex?: (coord: Position) => void;
}

function PolygonDraw ({
  vertices: shape,
  onAddVertex,
}: PolygonDrawProps) {
  const ui = useMapEditorUi();
  const settings = useMapEditorSettings();

  const latlngVertices = shape.map(c => GLT.gj.coord.leaflet(c));

  const firstVertex = L.divIcon({
    className: styles.firstVertex,
    iconSize: [ui.toolSettings.vertexSize * (3 / 2), ui.toolSettings.vertexSize * (3 / 2)],
  });

  const vertex = L.divIcon({
    className: styles.vertex,
    iconSize: [ui.toolSettings.vertexSize, ui.toolSettings.vertexSize],
  });

  return (<>
    <_MarkerLayer latlngVertices={latlngVertices} />
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
    <_NextVertex
      shape={shape}
      onAddVertex={onAddVertex}
    />
  </>);
}

interface _MarkerLayerProps {
  latlngVertices: LatLngExpression[];
}

function _MarkerLayer ({
  latlngVertices: lShape,
}: _MarkerLayerProps) {
  const ui = useMapEditorUi();

  const map = useMap();
  const markers = useRef<L.Marker[]>([]);

  const firstVertex = L.divIcon({
    className: styles.firstVertex,
    iconSize: [ui.toolSettings.vertexSize * (3 / 2), ui.toolSettings.vertexSize * (3 / 2)],
  });

  const vertex = L.divIcon({
    className: styles.vertex,
    iconSize: [ui.toolSettings.vertexSize, ui.toolSettings.vertexSize],
  });

  useEffect(() => {
    if (markers.current.length >= lShape.length) return;

    for (let i = markers.current.length; i < lShape.length; i++) {
      const m = L.marker(lShape[i], {icon: i === 0 ? firstVertex : vertex}).addTo(map);
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
  onAddVertex?: (coord: Position) => void;
}

function _NextVertex ({
  shape,
  onAddVertex,
}: _NextVertexProps) {
  const doc = useMapEditorDoc();
  const ui = useMapEditorUi();
  const settings = useMapEditorSettings();
  const keyboard = useKeyboard();
  const map = useMap();

  const [hoveredCoords, setHoveredCoords] = useState<Position | null>();
  const [drawingLine, setDrawingLine] = useState(false);
  const lastVertex = useRef<Position>(shape[shape.length - 1]);

  const vertex = L.divIcon({
    className: styles.nextVertex,
    iconSize: [ui.toolSettings.vertexSize, ui.toolSettings.vertexSize],
  });

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
      icon={vertex}
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
      onAddVertex?.(hoveredCoords);
      lastVertex.current = hoveredCoords;
    }
  }

  function handleLeftClick (evt: LeafletMouseEvent) {
    if (!hoveredCoords) return;

    //addVertex(Convert.leaflet.coord.geojson(evt.latlng));
    onAddVertex?.(hoveredCoords);
  }

  function handleRightClickDown () {
    setDrawingLine(true);
  }

  function handleRightClickUp () {
    setDrawingLine(false);
  }
}

export default PolygonDraw;
