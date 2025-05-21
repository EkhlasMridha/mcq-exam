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
}
export type OpenModalParams = Omit<RenderModalProps, "className">;

export interface ModalStackType
  extends Pick<RenderModalProps, "onClose" | "destroyOnClose"> {
  modalId: string;
  modalRoot: Root;
  visible?: boolean;
  modalWrapper: HTMLElement;
}

export interface ModalInjectedProps {
  onClose?: () => void;
}
