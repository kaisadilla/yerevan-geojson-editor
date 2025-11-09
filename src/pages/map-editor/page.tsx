import { useEffect, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import useMapperSettings from "state/mapper/useSettings";
import Details from "./details-panel/Details";
import DocumentRibbon from "./document-ribbon/Ribbon";
import Ribbon from "./edit-ribbon/Ribbon";
import SettingsPanel from "./edit-ribbon/SettingsPanel";
import ElementPanel from "./element-panel/ElementPanel";
import HistoryListener from "./HistoryListener";
import Map from "./map/Map";
import styles from "./page.module.scss";

export interface MapEditorPageProps {

}

function MapEditorPage (props: MapEditorPageProps) {
  const settings = useMapperSettings();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.style.setProperty('--col-gj-active', settings.colors.active);
  }, [settings]);

  return (
    <div ref={ref} className={styles.page}>
      <HistoryListener />
      
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
            <Ribbon />
          </div>
          <div className={styles.mapFrame}>
            <Map />
            <SettingsPanel />
          </div>
        </Panel>
        <PanelResizeHandle><div /></PanelResizeHandle>
        <Panel className={styles.detailsPanel} defaultSize={20} minSize={5}>
          <div className={styles.detailsFrame}>
            <Details />
          </div>
        </Panel>
      </PanelGroup>
      <div className={styles.appToolbar}>
        <DocumentRibbon />
      </div>
    </div>
  );
}

export default MapEditorPage;
