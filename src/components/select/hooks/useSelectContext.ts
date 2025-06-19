import { createContext, useContext } from "react";
import type { DropdownPlacement } from "../types";

interface SelectContextProps {
  placement?: DropdownPlacement;
  isOpen?: boolean;
}
const SelectContext = createContext<SelectContextProps>({});
export const SelectContextProvider = SelectContext.Provider;

export function useSelectContext() {
  return useContext(SelectContext);
}
