import type { ElementSizeType } from "components/button/types";
import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import type { ControlProps } from "types/common";

export interface InputProps
  extends Omit<
      DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
      "minLength" | "size"
    >,
    ControlProps {
  variantSize?: ElementSizeType;
}
