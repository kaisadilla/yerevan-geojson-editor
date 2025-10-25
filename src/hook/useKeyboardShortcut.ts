import { useEffect } from "react";
import { isEventTargetEditable } from "utils";

export default function useKeyboardShortcut () {
  const standalone: Record<string, () => void> = {};
  const alt: Record<string, () => void> = {};

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  function handleKeyDown (evt: KeyboardEvent) {
    if (isEventTargetEditable(evt.target)) return;

    if (evt.altKey === false && evt.shiftKey === false) {
      standalone[evt.key]?.();
    }
    else if (evt.altKey === true && evt.shiftKey === false) {
      alt[evt.key]?.();
    }
  }

  return {
    standalone,
    alt,
  }
}
