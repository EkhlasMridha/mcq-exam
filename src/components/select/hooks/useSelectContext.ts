import { createContext, useContext, type MouseEvent } from "react";
import type { DropdownPlacement } from "../types";

interface SelectContextProps {
  placement?: DropdownPlacement;
  isOpen?: boolean;
  onAddItem?: (e?: MouseEvent<HTMLButtonElement>) => void;
  onClose: () => void;
}
const SelectContext = createContext<SelectContextProps>({ onClose: () => {} });
export const SelectContextProvider = SelectContext.Provider;

export function useSelectContext() {
  return useContext(SelectContext);
}
