import type { CheckboxProps } from "components/checkbox/types";
import type { CSSProperties } from "react";

export interface RadioInputProps extends CheckboxProps {
  name?: string;
}
export interface RadioItem {
  label: string;
  value: string;
}

export interface RadioGroupProps
  extends Pick<
    RadioInputProps,
    "onChange" | "value" | "variantSize" | "disabled"
  > {
  className?: string;
  style?: CSSProperties;
  items?: RadioItem[];
  orientation?: "column" | "row";
  itemGap?: string | number;
}
