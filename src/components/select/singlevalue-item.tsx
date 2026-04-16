import type { ReactNode } from "react";

interface SingleValueItemProps {
  children?: ReactNode;
  tooltip?: string;
}
export const SingleValueItem = ({
  children,
  tooltip,
}: SingleValueItemProps) => {
  return (
    <span className="single-value" title={tooltip}>
      {children}
    </span>
  );
};
