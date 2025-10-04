
import { LayersControl, MapContainer, TileLayer, useMap } from 'react-leaflet';
import styles from './Map.module.scss';

import "leaflet/dist/leaflet.css";
import { useEffect } from 'react';

export const DEFAULT_ZOOM = 2;
export const DEFAULT_MAP_CENTER = [18, 40];
export const MAX_ZOOM = 20;

export interface MapProps {
  
}

function Map (props: MapProps) {
  return (
    <div className={styles.map}>
      <MapContainer
        className={styles.lMapContainer}
        center={DEFAULT_MAP_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomDelta={1}
        wheelPxPerZoomLevel={80}
        zoomSnap={1}
      >
        <_MapContent />
      </MapContainer>
    </div>
  );
}

interface _MapContentProps {
  
}

function _MapContent (props: _MapContentProps) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize({});
  }, [map]); // Leaflet needs to recalculate canvas size.

  return (
    <>
      <LayersControl>
        <LayersControl.BaseLayer name="Map" checked>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={MAX_ZOOM}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            maxZoom={MAX_ZOOM}
          />
        </LayersControl.BaseLayer>
      </LayersControl>
    </>
  );
}


export default Map;
