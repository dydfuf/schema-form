import { FieldComponentProps } from "../../types";
import { getEnumOptions } from "../../utils/schema-parser";

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
  const { register } = form;
  const options = getEnumOptions(schema) || [];

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
        {...register(name)}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500
          ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : ""
          }
          ${className || ""}
        `.trim()}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {description && <p className="text-sm text-gray-500">{description}</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
