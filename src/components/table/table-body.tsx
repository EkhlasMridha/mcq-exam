import type { MouseEvent } from "react";
import { TableCell } from "./table-cell";
import { useTableContext } from "./table-context";
import { TableRow } from "./table-row";
import type { TableBodyProps } from "./types";

export const TableBody = (props: TableBodyProps) => {
  const {
    dataSource = [],
    rowKey,
    columns = [],
    onRowClick,
  } = useTableContext();

  const onHandleTableClick = (event: MouseEvent<HTMLTableSectionElement>) => {
    const tRow = (event.target as HTMLElement).closest("tr");

    const dataRowIndex = Number(tRow?.getAttribute("data-index")) || 0;
    if (dataRowIndex >= 0 && !!onRowClick) {
      onRowClick({
        dataSource: dataSource,
        row: dataSource[dataRowIndex],
        rowIndex: dataRowIndex,
      });
    }
  };
  return (
    <tbody {...props} onClick={onHandleTableClick}>
      {dataSource?.map((dataItem, rowIndex) => {
        let rowUniqueId: string | number = rowIndex;
        if (typeof rowKey === "function") {
          rowUniqueId = rowKey(dataItem);
        } else if (!!rowKey) {
          rowUniqueId = dataItem?.[rowKey];
        }

        return (
          <TableRow key={rowUniqueId} dataRowIndex={rowIndex}>
            {columns?.map((col, index) => (
              <TableCell
                key={col?.key || col?.name?.toString() || index}
                column={col}
                dataItem={dataItem}
                colIndex={index}
                rowIndex={rowIndex}
              />
            ))}
          </TableRow>
        );
      })}
    </tbody>
  );
};
