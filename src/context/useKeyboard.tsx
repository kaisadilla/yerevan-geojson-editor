import { createContext, useContext, useEffect, useState } from "react";
import { isEventTargetEditable } from "utils";

interface InternalState {
  shift: boolean;
  ctrl: boolean;
}

interface KeyboardContextValue extends InternalState {
}

const KeyboardContext = createContext(undefined as KeyboardContextValue | undefined);

export const KeyboardProvider = ({ children }: any) => {
  const [state, setState] = useState<InternalState>(initState);

  function setShift (value: boolean) {
    setState(prev => ({ ...prev, shift: value }));
  }

  function setCtrl (value: boolean) {
    setState(prev => ({ ...prev, ctrl: value }));
  }

  useEffect(() => {
    function handleKeyDown (evt: KeyboardEvent) {
      if (isEventTargetEditable(evt.target)) return;
    
      if (evt.shiftKey) setShift(true);
      if (evt.ctrlKey) setCtrl(true);
    }

    function handleKeyUp (evt: KeyboardEvent) {
      if (!evt.shiftKey) setShift(false);
      if (!evt.ctrlKey) setCtrl(false);
    }

    function handleBlur () {
      setShift(false);
      setCtrl(false);
    }

    function handleFocus () {
      requestAnimationFrame(() => {
        handleKeyDown(new KeyboardEvent('keydown'));
      });
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    }
  });

  return (
    <KeyboardContext.Provider value={{
      ...state,
    }}>
      {children}
    </KeyboardContext.Provider>
  )
}

export function useKeyboardCtx () : KeyboardContextValue {
  const ctx = useContext(KeyboardContext);

  if (!ctx) {
    throw new Error("<KeyboardProvider> not found.");
  }

  return ctx;
}

function initState () : InternalState {
  return {
    shift: false,
    ctrl: false,
  };
}
