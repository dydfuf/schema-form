import { FieldComponentProps } from "../../types";

export function BooleanField({
  name,
  form,
  label,
  description,
  className,
  error,
}: FieldComponentProps) {
  const { register } = form;

  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <input
          id={name}
          type="checkbox"
          {...register(name)}
          className={`
            h-4 w-4 text-blue-600 border-gray-300 rounded 
            focus:ring-2 focus:ring-blue-500
            ${error ? "border-red-500" : ""}
            ${className || ""}
          `.trim()}
        />

        {label && (
          <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
      </div>

      {description && (
        <p className="text-sm text-gray-500 ml-6">{description}</p>
      )}

      {error && <p className="text-sm text-red-600 ml-6">{error}</p>}
    </div>
  );
}
