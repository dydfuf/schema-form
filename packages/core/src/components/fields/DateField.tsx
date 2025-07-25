import { FieldComponentProps } from "../../types";
import {
  getBaseInputClasses,
  getErrorAriaAttributes,
  ErrorMessageComponent,
} from "../../utils/error-handling";

export function DateField({
  name,
  form,
  label,
  placeholder,
  description,
  className,
  error,
}: FieldComponentProps) {
  const { watch, setValue } = form;
  const value = watch(name);

  // Convert Date to string for input value
  const inputValue =
    value instanceof Date ? value.toISOString().split("T")[0] : value || "";

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

      <input
        id={name}
        type="date"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          const dateValue = e.target.value
            ? new Date(e.target.value)
            : undefined;
          setValue(name, dateValue, { shouldValidate: true });
        }}
        className={getBaseInputClasses(error, className)}
        {...getErrorAriaAttributes(error, name)}
      />

      {description && <p className="text-sm text-gray-500">{description}</p>}

      <ErrorMessageComponent error={error} />
    </div>
  );
}
