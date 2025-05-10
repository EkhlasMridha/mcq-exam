import { useRef, type ChangeEvent, type CSSProperties } from "react";
import { Checkbox } from "./checkbox";
import type { CheckboxGroupProps } from "./types";

export const CheckboxGroup = ({
  className,
  disabled,
  itemGap = 14,
  items,
  onChange,
  orientation = "column",
  style,
  value,
  variantSize,
}: CheckboxGroupProps) => {
  const classNames = ["mq-cbx-group", className];
  orientation === "column" && classNames.unshift("mq-cbx-group-col");
  const flattenClassNames = classNames.join(" ").trim();
  const wrapperStyles: CSSProperties = {
    ...style,
    gap: itemGap,
  };

  const valueRef = useRef<string[]>(Array.isArray(value) ? value : []);

  const onChangeItem = (event: ChangeEvent<HTMLInputElement>) => {
    const isExist = valueRef.current.includes(event.target.value);
    if (isExist) {
      const index = valueRef.current.indexOf(event.target.value);
      valueRef.current.splice(index, 1);
    } else {
      valueRef.current.push(event.target.value);
    }
    !!onChange && onChange(valueRef.current);
  };

  return (
    <div className={flattenClassNames} style={wrapperStyles}>
      {(items ?? []).map((item) => {
        let isChecked: boolean | undefined = undefined;
        if (Array.isArray(value) && !!(value ?? []).length) {
          isChecked = value.includes(item.value) || undefined;
        }
        return (
          <Checkbox
            key={item?.value}
            checked={isChecked}
            value={item?.value}
            label={item?.label}
            disabled={disabled}
            variantSize={variantSize}
            onChange={onChangeItem}
          />
        );
      })}
    </div>
  );
};
