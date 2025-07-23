import { FieldComponentProps, FieldAdditionalProps } from "../../types";
import {
  getBaseInputClasses,
  getErrorAriaAttributes,
  ErrorMessageComponent,
} from "../../utils/error-handling";

export function EmailField({
  name,
  form,
  schema,
  label,
  placeholder,
  description,
  className,
  error,
  ...additionalProps
}: FieldComponentProps & FieldAdditionalProps) {
  const { watch, setValue } = form || {};

  // Use controlled component approach to avoid ref issues
  const value = watch ? watch(name) || "" : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setValue) {
      setValue(name, e.target.value, { shouldValidate: true });
    }
  };

  // Extract specific props for email field
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
    type: "email",
    value,
    onChange: handleChange,
    placeholder: placeholder || "Enter your email address",
    autoComplete: autoComplete || "email",
    autoFocus,
    maxLength,
    minLength,
    pattern,
    readOnly,
    tabIndex,
    onFocus,
    onBlur,
    className: className || getBaseInputClasses(error),
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

      <input {...inputProps} />

      {description && <p className="text-sm text-gray-500">{description}</p>}

      <ErrorMessageComponent error={error} />
    </div>
  );
}
