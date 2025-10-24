import GLT from 'GLT';
import type { MapperPoint } from 'models/MapDocument';
import { Marker } from 'react-leaflet';
import useMapperSettings from 'state/mapper/useSettings';
import useMarkers from './useMarkers';

export interface MapPointProps {
  point: MapperPoint;
}

function MapPoint ({
  point,
}: MapPointProps) {
  const settings = useMapperSettings();

  const { point: pointIcon, pointLabel } = useMarkers();

  return (<>
    <Marker
      position={GLT.gj.coord.leaflet(point.position)}
      icon={pointIcon}
    />
    {settings.showLabels && <Marker
      position={GLT.gj.coord.leaflet(point.position)}
      icon={pointLabel(point.name)}
    />}
  </>);
}

export default MapPoint;
