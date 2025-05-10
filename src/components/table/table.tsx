import { TableBody } from "./table-body";
import { TableContext } from "./table-context";
import { TableHead } from "./table-head";
import type { TableProps } from "./types";

export const Table = <T extends any>({
  className,
  columns,
  rowKey,
  dataSource,
  onRowClick,
  cellPlaceHolder,
  ...restProps
}: TableProps<T>) => {
  const classNames = ["mq-table", className].join(" ").trim();

  return (
    <TableContext
      value={{ dataSource, onRowClick, rowKey, columns, cellPlaceHolder }}
    >
      <table className={classNames} {...restProps}>
        <TableHead columns={columns} />
        <TableBody />
      </table>
    </TableContext>
  );
};
