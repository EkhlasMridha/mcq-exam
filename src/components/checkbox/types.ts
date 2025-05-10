import type { InputProps } from "components/input/types";
import type { CSSProperties } from "react";

export interface CheckboxProps
  extends Pick<
    InputProps,
    "className" | "checked" | "value" | "onChange" | "variantSize" | "isError"
  > {
  label?: string;
  labelStyle?: CSSProperties;
}
