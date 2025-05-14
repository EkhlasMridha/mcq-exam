import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle } from "react";
import {
  FormProvider,
  useForm,
  type FieldValues,
  type UseFormProps,
} from "react-hook-form";
import type { HookFormProps, UseFormType } from "./types";

export const HookForm = forwardRef<UseFormType, HookFormProps>(
  (
    {
      initialValues,
      resolverOptions = { raw: true },
      schemaOptions = {},
      zodSchema,
      onFormSubmit,
      children,
      ...restProps
    },
    ref
  ) => {
    const formOptions: UseFormProps = {
      defaultValues: initialValues,
    };

    if (!!zodSchema) {
      formOptions.resolver = zodResolver<FieldValues, any, any>(
        zodSchema,
        schemaOptions,
        resolverOptions
      );
    }

    const internalForm = useForm(formOptions);

    useImperativeHandle(ref, () => internalForm, [internalForm]);

    return (
      <FormProvider {...internalForm}>
        <form {...restProps}>{children}</form>
      </FormProvider>
    );
  }
);
