import type { FormItemLabelProps } from "./types";

export const FormItemLabel = ({
  label,
  labelClassName,
}: FormItemLabelProps) => {
  const classNames = ["hookform-label", labelClassName].join(" ");

  const defaultLabelElement = (
    <label className={classNames}>{label as string}</label>
  );

  return typeof label === "function" ? label() : defaultLabelElement;
};
