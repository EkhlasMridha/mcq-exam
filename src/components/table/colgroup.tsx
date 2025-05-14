import type { ColGroupProps } from "./types";

export const ColGroup = <T extends any>({ columns }: ColGroupProps<T>) => {
  return (
    <colgroup>
      {columns?.map((colItem, index) => {
        const { width } = colItem ?? {};
        return (
          <col
            key={colItem?.key || colItem?.name?.toString() || index}
            width={width}
          />
        );
      })}
    </colgroup>
  );
};
