import type { CSSProperties, ReactElement } from "react";
import type { Root } from "react-dom/client";

export interface RenderModalProps {
  onClose?: () => void;
  component: ReactElement<any, any>;
  showBackdrop?: boolean;
  backdropClassNames?: string;
  backdropStyles?: CSSProperties;
  destroyOnClose?: boolean;
  maskClose?: boolean;
  className?: string;
  closeDelayInMs?: number;
}

export interface ModalStackType
  extends Pick<RenderModalProps, "onClose" | "destroyOnClose"> {
  modalId: string;
  modalRoot: Root;
  visible?: boolean;
  modalWrapper: HTMLElement;
  initiateClose: () => void;
  closeDelayInMs: number;
}
export interface ModalContentParams {
  backdropClassName?: string;
  isClosing?: boolean;
}

export interface DestroyOrCloseParams {
  closeInfoEmit?: boolean;
  modal: ModalStackType;
  destroy?: boolean;
}
