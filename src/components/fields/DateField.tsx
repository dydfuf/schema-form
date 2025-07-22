import { FieldComponentProps } from "../../types";

export function DateField({
  name,
  form,
  label,
  placeholder,
  description,
  className,
  error,
}: FieldComponentProps) {
  const { register } = form;

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
        {...register(name, {
          valueAsDate: true,
          setValueAs: (value: string) => (value ? new Date(value) : undefined),
        })}
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
