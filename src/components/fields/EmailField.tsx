import { FieldComponentProps, FieldAdditionalProps } from "../../types";

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
    className:
      className ||
      `
      w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      disabled:bg-gray-50 disabled:text-gray-500
      ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
    `.trim(),
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

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
