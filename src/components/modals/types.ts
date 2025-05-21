import type { HtmlHTMLAttributes, ReactNode } from "react";
import type { RenderModalProps } from "./modal-engine";

export interface OpenModalParams
  extends Omit<RenderModalProps, "className" | "component">,
    Pick<HtmlHTMLAttributes<HTMLDivElement>, "className" | "style"> {
  component: ReactNode;
}
export interface ModalInjectedProps {
  onClose?: () => void;
}
