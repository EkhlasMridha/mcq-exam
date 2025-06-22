import type { createFocusTrap, Options as FocusTrapOptions } from "focus-trap";
import type { ReactElement } from "react";

export type Maybe<T> = T | null | undefined;

export type FocusTrapProps = {
  active?: boolean;
  paused?: boolean;
  containerElements?: (HTMLElement | SVGElement)[];
  children: ReactElement;
  focusTrapOptions?: FocusTrapOptions;
  _createFocusTrap?: typeof createFocusTrap;
};
