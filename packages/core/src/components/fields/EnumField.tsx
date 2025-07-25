import { FieldComponentProps } from "../../types";
import { getEnumOptions } from "../../utils/schema-parser";
import {
  getBaseInputClasses,
  getErrorAriaAttributes,
  ErrorMessageComponent,
} from "../../utils/error-handling";

export function EnumField({
  name,
  form,
  schema,
  label,
  placeholder,
  description,
  className,
  error,
}: FieldComponentProps) {
  const { watch, setValue } = form;
  const options = getEnumOptions(schema) || [];
  const value = watch(name) || "";

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

      <select
        id={name}
        value={value}
        onChange={(e) =>
          setValue(name, e.target.value, { shouldValidate: true })
        }
        className={getBaseInputClasses(error, className)}
        {...getErrorAriaAttributes(error, name)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {description && <p className="text-sm text-gray-500">{description}</p>}

      <ErrorMessageComponent error={error} />
    </div>
  );
}
