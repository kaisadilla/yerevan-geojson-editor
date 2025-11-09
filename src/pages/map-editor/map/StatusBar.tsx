import { useState } from 'react';
import { useMap, useMapEvent } from 'react-leaflet';
import styles from './StatusBar.module.scss';

export interface StatusBarProps {
  
}

function StatusBar (props: StatusBarProps) {
  const map = useMap();

  const [zoom, setZoom] = useState(map.getZoom());

  useMapEvent('zoom', () => setZoom(map.getZoom()));

  return (
    <div className={styles.statusBar}>
      Zoom: {zoom}
    </div>
  );

  //const barRef = useRef<HTMLDivElement>(null);
//
  //useEffect(() => {
  //  const legend = L.
  //})
//
  //return null;
//
  //function buildBar () {
  //  const legend = L.control({ position: 'bottomright' });
//
  //  legend.onAdd = () => {
  //    const div = L.DomUtil.create('div', 'statusbar');
  //    div.innerHTML = `
  //      
  //    `;
  //  }
  //}
}

export default StatusBar;
