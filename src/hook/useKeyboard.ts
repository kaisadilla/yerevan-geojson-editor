import { useEffect } from "react";

export default function useKeyboard () {
  const down: Record<string, () => void> = {};
  const up: Record<string, () => void> = {};

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    }
  })

  function handleKeyDown (evt: KeyboardEvent) {
    down[evt.key]?.();
  }

  function handleKeyUp (evt: KeyboardEvent) {
    up[evt.key]?.();
  }

  return {
    down,
    up,
  }
}
