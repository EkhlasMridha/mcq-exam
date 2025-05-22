import type { HtmlHTMLAttributes, ReactNode } from "react";
import type { RenderModalProps } from "./modal-engine";
import type { TemplateConfig } from "./head-foot-modal-template/types";
import type { ConfirmationModalProps } from "./confirmation-modal";

export interface OpenModalParams
  extends Omit<RenderModalProps, "className" | "component">,
    Pick<HtmlHTMLAttributes<HTMLDivElement>, "className" | "style"> {
  component: ReactNode;
}
export interface ModalInjectedProps {
  onClose: () => void;
  isClosing: boolean;
}

export interface OpenTemplateModalParams extends OpenModalParams {
  templateConfig: TemplateConfig;
}

export interface OpenConfirmationModalParams
  extends Omit<OpenModalParams, "component"> {
  confirmationConfig?: Omit<ConfirmationModalProps, "className" | "style">;
}
