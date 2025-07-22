import { FieldComponentProps } from "../../types";
import { unwrapSchema } from "../../utils/schema-parser";

export function NumberField({
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
  const unwrapped = unwrapSchema(schema);

  // Determine if it's an integer or float
  const isInt =
    unwrapped._def?.checks?.some((check: any) => check.kind === "int") || false;

  // Get min/max values from schema
  const minValue = unwrapped._def?.checks?.find(
    (check: any) => check.kind === "min"
  )?.value;
  const maxValue = unwrapped._def?.checks?.find(
    (check: any) => check.kind === "max"
  )?.value;

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
        type="number"
        step={isInt ? "1" : "any"}
        min={minValue}
        max={maxValue}
        placeholder={placeholder}
        {...register(name, { valueAsNumber: true })}
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
      />

      {description && <p className="text-sm text-gray-500">{description}</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
