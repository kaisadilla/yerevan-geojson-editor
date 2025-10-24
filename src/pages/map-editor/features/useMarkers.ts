import deleteImg from 'assets/img/marker_delete.png';
import deleteSelectedImg from 'assets/img/marker_delete_selected.png';
import useMapperUi from 'state/mapper/useUi';
import styles from './useMarkers.module.scss';

export default function useMarkers () {
  const ui = useMapperUi();

  const vertex = L.divIcon({
    className: styles.vertex,
    iconSize: [ui.toolSettings.vertexSize, ui.toolSettings.vertexSize],
  });
  const firstVertex = L.divIcon({
    className: styles.firstVertex,
    iconSize: [ui.toolSettings.vertexSize * (3 / 2), ui.toolSettings.vertexSize * (3 / 2)],
  });
  const volatileVertex = L.divIcon({
    className: styles.nextVertex,
    iconSize: [ui.toolSettings.vertexSize, ui.toolSettings.vertexSize],
  });
  const noIcon = L.divIcon({
    className:  styles.noIcon,
    iconSize: [0, 0],
  });

  const deleteVertex = L.icon({
      iconUrl: deleteImg,
      iconSize: [ui.toolSettings.deleteVertexSize, ui.toolSettings.deleteVertexSize],
  });
  const selectedDeleteVertex = L.icon({
      iconUrl: deleteSelectedImg,
      iconSize: [ui.toolSettings.deleteVertexSize, ui.toolSettings.deleteVertexSize],
  });

  function labelIcon (label: string) {
    return L.divIcon({
      className: styles.label,
      html: `<div>${label}</div>`,
    });
  }

  return {
    vertex,
    firstVertex,
    volatileVertex,
    noIcon,
    deleteVertex,
    selectedDeleteVertex,
    labelIcon,
  }
}
