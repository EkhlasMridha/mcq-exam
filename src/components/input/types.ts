import type { ElementSizeType } from "components/button/types";
import type { DetailedHTMLProps, InputHTMLAttributes } from "react";

export interface InputProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "minLength" | "size"
  > {
  variantSize?: ElementSizeType;
  isError?: boolean;
}
