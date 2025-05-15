import {
  Controller,
  useFormContext,
  type ControllerProps,
} from "react-hook-form";
import type { HookFormItemProps, RenderControllParamType } from "./types";
import { getErrorMessage } from "./utils";
import { FormItemLabel } from "./formitem-label";
import { Children, cloneElement, isValidElement } from "react";

export const HookFormItem = ({
  className,
  label,
  labelClassName,
  name,
  style,
  valuePropName = "value",
  rtl,
  children,
  disabled,
  hidden,
}: HookFormItemProps) => {
  if (Children.count(children) !== 1 || !isValidElement(children)) {
    console.warn(
      "HookFormItem expects exactly one valid React element as a child."
    );
    return null;
  }

  const {
    formState: { errors },
    control,
  } = useFormContext();

  console.log(errors?.[name ?? ""]);

  const messageList = getErrorMessage(errors?.[name ?? ""]);
  console.log("MSG: ", messageList);
  const errorMessage = messageList && messageList.join(", ").trim();
  const classNames = ["hookform-item", className];
  rtl && classNames.unshift("hookform-item-rtl");

  const renderControllerElement = ({
    field,
  }: RenderControllParamType): ReturnType<ControllerProps["render"]> => {
    const child = Children.only(children);

    if (!isValidElement(child)) return <></>;

    const { onChange, ...restProps } = child.props as any;

    const onChangeControllValue = (value: any) => {
      field?.onChange(value);
      !!onChange && onChange(value);
    };

    const controllProps: any = {
      ...restProps,
      isError: !!errorMessage,
      name: name,
      onChange: onChangeControllValue,
      [valuePropName]: field?.value,
      hidden: hidden,
    };
    const isFieldDisabled = field?.disabled || disabled;

    if (isFieldDisabled) controllProps.disabled = isFieldDisabled;

    return cloneElement(child, controllProps);
  };

  return (
    <div className={classNames.join(" ")} style={style} data-name={name ?? ""}>
      <FormItemLabel label={label} labelClassName={labelClassName} />
      <div className="hookform-controll-container">
        {!!name ? (
          <Controller
            name={name}
            control={control}
            render={renderControllerElement}
          />
        ) : (
          children
        )}
        <div className="hookform-error-container">
          {!!errorMessage && (
            <span className="hookform-error">{errorMessage}</span>
          )}
        </div>
      </div>
    </div>
  );
};
