import { useState } from "react";
import { FieldComponentProps, FieldAdditionalProps } from "../../types";
import {
  BaseInputField,
  useInputField,
  extractInputProps,
} from "./BaseInputField";
import {
  getBaseInputClasses,
  getErrorAriaAttributes,
} from "../../utils/error-handling";

export function PasswordField({
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
  const [showPassword, setShowPassword] = useState(false);
  const { value, handleChange } = useInputField(name, form);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { commonProps, otherProps } = extractInputProps(additionalProps);

  const inputProps = {
    id: name,
    name,
    type: showPassword ? "text" : "password",
    value,
    onChange: handleChange,
    placeholder: placeholder || "Enter your password",
    className: className || `${getBaseInputClasses(error)} pr-10`,
    ...getErrorAriaAttributes(error, name),
    ...commonProps,
    autoComplete: commonProps.autoComplete || "current-password",
    ...otherProps,
  };

  const toggleButton = (
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
      tabIndex={-1}
    >
      {showPassword ? (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
          />
        </svg>
      ) : (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      )}
    </button>
  );

  return (
    <BaseInputField
      name={name}
      form={form}
      schema={schema}
      label={label}
      description={description}
      error={error}
      renderInput={() => (
        <div className="relative">
          <input {...inputProps} />
          {toggleButton}
        </div>
      )}
    />
  );
}
