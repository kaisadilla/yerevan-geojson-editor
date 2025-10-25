import { useActiveElement } from 'context/useActiveElement';
import GLT from 'GLT';
import type { LeafletMouseEvent } from 'leaflet';
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
  const active = useActiveElement();

  const { point: pointIcon, pointLabel } = useMarkers();

  return (<>
    <Marker
      position={GLT.gj.coord.leaflet(point.position)}
      icon={pointIcon}
      eventHandlers={{click: handleClick}}
    />
    {settings.showLabels && <Marker
      position={GLT.gj.coord.leaflet(point.position)}
      icon={pointLabel(point.name)}
      eventHandlers={{click: handleClick}}
    />}
  </>);

  function handleClick (evt: LeafletMouseEvent) {
    active.setElement(point.id);
  }
}

export default MapPoint;
