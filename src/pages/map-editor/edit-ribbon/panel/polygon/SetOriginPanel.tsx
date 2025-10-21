import { useTranslation } from 'react-i18next';
import BasePanel from '../BasePanel';

export interface SetOriginPanelProps {
  
}

function SetOriginPanel (props: SetOriginPanelProps) {
  const { t } = useTranslation('ui');
  return (
    <BasePanel name={t("tool.polygon.set_origin.settings.name")}>
      <BasePanel.Desc>
        {t("tool.polygon.set_origin.settings.desc")}
      </BasePanel.Desc>
    </BasePanel>
  );
}

export default SetOriginPanel;
