import { FieldComponentProps } from "../../types";
import { unwrapSchema } from "../../utils/schema-parser";

export function StringField({
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

  // Check if it's a textarea (multiline string)
  const isTextarea =
    unwrapped._def?.checks?.some(
      (check: any) => check.kind === "min" && check.value > 100
    ) || false;

  const inputProps = {
    ...register(name),
    placeholder,
    className: `
      w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      disabled:bg-gray-50 disabled:text-gray-500
      ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
      ${className || ""}
    `.trim(),
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

      {isTextarea ? (
        <textarea id={name} rows={4} {...inputProps} />
      ) : (
        <input id={name} type="text" {...inputProps} />
      )}

      {description && <p className="text-sm text-gray-500">{description}</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
