import { cloneElement, forwardRef, isValidElement } from "react";
import type { PopupWrapperProps } from "./types";
import styles from "./popup.module.css";

export const PopupWrapper = forwardRef<any, PopupWrapperProps>(
  (
    {
      onPointerEnter,
      onPopupMouseEnter,
      onPopupMouseLeave,
      popupElm,
      noStyle,
      className,
      closePopup,
      isClosing,
      currentAlignment,
      style,
    },
    ref
  ) => {
    const DEFAULT_STYLES = styles.popup_wrapper_default;
    const classNames = [styles.popup_shadow, styles.popup_wrapper, className];
    !noStyle && classNames.unshift(DEFAULT_STYLES);

    if (!isValidElement(popupElm)) {
      throw new Error("Popup must be a valid React element or a string");
    }

    const onClose = () => {
      closePopup?.();
    };

    return (
      <div
        ref={ref}
        className={classNames.filter(Boolean).join(" ")}
        style={{ display: "none", ...style }}
        onMouseEnter={onPopupMouseEnter}
        onMouseLeave={onPopupMouseLeave}
        onPointerEnter={onPointerEnter}
        role="popup"
        tabIndex={-1}
      >
        {cloneElement(popupElm, {
          onClose,
          isClosing,
          alignment: currentAlignment,
        })}
      </div>
    );
  }
);
