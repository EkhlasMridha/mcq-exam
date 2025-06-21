import type { createFocusTrap, Options } from "focus-trap";
import type { ReactElement } from "react";

export type TrapType = ReturnType<typeof createFocusTrap>;

export interface FocusTrapRef {
  getTrap: () => TrapType | null;
}
export interface FocusTrapProps {
  children?: ReactElement<any, string>;
  options?: Partial<Options>;
}
