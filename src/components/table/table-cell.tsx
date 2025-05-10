import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { useTableContext } from "./table-context";
import type { TableCellProps } from "./types";

export const TableCell = <T extends any>({
  children,
  column,
  dataItem,
  rowIndex,
  colIndex,
  ...restProps
}: TableCellProps<T>) => {
  const { cellPlaceHolder, dataSource = [] } = useTableContext() || {};
  let cellValue: ReactNode = cellPlaceHolder || "";
  const {
    name,
    render,
    cellClassName,
    cellStyle,
    align = "left",
    onClick,
  } = column || {};
  const cellStyles: CSSProperties = {
    ...cellStyle,
    textAlign: align,
  };

  if (!!render) {
    cellValue =
      render({ row: dataItem, rowIndex, colIndex, dataSource }) ||
      cellPlaceHolder;
  } else if (!!name) {
    cellValue = (dataItem[name] as any) || cellPlaceHolder;
  }

  const onCellClick = (event: MouseEvent<HTMLTableCellElement>) => {
    if (!onClick) return;

    event.preventDefault();
    event.stopPropagation();

    onClick?.({
      colIndex,
      dataSource,
      row: dataItem,
      rowIndex,
    });
  };

  return (
    <td
      className={cellClassName}
      style={cellStyles}
      {...restProps}
      onClick={onCellClick}
    >
      {cellValue}
    </td>
  );
};
