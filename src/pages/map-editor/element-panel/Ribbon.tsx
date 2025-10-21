import DescriptiveTooltip from "components/DescriptiveTooltip";
import { Boxes, Circle, FolderPlus, MapPin, Pentagon, Square, Waypoints } from 'lucide-react';
import { useTranslation } from "react-i18next";
import styles from './Ribbon.module.scss';

function Ribbon () {
  const { t } = useTranslation();

  return (
    <div className={styles.ribbon}>
      <DescriptiveTooltip
        label={t("element_panel.ribbon.group.name")}
        description={t("element_panel.ribbon.group.desc")}
      >
        <button>
          <FolderPlus />
        </button>
      </DescriptiveTooltip>

      <DescriptiveTooltip
        label={t("element_panel.ribbon.point.name")}
      >
        <button>
          <MapPin />
        </button>
      </DescriptiveTooltip>

      <DescriptiveTooltip
        label={t("element_panel.ribbon.line.name")}
      >
        <button>
          <Waypoints />
        </button>
      </DescriptiveTooltip>

      <DescriptiveTooltip
        label={t("element_panel.ribbon.polygon.name")}
      >
        <button>
          <Pentagon />
        </button>
      </DescriptiveTooltip>

      <DescriptiveTooltip
        label={t("element_panel.ribbon.square.name")}
      >
        <button>
          <Square />
        </button>
      </DescriptiveTooltip>

      <DescriptiveTooltip
        label={t("element_panel.ribbon.circle.name")}
      >
        <button>
          <Circle />
        </button>
      </DescriptiveTooltip>

      <DescriptiveTooltip
        label={t("element_panel.ribbon.collection.name")}
        description={t("element_panel.ribbon.collection.desc")}
      >
        <button>
          <Boxes />
        </button>
      </DescriptiveTooltip>
    </div>
  );
}

export default Ribbon;
