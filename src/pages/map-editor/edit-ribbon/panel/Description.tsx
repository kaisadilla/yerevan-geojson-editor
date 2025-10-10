import { Text } from '@mantine/core';
import styles from './Description.module.scss';

export interface DescriptionProps {
  children: React.ReactNode;
}

function Description ({
  children,
}: DescriptionProps) {

  return (
    <Text classNames={{ root: styles.text }}>
      {children}
    </Text>
  );
}

export default Description;
