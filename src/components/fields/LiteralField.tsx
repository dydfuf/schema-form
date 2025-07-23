import { FieldComponentProps, FieldAdditionalProps } from "../../types";

export function LiteralField({
  name,
  schema,
  label,
  description,
  className,
  ...additionalProps
}: FieldComponentProps & FieldAdditionalProps) {
  // Get the literal value from the schema
  const literalValue = (schema as any)._def?.value;

  // Extract specific props that are valid for display elements
  const {
    tabIndex,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedby,
    "aria-invalid": ariaInvalid,
    // Filter out form-specific props that don't belong on display elements
    form,
    placeholder,
    required,
    disabled,
    readOnly,
    autoFocus,
    autoComplete,
    maxLength,
    minLength,
    pattern,
    step,
    min,
    max,
    multiple,
    size,
    rows,
    cols,
    onChange,
    onFocus,
    onBlur,
    ...dataAttributes
  } = additionalProps;

  const displayValue = literalValue !== undefined ? String(literalValue) : "";

  const containerProps = {
    className:
      className ||
      `
      w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md
      text-gray-700 text-sm
    `.trim(),
    tabIndex,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedby,
    "aria-invalid": ariaInvalid,
    ...dataAttributes,
  };

  // Always render as paragraph for literal fields
  const renderContent = () => {
    return <p {...containerProps}>{displayValue}</p>;
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {renderContent()}

      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
}
