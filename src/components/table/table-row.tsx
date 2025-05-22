import type { DetailedHTMLProps, HTMLAttributes } from "react";

interface TableRowProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  > {
  dataRowIndex: number;
}

export const TableRow = ({
  children,
  dataRowIndex,
  ...restProps
}: TableRowProps) => {
  return (
    <tr {...restProps} data-index={dataRowIndex}>
      {children}
    </tr>
  );
};
