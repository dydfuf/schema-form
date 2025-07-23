import { useState } from "react";
import { FieldComponentProps } from "../../types";

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
}: FieldComponentProps & Record<string, any>) {
  const { watch, setValue } = form || {};
  const [showPassword, setShowPassword] = useState(false);

  // Use controlled component approach to avoid ref issues
  const value = watch ? watch(name) || "" : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setValue) {
      setValue(name, e.target.value, { shouldValidate: true });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Extract meta props
  const { props: metaProps = {}, ...otherAdditionalProps } = additionalProps;
  const {
    autoComplete = "current-password",
    showToggle = true,
    ...restMetaProps
  } = metaProps;

  const inputProps = {
    id: name,
    name,
    type: showPassword ? "text" : "password",
    value,
    onChange: handleChange,
    placeholder: placeholder || "Enter your password",
    autoComplete,
    className:
      className ||
      `
      w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      disabled:bg-gray-50 disabled:text-gray-500
      ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
    `.trim(),
    ...restMetaProps,
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

      <div className="relative">
        <input {...inputProps} />

        {showToggle && (
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
        )}
      </div>

      {description && <p className="text-sm text-gray-500">{description}</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
