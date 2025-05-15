import type { zodResolver } from "@hookform/resolvers/zod";
import type {
  BaseSyntheticEvent,
  CSSProperties,
  FormHTMLAttributes,
  ReactNode,
} from "react";
import type {
  ControllerProps,
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  Message,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";

export interface HookFormProps
  extends Pick<
    FormHTMLAttributes<HTMLFormElement>,
    "style" | "className" | "children" | "id"
  > {
  initialValues?: UseFormProps["defaultValues"];
  zodSchema?: ZodParameters["0"];
  schemaOptions?: ZodParameters["1"];
  resolverOptions?: ZodParameters["2"];
  onFormSubmit?: (data: any, event?: BaseSyntheticEvent) => void;
}

export type UseFormType = UseFormReturn<
  {
    [x: string]: any;
  },
  any,
  FieldValues
>;

type ZodParameters = Parameters<typeof zodResolver>;

export type FieldErrorsType =
  | FieldError
  | Merge<FieldError, FieldErrorsImpl<any>>
  | Record<
      string,
      Partial<{
        type: string | number;
        message: Message;
      }>
    >;

export interface HookFormItemProps {
  name?: string;
  label?: string | (() => ReactNode);
  labelClassName?: string;
  className?: string;
  style?: CSSProperties;
  valuePropName?: string;
  rtl?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  hidden?: boolean;
}
export interface FormItemLabelProps
  extends Pick<HookFormItemProps, "label" | "labelClassName"> {}

export type RenderControllParamType = Parameters<
  ControllerProps["render"]
>["0"];
