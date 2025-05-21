import type { HtmlHTMLAttributes } from "react";
import styles from "./styles.module.css";

interface ModalSkeletonProps
  extends Pick<
    HtmlHTMLAttributes<HTMLDivElement>,
    "className" | "style" | "children"
  > {}
export const ModalSkeleton = ({
  children,
  className,
  style,
}: ModalSkeletonProps) => {
  const classNames = [styles.app_modal, className].join(" ");

  return (
    <div className={classNames} style={style}>
      {children}
    </div>
  );
};
