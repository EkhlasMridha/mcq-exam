import { createContext, useContext } from "react";
import type { TableContextProps } from "./types";

export const TableContext = createContext<TableContextProps<any>>({
  columns: [],
});

export const useTableContext = () => {
  return useContext(TableContext);
};
