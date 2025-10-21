import { Text } from '@mantine/core';
import styles from './BasePanel.Description.module.scss';

export interface BasePanel_DescriptionProps {
  children: React.ReactNode;
}

function BasePanel_Description ({
  children,
}: BasePanel_DescriptionProps) {

  return (
    <Text classNames={{ root: styles.text }}>
      🛈 {children}
    </Text>
  );
}

export default BasePanel_Description;
