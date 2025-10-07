import type { LPoint } from 'models/MapDocument';
import { Marker } from 'react-leaflet';

export interface MapPointProps {
  point: LPoint;
}

function MapPoint ({
  point,
}: MapPointProps) {

  return (
    <Marker
      position={point.geometry.coordinates}
    />
  );
}

export default MapPoint;
