import { FieldComponentProps, FieldAdditionalProps } from "../../types";
import { FieldRenderer } from "../FieldRenderer";
import { z } from "zod";
import { useFieldArray } from "react-hook-form";
import { match } from "ts-pattern";
import { ErrorMessageComponent } from "../../utils/error-handling";
import { unwrapSchema, getZodTypeName } from "../../utils/schema-parser";

export function ArrayField({
  name,
  form,
  schema,
  label,
  description,
  className,
  error,
  ...additionalProps
}: FieldComponentProps & FieldAdditionalProps) {
  const { control } = form || {};

  // Use react-hook-form's useFieldArray for array management
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  // Parse the array schema to get the element type
  const unwrappedSchema = unwrapSchema(schema);

  if (!(unwrappedSchema instanceof z.ZodArray)) {
    return (
      <div className={`mb-4 ${className || ""}`}>
        <div className="text-red-500">Invalid array schema</div>
      </div>
    );
  }

  const elementSchema = unwrappedSchema.element;

  // Extract specific props for array field
  const { ...otherAdditionalProps } = additionalProps;

  // Default button texts
  const addButtonText = "Add Item";
  const removeButtonText = "Remove";

  const handleAddItem = () => {
    // Add a default value based on the element schema type
    const unwrappedElement = unwrapSchema(elementSchema as z.ZodTypeAny);
    const typeName = getZodTypeName(unwrappedElement);
    
    const defaultValue = match(typeName)
      .with("string", () => "")
      .with("number", "bigint", () => 0)
      .with("boolean", () => false)
      .with("object", () => ({}))
      .with("array", () => [])
      .with("date", () => new Date())
      .otherwise(() => "");

    append(defaultValue);
  };

  return (
    <div className={`mb-6 ${className || ""}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => {
          const fieldPath = `${name}.${index}`;
          const fieldError =
            form?.formState?.errors?.[name] &&
            Array.isArray(form.formState.errors[name])
              ? (form.formState.errors[name] as any[])[index]
              : undefined;

          return (
            <div
              key={field.id}
              className="flex items-start gap-2 p-3 border border-gray-200 rounded-md"
            >
              <div className="flex-1">
                <FieldRenderer
                  name={fieldPath}
                  form={form}
                  schema={elementSchema as z.ZodTypeAny}
                  label={`Item ${index + 1}`}
                  error={fieldError}
                  {...otherAdditionalProps}
                />
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                className="mt-6 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label={`${removeButtonText} item ${index + 1}`}
              >
                {removeButtonText}
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleAddItem}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {addButtonText}
      </button>

      <ErrorMessageComponent error={error} />
    </div>
  );
}
