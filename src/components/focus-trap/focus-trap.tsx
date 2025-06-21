import { createFocusTrap } from "focus-trap";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useRef,
  type RefObject,
} from "react";
import type { FocusTrapProps, FocusTrapRef, TrapType } from "./types";

export const FocusTrap = forwardRef<FocusTrapRef, FocusTrapProps>(
  ({ children, options }, ref) => {
    const elementRef = useRef<HTMLElement>(null);
    const focusTrapRef = useRef<TrapType>(null);

    if (!isValidElement(children)) {
      throw new Error(
        "FocusTrap expects a single valid React element (e.g. <div>) as its child."
      );
    }

    useImperativeHandle(ref, () => ({
      getTrap: () => focusTrapRef.current,
    }));

    useEffect(() => {
      if (!elementRef.current) return;

      focusTrapRef.current = createFocusTrap(elementRef.current, {
        ...options,
      });

      focusTrapRef.current.activate();

      return () => {
        focusTrapRef.current?.deactivate();
      };
    }, [elementRef]);

    return cloneElement(children, {
      ref: (node: HTMLElement | null) => {
        elementRef.current = node;

        const { ref } = children as any;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref && typeof ref === "object") {
          (ref as RefObject<HTMLElement | null>).current = node;
        }
      },
    });
  }
);
