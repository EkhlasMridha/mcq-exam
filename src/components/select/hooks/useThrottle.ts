import { useRef } from "react";

export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delayInMs: number
) {
  let lastCall = useRef(0);

  return (...args: Parameters<T>) => {
    const now = new Date().getTime();
    if (now - lastCall.current >= delayInMs) {
      lastCall.current = now;
      fn(...args);
    }
  };
}
