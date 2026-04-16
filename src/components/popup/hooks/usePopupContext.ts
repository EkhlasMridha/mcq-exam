import { createContext, useContext } from "react";
import type { AlignmentPosition } from "../types";

interface PopupRendererContextProps {
  isOpen?: boolean;
  alignment?: AlignmentPosition;
}
export const PopupRendererContext = createContext<PopupRendererContextProps>(
  {}
);

export function usePopupContext() {
  return useContext(PopupRendererContext);
}
