import { FieldComponentProps } from "../../types";
import { FieldRenderer } from "../FieldRenderer";
import { z } from "zod";
import { useFieldArray } from "react-hook-form";

export function ArrayField({
  name,
  form,
  schema,
  label,
  description,
  className,
  error,
  ...additionalProps
}: FieldComponentProps & Record<string, any>) {
  const { control } = form || {};

  // Use react-hook-form's useFieldArray for array management
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  // Parse the array schema to get the element type
  const unwrappedSchema =
    schema instanceof z.ZodOptional ||
    schema instanceof z.ZodNullable ||
    schema instanceof z.ZodDefault
      ? (schema as any)._def.innerType
      : schema;

  if (!(unwrappedSchema instanceof z.ZodArray)) {
    return (
      <div className={`mb-4 ${className || ""}`}>
        <div className="text-red-500">Invalid array schema</div>
      </div>
    );
  }

  const elementSchema = unwrappedSchema.element;

  // Extract meta props
  const { props: metaProps = {}, ...otherAdditionalProps } = additionalProps;
  const { addButtonText = "Add Item", removeButtonText = "Remove" } = metaProps;

  const handleAddItem = () => {
    // Add a default value based on the element schema type
    let defaultValue: any = "";

    if (elementSchema instanceof z.ZodString) {
      defaultValue = "";
    } else if (elementSchema instanceof z.ZodNumber) {
      defaultValue = 0;
    } else if (elementSchema instanceof z.ZodBoolean) {
      defaultValue = false;
    } else if (elementSchema instanceof z.ZodObject) {
      defaultValue = {};
    } else if (elementSchema instanceof z.ZodArray) {
      defaultValue = [];
    }

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

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {typeof error === "string"
            ? error
            : (error as any)?.message || "Validation error"}
        </div>
      )}
    </div>
  );
}
