import type { Ref, RefCallback, RefObject } from "react";

export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref && "current" in ref) {
        (ref as RefObject<T | null>).current = value;
      }
    });
  };
}

export function throttleFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
) {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = new Date().getTime();
    console.log(now - lastCall, delay);
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}
