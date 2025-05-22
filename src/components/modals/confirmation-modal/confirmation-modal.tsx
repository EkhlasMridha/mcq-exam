import { Button } from "components/button";
import type { ButtonProps } from "components/button/types";
import { CloseIcon, ErrorIcon, InfoIcon, WarnIcon } from "components/icons";
import type { ModalInjectedProps } from "../types";
import styles from "./styles.module.css";
import type { ConfirmationModalProps, ConfirmationModalVariant } from "./types";
import { FocusTrap } from "components/focus-trap";

export const ConfirmationModal = (props: ConfirmationModalProps) => {
  const {
    isClosing,
    onClose,
    hideCancel,
    hideConfirm,
    cancelText = "No",
    className,
    confirmText = "Yes",
    description,
    icon,
    onCancel,
    onConfirm,
    style,
    titleText,
    variant = "info",
  } = props as ConfirmationModalProps & ModalInjectedProps;
  const classNames = [
    "app-modal",
    "modal-animation",
    styles.confirmation_modal,
    className,
  ]
    .join(" ")
    .trim();

  const buttonColorVariantMap = new Map<
    ConfirmationModalVariant,
    ButtonProps["color"]
  >([
    ["error", "error"],
    ["info", "secondary"],
    ["warn", "warn"],
  ]);
  const iconMap = new Map<ConfirmationModalVariant, any>([
    ["error", ErrorIcon],
    ["info", InfoIcon],
    ["warn", WarnIcon],
  ]);

  const Icon = iconMap.get(variant);

  const buttonColor = buttonColorVariantMap.get(variant);

  const onClickConfirm = async () => {
    await onConfirm?.();
    onClose();
  };
  const onClickCancel = async () => {
    await onCancel?.();
    onClose();
  };

  return (
    <FocusTrap options={{ allowOutsideClick: true }}>
      <div
        role="modal"
        className={classNames}
        style={style}
        data-open={!isClosing}
      >
        <div className={styles.close_icon_container}>
          <Button
            size="large"
            shape="circle"
            variant="ghost"
            color="error"
            icon={<CloseIcon />}
          />
        </div>
        <div className={styles.confirmation_content}>
          <div
            className={[styles.icon_container, `color-${variant}`].join(" ")}
          >
            {icon || <Icon />}
          </div>
          <h2>{titleText}</h2>
          <p>{description}</p>
        </div>
        {!hideCancel && !hideConfirm && (
          <div className={styles.confirmation_actions}>
            {!hideCancel && (
              <Button
                variant="outline"
                size="large"
                color={buttonColor}
                onClick={onClickCancel}
              >
                {cancelText}
              </Button>
            )}
            {!hideConfirm && (
              <Button size="large" color={buttonColor} onClick={onClickConfirm}>
                {confirmText}
              </Button>
            )}
          </div>
        )}
      </div>
    </FocusTrap>
  );
};
