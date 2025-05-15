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

    const { handleSubmit } = internalForm;

    const onFormError = (errors: any) => {
      let keys = Object.keys(errors ?? {}).map((key) => key);
      if (keys?.length > 0) {
        let dom = document?.querySelector(`[data-name="${keys[0]}"]`);
        dom?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    const handleFormSubmit = (data: any, event?: React.BaseSyntheticEvent) => {
      onFormSubmit && onFormSubmit({ ...data }, event);
    };

    return (
      <FormProvider {...internalForm}>
        <form
          {...restProps}
          onSubmit={handleSubmit(handleFormSubmit, (errors) =>
            onFormError(errors)
          )}
        >
          {children}
        </form>
      </FormProvider>
    );
  }
);
