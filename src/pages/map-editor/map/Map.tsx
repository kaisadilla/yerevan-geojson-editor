
import { LayerGroup, LayersControl, MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import styles from './Map.module.scss';

import "leaflet/dist/leaflet.css";
import { useEffect } from 'react';
import MapEventHandler from '../MapEventHandler';
import { MapEventEmitters } from '../MapEvents';
import LeafletElementMap from './LeafletElementMap';

export const DEFAULT_ZOOM = 2;
export const DEFAULT_MAP_CENTER = [18, 40];
export const MAX_ZOOM = 20;

export interface MapProps {
  
}

function Map (props: MapProps) {
  return (
    <div
      className={styles.map}
      onMouseDown={handleMouseDown}
    >
      <MapContainer
        className={styles.lMapContainer}
        // @ts-ignore - react-leaflet has wrong prop interface
        center={DEFAULT_MAP_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        zoomDelta={1}
        wheelPxPerZoomLevel={80}
        zoomSnap={1}
        keyboard={false}
      >
        <_MapContent />
        <MapEventHandler />
        
        <ZoomControl position="bottomright" />  
      </MapContainer>
    </div>
  );

  function handleMouseDown (evt: React.MouseEvent) {
    if (evt.button === 2) {
      MapEventEmitters.rightClickDown(evt);
      document.addEventListener('mouseup', handleMouseUp);
    }
  }

  function handleMouseUp (evt: MouseEvent) {
    document.removeEventListener('mouseup', handleMouseUp);
    MapEventEmitters.rightClickUp(evt);
  }
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
        <LayersControl.BaseLayer name="OSM Standard" checked>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={MAX_ZOOM}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OSM Humanitarian">
          <TileLayer
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, HOT'
            maxZoom={MAX_ZOOM}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OSM CyclOSM">
          <TileLayer
            url="https://{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, CyclOSM'
            maxZoom={MAX_ZOOM}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="CartoDB Standard">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            subdomains='abcd'
            maxZoom={MAX_ZOOM}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="ÖPNVKarte Public Transport">
          <TileLayer
            url="https://tile.memomaps.de/tilegen/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://öpnvkarte.de">ÖPNVKarte</a>'
            maxZoom={MAX_ZOOM}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OpenTopoMap Topographical">
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
            maxZoom={MAX_ZOOM}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Esri Satellite">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            maxZoom={MAX_ZOOM}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Esri Satellite (labelled)">
          <LayerGroup>
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              maxZoom={MAX_ZOOM}
            />
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              attribution='Labels &copy; Esri'
              maxZoom={MAX_ZOOM}
            />
          </LayerGroup>
        </LayersControl.BaseLayer>
      </LayersControl>
      <LeafletElementMap />
    </>
  );
}


export default Map;
