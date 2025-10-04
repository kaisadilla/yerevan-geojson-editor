import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import FeaturePanel from "./FeaturePanel";
import Map from "./Map";
import styles from "./page.module.scss";

export interface MapEditorPageProps {

}

function MapEditorPage (props: MapEditorPageProps) {

  return (
    <div className={styles.page}>
      <PanelGroup
        className={styles.documentPanelGroup}
        direction='horizontal'
        autoSaveId="map-editor"
      >
        <Panel className={styles.featuresPanel} defaultSize={11} minSize={8}>
          <div className={styles.featuresFrame}>
            <FeaturePanel />
          </div>
        </Panel>
        <PanelResizeHandle><div /></PanelResizeHandle>
        <Panel className={styles.mapPanel}>
          <div className={styles.mapFrame}>
            <Map />
          </div>
        </Panel>
        <PanelResizeHandle><div /></PanelResizeHandle>
        <Panel className={styles.detailsPanel} defaultSize={20}>
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
