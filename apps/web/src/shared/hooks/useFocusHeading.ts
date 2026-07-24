import { useEffect, useRef } from 'react';

/** Moves focus to the current step heading so route changes are announced. */
export function useFocusHeading<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return ref;
}
