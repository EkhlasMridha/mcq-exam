import type { DetailedHTMLProps, InputHTMLAttributes } from "react";

export interface InputProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "minLength"
  > {
  variantSize?: "small" | "medium" | "large";
  isError?: boolean;
}
