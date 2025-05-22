import { FocusTrap } from "components/focus-trap";
import { cloneElement, isValidElement, type HtmlHTMLAttributes } from "react";

interface ModalSkeletonProps
  extends Pick<HtmlHTMLAttributes<any>, "className" | "style" | "children"> {
  onClose?: () => void;
}
export const ModalSkeleton = ({
  children,
  className,
  style,
  onClose,
}: ModalSkeletonProps) => {
  const classNames = ["app-modal", className].join(" ");

  return (
    <FocusTrap options={{ allowOutsideClick: true }}>
      <div className={classNames} style={style}>
        {!isValidElement(children)
          ? children
          : cloneElement<any>(children, { onClose: onClose })}
      </div>
    </FocusTrap>
  );
};
