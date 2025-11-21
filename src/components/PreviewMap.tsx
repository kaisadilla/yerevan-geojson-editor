import { MapContainer, TileLayer } from "react-leaflet";
import { $cl } from "utils";

export interface PreviewMapProps {
  className?: string;
  children?: React.ReactNode;
}

function PreviewMap ({
  className,
  children,
}: PreviewMapProps) {

  return (
    <MapContainer
      className={$cl(className)}
      // @ts-ignore - react-leaflet has wrong prop interface
      center={[0, 0]}
      zoom={1.5}
      zoomDelta={1}
      wheelPxPerZoomLevel={80}
      zoomSnap={1}
      keyboard={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={20}
        noWrap
      />
      {children}
    </MapContainer>
  );
}

export default PreviewMap;
