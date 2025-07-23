import { FieldComponentProps, FieldAdditionalProps } from "../../types";

export function TextareaField({
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (setValue) {
      setValue(name, e.target.value, { shouldValidate: true });
    }
  };

  // Extract specific props for textarea field
  const {
    rows,
    cols,
    autoComplete,
    autoFocus,
    maxLength,
    minLength,
    readOnly,
    tabIndex,
    onFocus,
    onBlur,
    onChange: customOnChange,
    ...otherAdditionalProps
  } = additionalProps;

  const textareaProps = {
    id: name,
    name,
    value,
    onChange: handleChange,
    placeholder,
    rows: rows || 4,
    cols,
    autoComplete,
    autoFocus,
    maxLength,
    minLength,
    readOnly,
    tabIndex,
    onFocus,
    onBlur,
    className:
      className ||
      `
      w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      disabled:bg-gray-50 disabled:text-gray-500 resize-vertical
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

      <textarea {...textareaProps} />

      {description && <p className="text-sm text-gray-500">{description}</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
