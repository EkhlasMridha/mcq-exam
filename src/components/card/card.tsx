import type { CSSProperties, ReactNode } from "react";

interface CardProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const Card = ({ children, className, style }: CardProps) => {
  const classNames = ["card", className].join(" ");
  return (
    <div
      role="card"
      aria-description="card"
      className={classNames}
      style={style}
    >
      {children}
    </div>
  );
};
