import React from "react";
import { FieldComponentProps, FieldAdditionalProps } from "../../types";
import {
  getBaseInputClasses,
  getErrorAriaAttributes,
  ErrorMessageComponent,
} from "../../utils/error-handling";

export interface BaseInputFieldProps
  extends Omit<FieldComponentProps, "schema">,
    FieldAdditionalProps {
  schema?: FieldComponentProps["schema"];
  type?: string;
  defaultPlaceholder?: string;
  defaultAutoComplete?: string;
  children?: React.ReactNode;
  inputClassName?: string;
  renderInput?: (props: any) => React.ReactElement;
}

export function BaseInputField({
  name,
  form,
  label,
  placeholder,
  description,
  className,
  error,
  type = "text",
  defaultPlaceholder,
  defaultAutoComplete,
  children,
  inputClassName,
  renderInput,
  ...additionalProps
}: BaseInputFieldProps) {
  const { watch, setValue } = form || {};

  // Use controlled component approach to avoid ref issues
  const value = watch ? watch(name) || "" : "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (setValue) {
      setValue(name, e.target.value, { shouldValidate: true });
    }
  };

  // Extract common input props
  const {
    autoComplete,
    autoFocus,
    maxLength,
    minLength,
    pattern,
    readOnly,
    tabIndex,
    onFocus,
    onBlur,
    onChange: customOnChange,
    ...otherAdditionalProps
  } = additionalProps;

  const inputProps = {
    id: name,
    name,
    type,
    value,
    onChange: handleChange,
    placeholder: placeholder || defaultPlaceholder,
    autoComplete: autoComplete || defaultAutoComplete,
    autoFocus,
    maxLength,
    minLength,
    pattern,
    readOnly,
    tabIndex,
    onFocus,
    onBlur,
    className: inputClassName || className || getBaseInputClasses(error),
    ...getErrorAriaAttributes(error, name),
    ...otherAdditionalProps,
  };

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      {renderInput ? renderInput(inputProps) : <input {...inputProps} />}
      {children}

      {description && <p className="text-sm text-gray-500">{description}</p>}

      <ErrorMessageComponent error={error} />
    </div>
  );
}

// Hook for common input logic
export function useInputField(name: string, form: any) {
  const { watch, setValue } = form || {};
  const value = watch ? watch(name) || "" : "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (setValue) {
      setValue(name, e.target.value, { shouldValidate: true });
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setValue) {
      const numValue =
        e.target.value === "" ? undefined : Number(e.target.value);
      setValue(name, numValue, { shouldValidate: true });
    }
  };

  const handleBooleanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setValue) {
      setValue(name, e.target.checked, { shouldValidate: true });
    }
  };

  return {
    value,
    handleChange,
    handleNumberChange,
    handleBooleanChange,
  };
}

// Common props extraction utility
export function extractInputProps(additionalProps: FieldAdditionalProps) {
  const {
    autoComplete,
    autoFocus,
    maxLength,
    minLength,
    pattern,
    readOnly,
    tabIndex,
    onFocus,
    onBlur,
    onChange: customOnChange,
    ...otherProps
  } = additionalProps;

  return {
    commonProps: {
      autoComplete,
      autoFocus,
      maxLength,
      minLength,
      pattern,
      readOnly,
      tabIndex,
      onFocus,
      onBlur,
    },
    otherProps,
  };
}
