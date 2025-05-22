import type { HtmlHTMLAttributes, ReactNode } from "react";
import type { RenderModalProps } from "./modal-engine";
import type { TemplateConfig } from "./head-foot-modal-template/types";

export interface OpenModalParams
  extends Omit<RenderModalProps, "className" | "component">,
    Pick<HtmlHTMLAttributes<HTMLDivElement>, "className" | "style"> {
  component: ReactNode;
}
export interface ModalInjectedProps {
  onClose?: () => void;
}

export interface OpenTemplateModalParams extends OpenModalParams {
  templateConfig: TemplateConfig;
}
