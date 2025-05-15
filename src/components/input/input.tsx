import { forwardRef } from "react";
import type { InputProps } from "./types";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variantSize = "medium", isError, ...restProps }, ref) => {
    let classNames = [
      "mq-input-outline",
      "mq-input",
      `mq-input-${variantSize}`,
      className,
    ];
    isError && classNames.unshift("error");

    return (
      <input ref={ref} className={classNames.join(" ").trim()} {...restProps} />
    );
  }
);
