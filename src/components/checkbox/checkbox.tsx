import { useId } from "react";
import { CheckboxFlip } from "./checkbox-flip";
import type { CheckboxProps } from "./types";

export const Checkbox = ({
  className,
  variantSize = "medium",
  isError,
  label,
  labelStyle,
  ...restProps
}: CheckboxProps) => {
  const classNames = [
    "mq-checkbox-wrapper",
    `mq-cbx-${variantSize}`,
    className,
  ];
  isError && classNames.unshift("mq-error");
  const flattenedClassnames = classNames.join(" ");
  const uniqueId = useId();

  return (
    <div className={flattenedClassnames}>
      {!!(label ?? "").length && (
        <label
          htmlFor={uniqueId}
          className="mq-checkbox-label"
          style={labelStyle}
        >
          {label}
        </label>
      )}
      <input id={uniqueId} type="checkbox" {...restProps} />
      <label className="mq-checkbox" htmlFor={uniqueId}>
        <CheckboxFlip />
      </label>
    </div>
  );
};
