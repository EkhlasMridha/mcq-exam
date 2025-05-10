import type {
  CSSProperties,
  DetailedHTMLProps,
  HTMLAttributes,
  HtmlHTMLAttributes,
  ReactNode,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

export interface TableProps<T extends any>
  extends Pick<
    HtmlHTMLAttributes<HTMLTableElement>,
    | "className"
    | "style"
    | "accessKey"
    | "about"
    | "aria-colspan"
    | "aria-label"
    | "role"
    | "title"
    | "tabIndex"
    | "suppressHydrationWarning"
    | "suppressContentEditableWarning"
  > {
  columns: TableColumns<T>;
  dataSource?: T[];
  onRowClick?: (params: OnRowClickParams<T>) => void;
  rowKey?: ((data: T) => string | number) | keyof T;
  cellPlaceHolder?: ReactNode;
}

export type TableContextProps<T> = Pick<
  TableProps<T>,
  "dataSource" | "onRowClick" | "rowKey" | "columns" | "cellPlaceHolder"
>;

export type CellDataAlignType = "left" | "center" | "right";
export interface TableColumnProps<T> {
  heading?: ReactNode;
  name?: keyof T;
  key?: string;
  render?: (params: ColumnRenderParams<T>) => ReactNode;
  onClick?: (params: ColumnRenderParams<T>) => void;
  cellStyle?: CSSProperties;
  cellClassName?: string;
  align?: CellDataAlignType;
  width?: number | string;
}

export type OnRowClickParams<T> = Omit<ColumnRenderParams<T>, "colIndex">;

export interface ColumnRenderParams<T> {
  row: T;
  colIndex: number;
  rowIndex: number;
  dataSource: T[];
}

export type TableColumns<T> = TableColumnProps<T>[];

export type TableHeadProps<T extends any> = Pick<TableProps<T>, "columns">;

export interface TableHeadCellProps<T>
  extends DetailedHTMLProps<
    ThHTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  > {
  column: TableColumnProps<T>;
}

export interface TableCellProps<T>
  extends DetailedHTMLProps<
    TdHTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  > {
  column: TableColumnProps<T>;
  dataItem: T;
  colIndex: number;
  rowIndex: number;
}

export interface TableBodyProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  > {}
