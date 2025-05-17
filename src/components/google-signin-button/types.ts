import type { UseGoogleLoginOptionsImplicitFlow } from "@react-oauth/google";
import type { ButtonProps } from "components/button/types";

export interface GoogleSinginButtonProps
  extends Omit<ButtonProps, "onClick" | "icon" | "onError"> {
  googleOptions?: UseGoogleLoginOptionsImplicitFlow;
}
