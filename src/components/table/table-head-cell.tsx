import type { CSSProperties } from "react";
import type { TableHeadCellProps } from "./types";

export const TableHeadCell = <T extends any>({
  children,
  column,
  style,
  ...restProps
}: TableHeadCellProps<T>) => {
  const { align = "left" } = column || {};
  const headStyles: CSSProperties = { ...style, textAlign: align };

  return (
    <th style={headStyles} {...restProps}>
      {children}
    </th>
  );
};
