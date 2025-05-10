import type { InputProps } from "components/input/types";
import type { CSSProperties } from "react";

export interface CheckboxProps
  extends Pick<
    InputProps,
    | "className"
    | "checked"
    | "value"
    | "onChange"
    | "variantSize"
    | "isError"
    | "disabled"
  > {
  label?: string;
  labelStyle?: CSSProperties;
}

export interface CheckboxGroupItem {
  label: string;
  value: string;
}
export interface CheckboxGroupProps
  extends Omit<
    CheckboxProps,
    "checked" | "label" | "labelStyle" | "isError" | "onChange"
  > {
  items?: CheckboxGroupItem[];
  orientation?: "row" | "column";
  itemGap?: number | string;
  style?: CSSProperties;
  onChange?: (value?: string[]) => void;
}
