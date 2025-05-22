import { Button } from "components/button";
import { CloseIcon } from "components/icons";
import { cloneElement, isValidElement, type MouseEvent } from "react";
import styles from "./styles.module.css";
import type { HeadFootModalTemplateProps } from "./types";
import { FocusTrap } from "components/focus-trap";
import type { ModalInjectedProps } from "../types";

export const HeadFootModalTemplate = (props: HeadFootModalTemplateProps) => {
  const {
    children,
    className,
    style,
    onClose,
    primaryButtonProps,
    secondaryButtonProps,
    header,
    footerAddonLeft,
    bodyClassNames,
    footerClassNames,
    headerClassNames,
    hidePrimaryButton,
    hideSecondaryButton,
    closeOnPrimaryClick,
    closeOnSecondaryClick = true,
    isClosing,
  } = props as HeadFootModalTemplateProps & ModalInjectedProps;

  const {
    name: primaryBtnName = "Done",
    variant = "outline",
    onClick: primaryClick,
    ...primaryBtnProps
  } = primaryButtonProps || {};

  const {
    name: secondaryButtonName = "Cancel",
    onClick: secondaryClick,
    ...secondaryBtnProps
  } = secondaryButtonProps || {};

  const classNames = [
    "app-modal",
    "modal-animation",
    styles.app_modal_template,
    className,
  ].join(" ");
  const modalHeader = typeof header === "string" ? <h2>{header}</h2> : header;

  const onSecondaryBtnClick = (event: MouseEvent<HTMLButtonElement>) => {
    secondaryClick?.(event);
    closeOnSecondaryClick && onClose();
  };

  const onPrimaryBtnClick = (event: MouseEvent<HTMLButtonElement>) => {
    primaryClick?.(event);
    closeOnPrimaryClick && onClose();
  };
  return (
    <FocusTrap
      options={{
        allowOutsideClick: true,
      }}
    >
      <div
        role="modal"
        className={classNames}
        style={style}
        data-open={!isClosing}
      >
        <div className={[styles.modal_head, headerClassNames].join(" ")}>
          {modalHeader}
          <Button
            role="close"
            variant="ghost"
            size="medium"
            color="error"
            shape="circle"
            icon={<CloseIcon />}
            onClick={onClose}
          />
        </div>
        <div className={[styles.modal_body, bodyClassNames].join(" ")}>
          {!isValidElement(children)
            ? children
            : cloneElement<any>(children, { onClose: onClose })}
        </div>
        <div className={[styles.modal_foot, footerClassNames].join(" ")}>
          {footerAddonLeft}
          <div style={{ flex: 1 }} />
          {!hideSecondaryButton && (
            <Button
              role="button"
              variant="outline"
              size="large"
              onClick={onSecondaryBtnClick}
              {...secondaryBtnProps}
            >
              {secondaryButtonName}
            </Button>
          )}
          {!hidePrimaryButton && (
            <Button
              role="button"
              onClick={onPrimaryBtnClick}
              size="large"
              {...primaryBtnProps}
            >
              {primaryBtnName}
            </Button>
          )}
        </div>
      </div>
    </FocusTrap>
  );
};
