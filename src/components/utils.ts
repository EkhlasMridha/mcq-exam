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
