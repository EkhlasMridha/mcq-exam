import type { CSSProperties, ReactNode } from "react";
import { createFocusTrap } from "focus-trap";
import { FocusTrap } from "components/focus-trap";

interface CardProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  focusTrap?: boolean;
}

export const Card = ({ children, className, style, focusTrap }: CardProps) => {
  const classNames = ["card", className].join(" ");

  const content = (
    <div
      role="card"
      aria-description="card"
      className={classNames}
      style={style}
    >
      {children}
    </div>
  );

  if (focusTrap) {
    return <FocusTrap>{content}</FocusTrap>;
  }

  return content;
};
