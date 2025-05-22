import type { CSSProperties, ReactElement } from "react";

export interface ConfirmationModalProps {
  className?: string;
  style?: CSSProperties;
  icon?: ReactElement<any, any>;
  titleText?: string;
  description?: string;
  onConfirm?: () => Promise<any> | void;
  onCancel?: () => Promise<any> | void;
  hideConfirm?: string;
  hideCancel?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationModalVariant;
}

export type ConfirmationModalVariant = "info" | "warn" | "error";
