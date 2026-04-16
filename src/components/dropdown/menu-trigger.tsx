import { type PopupInjectedProps, usePopupContext } from "components/popup";
import { Button, type ButtonProps } from "components/button";
import { DropdownIndicatorIcon } from "components/icons";
import { type CSSProperties, forwardRef, useRef } from "react";
import { mergeRefs } from "./utils";

type MenuTriggerProps = ButtonProps;
type InternalMenuTriggerProps = MenuTriggerProps & PopupInjectedProps;
export const MenuTrigger = forwardRef<any, MenuTriggerProps>((props, ref) => {
  const { children, ...restProps } = props as InternalMenuTriggerProps;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mergedRef = mergeRefs(buttonRef, ref);
  const context = usePopupContext();

  const carretStyles: CSSProperties = {};
  if (context.isOpen) {
    carretStyles.transform = "rotate(180deg)";
  }

  if (!context.isOpen) {
    buttonRef.current?.focus();
  }

  return (
    <Button
      {...restProps}
      icon={
        <DropdownIndicatorIcon
          style={{
            ...carretStyles,
            transition: "all 0.2s ease-in-out",
            width: 14,
          }}
        />
      }
      iconPosition="end"
      ref={mergedRef}
    >
      {children}
    </Button>
  );
});
