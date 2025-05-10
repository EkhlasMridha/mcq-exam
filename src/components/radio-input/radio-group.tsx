import { useId, type CSSProperties } from "react";
import { RadioInput } from "./radio-input";
import type { RadioGroupProps } from "./types";

export const RadioGroup = ({
  itemGap = 4,
  items = [],
  orientation = "column",
  className,
  style,
  variantSize = "medium",
  onChange,
  value,
  disabled,
}: RadioGroupProps) => {
  const classNames = ["mq-radiogroup-wrapper", className];
  orientation === "column" && classNames.unshift("mq-radiogroup-wrapper-col");

  const flattenedClassnames = classNames.join(" ").trim();

  const wrapperStyles: CSSProperties = {
    ...style,
    gap: itemGap,
  };
  if (orientation === "row") {
    wrapperStyles.flexWrap = "wrap";
  }

  const uniquId = useId();

  return (
    <div className={flattenedClassnames} style={wrapperStyles}>
      {(items ?? []).map((item) => {
        let isChecked: boolean | undefined = undefined;
        if (!!value) isChecked = value === item.value;

        return (
          <RadioInput
            key={item?.value}
            checked={isChecked}
            name={uniquId}
            label={item?.label}
            value={item?.value}
            variantSize={variantSize}
            onChange={onChange}
            disabled={disabled}
          />
        );
      })}
    </div>
  );
};
