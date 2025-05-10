import { TableHeadCell } from "./table-head-cell";
import type { TableHeadProps } from "./types";

export const TableHead = <T extends any>({ columns }: TableHeadProps<T>) => {
  return (
    <thead>
      <tr>
        {columns?.map((col) => (
          <TableHeadCell key={col.key} column={col}>
            {col.heading}
          </TableHeadCell>
        ))}
      </tr>
    </thead>
  );
};
