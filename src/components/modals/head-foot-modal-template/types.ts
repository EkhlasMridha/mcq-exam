import type { ButtonProps } from "components/button/types";
import type { HtmlHTMLAttributes, ReactNode } from "react";

export type HeadFootModalTemplateProps = Pick<
  HtmlHTMLAttributes<HTMLDivElement>,
  "className" | "children" | "style"
> &
  TemplateConfig;

export interface TemplateConfig {
  secondaryButtonProps?: Omit<ButtonProps, "children">;
  primaryButtonProps?: Omit<ButtonProps, "children">;
  header: ReactNode;
  footerAddonLeft?: ReactNode;
  bodyClassNames?: string;
  headerClassNames?: string;
  footerClassNames?: string;
  hidePrimaryButton?: boolean;
  hideSecondaryButton?: string;
  closeOnSecondaryClick?: boolean;
  closeOnPrimaryClick?: boolean;
}
