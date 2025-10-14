import GLT from 'GLT';
import type { MapperPoint } from 'models/MapDocument';
import { Marker } from 'react-leaflet';

export interface MapPointProps {
  point: MapperPoint;
}

function MapPoint ({
  point,
}: MapPointProps) {
  return (
    <Marker
      position={GLT.gj.coord.leaflet(point.position)}
    />
  );
}

export default MapPoint;
