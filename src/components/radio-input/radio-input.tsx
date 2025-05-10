import { useId } from "react";
import type { RadioInputProps } from "./types";

export const RadioInput = ({
  className,
  isError,
  label = "My radio",
  labelStyle,
  variantSize = "medium",
  name,
  ...restProps
}: RadioInputProps) => {
  const classNames = ["mq-radio-wrapper", `mq-radio-${variantSize}`, className];
  isError && classNames.unshift("mq-error");
  const flattenedClassnames = classNames.join(" ").trim();

  const uniquId = useId();
  return (
    <div className={flattenedClassnames}>
      <input
        className="mq-radio-input"
        type="radio"
        name={name || uniquId}
        id={uniquId}
        {...restProps}
      />
      <label className="mq-radio-label" style={labelStyle} htmlFor={uniquId}>
        {label}
      </label>
    </div>
  );
};
