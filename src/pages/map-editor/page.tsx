import { useEffect, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import useMapEditorSettings from "state/mapEditor/useSettings";
import EditRibbon from "./EditRibbon";
import ElementPanel from "./ElementPanel";
import Map from "./Map";
import styles from "./page.module.scss";

export interface MapEditorPageProps {

}

function MapEditorPage (props: MapEditorPageProps) {
  const settings = useMapEditorSettings();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    console.log(ref.current.style);
    ref.current.style.setProperty('--col-gj-active', settings.colors.active);
  }, [settings]);

  return (
    <div ref={ref} className={styles.page}>
      <PanelGroup
        className={styles.documentPanelGroup}
        direction='horizontal'
        autoSaveId="map-editor"
      >
        <Panel className={styles.featuresPanel} defaultSize={11} minSize={8}>
          <div className={styles.featuresFrame}>
            <ElementPanel />
          </div>
        </Panel>
        <PanelResizeHandle><div /></PanelResizeHandle>
        <Panel className={styles.mapPanel} minSize={20}>
          <div className={styles.editRibbon}>
            <EditRibbon />
          </div>
          <div className={styles.mapFrame}>
            <Map />
          </div>
        </Panel>
        <PanelResizeHandle><div /></PanelResizeHandle>
        <Panel className={styles.detailsPanel} defaultSize={20} minSize={5}>
          <div className={styles.detailsFrame}>
            DETAILS
          </div>
        </Panel>
      </PanelGroup>
      <div className={styles.appToolbar}>
        MAP EDITOR | new - open - save - import - export | undo - redo - properties
      </div>
    </div>
  );
}

export default MapEditorPage;
