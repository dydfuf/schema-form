import {
  useForm,
  UseFormProps,
  UseFormReturn,
  FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useCallback } from "react";
import { isUndefined } from "es-toolkit";
import { ZodSchema, InferredType, UseSchemaFormReturn } from "../types";
import { parseSchema, getDefaultValue } from "../utils/schema-parser";

export interface UseSchemaFormOptions<T extends ZodSchema>
  extends Omit<UseFormProps<FieldValues>, "resolver"> {
  schema: T;
}

/**
 * Custom hook that integrates react-hook-form with Zod schema validation
 */
export function useSchemaForm<T extends ZodSchema>({
  schema,
  defaultValues,
  ...formOptions
}: UseSchemaFormOptions<T>): UseSchemaFormReturn<T> {
  // Cache parsed fields to avoid re-parsing on every render
  const parsedFields = useMemo(() => parseSchema(schema), [schema]);

  // Parse schema to extract default values if not provided
  const computedDefaultValues = useMemo(() => {
    if (defaultValues) {
      return defaultValues;
    }

    const defaults: Record<string, any> = {};

    parsedFields.forEach((field) => {
      const defaultValue = getDefaultValue(field.schema);
      if (!isUndefined(defaultValue)) {
        // Handle nested field paths (e.g., "user.name")
        const keys = field.name.split(".");
        let current = defaults;

        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (!(key in current)) {
            current[key] = {} as Record<string, any>;
          }
          current = current[key] as Record<string, any>;
        }

        current[keys[keys.length - 1]] = defaultValue;
      }
    });

    return defaults;
  }, [parsedFields, defaultValues]);

  // Initialize react-hook-form with zodResolver
  const form = useForm<FieldValues>({
    resolver: zodResolver(schema as any),
    defaultValues: computedDefaultValues,
    mode: "onChange",
    ...formOptions,
  });

  // Extract form state
  const { formState } = form;
  const { isSubmitting, isValid, errors } = formState;

  // Convert react-hook-form errors to a flat object with optimized memoization
  const flatErrors = useMemo(() => {
    // Early return if no errors
    if (!errors || Object.keys(errors).length === 0) {
      return {};
    }

    const flatErrorsObj: Record<string, string> = {};

    const flattenErrors = (errorsObj: any, prefix = "") => {
      Object.entries(errorsObj).forEach(([key, error]) => {
        const fieldPath = prefix ? `${prefix}.${key}` : key;

        if (error && typeof error === "object") {
          if ("message" in error) {
            flatErrorsObj[fieldPath] = error.message as string;
          } else {
            // Nested errors
            flattenErrors(error, fieldPath);
          }
        }
      });
    };

    flattenErrors(errors);
    return flatErrorsObj;
  }, [errors]);

  return {
    form,
    schema,
    isSubmitting,
    isValid,
    errors: flatErrors,
  };
}

/**
 * Hook for handling form submission with proper error handling
 */
export function useSchemaFormSubmit<T extends ZodSchema>(
  form: UseFormReturn<FieldValues>,
  onSubmit: (data: InferredType<T>) => void | Promise<void>
) {
  return useCallback(
    form.handleSubmit(async (data) => {
      try {
        await onSubmit(data as InferredType<T>);
      } catch (error) {
        console.error("Form submission error:", error);
        // You can add custom error handling here
        // For example, setting form errors or showing notifications
      }
    }),
    [form, onSubmit]
  );
}
