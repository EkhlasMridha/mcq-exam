import type { DetailedHTMLProps, HTMLAttributes } from "react";

interface TableRowProps<T>
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  > {
  dataRowIndex: number;
}

export const TableRow = <T extends any>({
  children,
  dataRowIndex,
  ...restProps
}: TableRowProps<T>) => {
  return (
    <tr {...restProps} data-index={dataRowIndex}>
      {children}
    </tr>
  );
};
