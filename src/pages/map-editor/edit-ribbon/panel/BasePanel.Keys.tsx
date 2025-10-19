import { useEffect } from "react";
import { isEventTargetEditable } from "utils";

export interface BasePanel_KeysProps {
  onKey: (code: string) => void;
}

function BasePanel_Keys ({
  onKey,
}: BasePanel_KeysProps) {
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);
  
  function handleKeyDown (evt: KeyboardEvent) {
    if (isEventTargetEditable(evt.target)) return;

    onKey(evt.code);
  }

  return null;
}

export default BasePanel_Keys;
