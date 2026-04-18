import type { Position } from "geojson";
import GLT from "GLT";
import { type LatLng, type LeafletDragEndEvent, type ImageOverlay as LImageOverlay, type Marker as LMarker, type Polygon as LPolygon } from "leaflet";
import type { Corner, Edge } from "models/MapDocument";
import { useRef, type RefObject } from "react";
import { ImageOverlay, Marker, Polygon } from "react-leaflet";
import useMapperSettings from "state/mapper/useSettings";
import useMarkers from "./useMarkers";

export interface RectangleMoveCornersProps {
  image: string | null;
  imgOpacity: number;
  north: number;
  south: number;
  west: number;
  east: number;
  onMoveCorner?: (corner: Corner, pos: Position) => void;
  onMoveEdge?: (edge: Edge, value: number) => void;
}

function RectangleMoveCorners ({
  image,
  imgOpacity,
  north,
  south,
  west,
  east,
  onMoveCorner,
  onMoveEdge,
}: RectangleMoveCornersProps) {
  const polygonRef = useRef<LPolygon>(null);
  const imgRef = useRef<LImageOverlay>(null);
  const tlRef = useRef<LMarker>(null);
  const trRef = useRef<LMarker>(null);
  const blRef = useRef<LMarker>(null);
  const brRef = useRef<LMarker>(null);

  const settings = useMapperSettings();

  const latlngVerts = GLT.gj.coords.leaflet([
    [west, north],
    [east, north],
    [east, south],
    [west, south],
    [west, north],
  ]);

  const { vertex, possibleVertex } = useMarkers();

  return (<>
    {image === null && <Polygon
      ref={polygonRef}
      positions={latlngVerts}
      weight={settings.lineWidth}
      color={settings.colors.active}
    />}
    {image && 
    <ImageOverlay
      ref={imgRef}
      url={image}
      bounds={[
        [north, east],
        [south, west],
      ]}
      opacity={imgOpacity}
    />}
    
    {([
      [tlRef, [north, west], 'topLeft'],
      [trRef, [north, east], 'topRight'],
      [blRef, [south, west], 'bottomLeft'],
      [brRef, [south, east], 'bottomRight'],
    ] satisfies [RefObject<LMarker | null>, Position, Corner][]).map((d, i) => <Marker
      ref={d[0]}
      position={d[1]}
      icon={vertex}
      draggable
      eventHandlers={{
        drag: (evt: LeafletDragEndEvent) => handleDragCorner(evt, d[2]),
        dragend: (evt: LeafletDragEndEvent) => handleDragCornerEnd(evt, d[2]),
      }}
    />)}
  </>);

  function handleDragCorner (evt: LeafletDragEndEvent, corner: Corner | Edge) {
    const latlng = evt.target.getLatLng() as LatLng;

    let newNorth = north;
    let newSouth = south;
    let newWest = west;
    let newEast = east;

    if (corner === 'topLeft') {
      newNorth = latlng.lat;
      newWest = latlng.lng;
    }
    else if (corner === 'topRight') {
      newNorth = latlng.lat;
      newEast = latlng.lng;
    }
    else if (corner === 'bottomLeft') {
      newSouth = latlng.lat;
      newWest = latlng.lng;
    }
    else if (corner === 'bottomRight') {
      newSouth = latlng.lat;
      newEast = latlng.lng;
    }

    polygonRef.current?.setLatLngs(GLT.gj.coords.leaflet([
      [newWest, newNorth],
      [newEast, newNorth],
      [newEast, newSouth],
      [newWest, newSouth],
      [newWest, newNorth],
    ]));
    // @ts-ignore 'setBounds' exists.
    imgRef.current?.setBounds([
        [newNorth, newEast],
        [newSouth, newWest],
    ]);
    tlRef.current?.setLatLng(GLT.gj.coord.leaflet([newWest, newNorth]));
    trRef.current?.setLatLng(GLT.gj.coord.leaflet([newEast, newNorth]));
    blRef.current?.setLatLng(GLT.gj.coord.leaflet([newWest, newSouth]));
    brRef.current?.setLatLng(GLT.gj.coord.leaflet([newEast, newSouth]));
  }

  function handleDragCornerEnd (evt: LeafletDragEndEvent, corner: Corner | Edge) {
    const latlng = evt.target.getLatLng() as LatLng;
    
    if (
      corner === 'topLeft'
      || corner === 'topRight'
      || corner === 'bottomLeft'
      || corner === 'bottomRight'
    ) {
      onMoveCorner?.(corner, [latlng.lng, latlng.lat]);
    }
    else if (corner === 'north' || corner === 'south') {
      onMoveEdge?.(corner, latlng.lat);
    }
    else {
      onMoveEdge?.(corner, latlng.lng);
    }
  }
}

export default RectangleMoveCorners;
