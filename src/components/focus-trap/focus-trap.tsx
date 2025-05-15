import { createFocusTrap, type Options } from "focus-trap";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  type ReactElement,
  type RefObject,
} from "react";

interface FocusTrapProps {
  children?: ReactElement<any, string>;
  options?: Partial<Options>;
}

export const FocusTrap = ({ children, options }: FocusTrapProps) => {
  const elementRef = useRef<HTMLElement>(null);
  const focusTrapRef = useRef<ReturnType<typeof createFocusTrap>>(null);

  if (!isValidElement(children)) {
    throw new Error(
      "FocusTrap expects a single valid React element (e.g. <div>) as its child."
    );
  }

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
};
