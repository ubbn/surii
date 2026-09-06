import { useMemo, useRef } from "react";

/**
 * Minimal debounce-with-maxWait hook, functionally equivalent to the
 * lodash-es `debounce` used by Lexical playground's CodeActionMenuPlugin
 * utils, but implemented without adding a new dependency.
 */
export function useDebounce<T extends (...args: never[]) => void>(
  fn: T,
  ms: number,
  maxWait?: number
) {
  const funcRef = useRef<T | null>(null);
  funcRef.current = fn;

  return useMemo(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let maxTimeoutId: ReturnType<typeof setTimeout> | undefined;

    const clear = () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      if (maxTimeoutId !== undefined) {
        clearTimeout(maxTimeoutId);
        maxTimeoutId = undefined;
      }
    };

    const invoke = (args: Parameters<T>) => {
      clear();
      if (funcRef.current) {
        funcRef.current(...args);
      }
    };

    const debounced = (...args: Parameters<T>) => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => invoke(args), ms);

      if (maxWait !== undefined && maxTimeoutId === undefined) {
        maxTimeoutId = setTimeout(() => invoke(args), maxWait);
      }
    };

    debounced.cancel = clear;

    return debounced;
  }, [ms, maxWait]);
}
