import { Marker } from 'react-leaflet';
import type { LPoint } from 'state/geojsonDocSlice';

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
