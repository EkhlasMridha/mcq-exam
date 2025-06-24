import type { ReactNode } from "react";

interface ValueContainerProps {
  children?: ReactNode;
  multiple?: boolean;
}

export const ValueContainer = ({ children, multiple }: ValueContainerProps) => {
  const classNames = ["value-container"];
  multiple ? classNames?.push("multiple") : classNames.push("single");

  return <div className={classNames.join(" ")}>{children}</div>;
};
