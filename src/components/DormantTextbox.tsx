import styles from './DormantTextbox.module.scss';

import { Text, TextInput } from "@mantine/core";
import { useEffect, useRef } from "react";

export interface DormantTextboxProps {
  value: string;
  placeholder?: string;
  isActive: boolean;
  onChange?: (value: string) => void;
  onActivate?: (active: boolean) => void;
  onSubmit?: () => void;
  onCancel?: () => void;
}

function DormantTextbox ({
  value,
  placeholder = "",
  isActive,
  onChange,
  onActivate,
  onSubmit,
  onCancel,
}: DormantTextboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive) {
      ref.current?.focus();
      ref.current?.select();
    }
  }, [isActive]);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick, true);

    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
    }
  }, [handleDocumentClick]);

  if (isActive) return (
    <TextInput
      ref={ref}
      classNames={{
        root: styles.inputRoot,
        wrapper: styles.wrapper,
        input: styles.input,
      }}
      value={value}
      placeholder={placeholder}
      onChange={evt => onChange?.(evt.target.value)}
      size='xs'
      onClick={evt => evt.stopPropagation()}
      onKeyDown={handleInputKeyDown}
    />
  );
  else return (
    <Text
      classNames={{
        root: styles.textRoot,
      }}
      lineClamp={1}
      onClick={handleTextClick}
    >
      {value === "" ? placeholder : value}
    </Text>
  );

  function handleDocumentClick (evt: MouseEvent) {
    if (!isActive) return;

    if (ref.current?.contains(evt.target as Node) === false) {
      onActivate?.(false);
    }
  }

  function handleTextClick (evt: React.MouseEvent) {
    if (evt.ctrlKey === false) return;

    onActivate?.(true);
    evt.stopPropagation();
  }

  function handleInputKeyDown (evt: React.KeyboardEvent<HTMLInputElement>) {
    if (evt.key === 'Enter') {
      onSubmit?.();
    }
    else if (evt.key === 'Escape') {
      onCancel?.();
    }
  }
}

export default DormantTextbox;
