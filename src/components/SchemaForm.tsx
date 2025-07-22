import { SchemaFormProps, ZodSchema } from "../types";
import { useSchemaForm, useSchemaFormSubmit } from "../hooks/useSchemaForm";
import { parseSchema } from "../utils/schema-parser";
import { FieldRenderer } from "./FieldRenderer";

export function SchemaForm<T extends ZodSchema>({
  schema,
  onSubmit,
  defaultValues,
  className,
  children,
  fieldRenderers,
  submitButton,
  resetButton,
}: SchemaFormProps<T>) {
  const { form, errors, isSubmitting, isValid } = useSchemaForm({
    schema,
    defaultValues: defaultValues as any,
  });

  const handleSubmit = useSchemaFormSubmit(form, onSubmit);
  const fields = parseSchema(schema);

  const renderSubmitButton = () => {
    if (submitButton) {
      if (typeof submitButton === "function") {
        return submitButton(isSubmitting, isValid);
      }
      return submitButton;
    }

    return (
      <button
        type="submit"
        disabled={isSubmitting}
        className="
          px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm
          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:bg-gray-400 disabled:cursor-not-allowed
        "
      >
        {isSubmitting ? "제출 중..." : "제출"}
      </button>
    );
  };

  const renderResetButton = () => {
    if (resetButton) {
      if (typeof resetButton === "function") {
        return resetButton(form.reset);
      }
      return resetButton;
    }

    return (
      <button
        type="button"
        onClick={() => form.reset()}
        className="
          px-4 py-2 bg-gray-600 text-white rounded-md shadow-sm
          hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500
        "
      >
        초기화
      </button>
    );
  };

  const renderField = (field: any) => {
    // Skip nested fields as they will be rendered by their parent
    if (field.name.includes(".")) {
      return null;
    }

    return (
      <FieldRenderer
        key={field.name}
        name={field.name}
        form={form as any}
        schema={field.schema}
        label={field.label || field.name}
        required={field.required}
        error={errors[field.name]}
        customRenderers={fieldRenderers}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className || ""}`}>
      {/* Render form fields */}
      <div className="space-y-4">{fields.map(renderField)}</div>

      {/* Custom children */}
      {children}

      {/* Form actions */}
      <div className="flex space-x-3">
        {renderSubmitButton()}
        {renderResetButton()}
      </div>
    </form>
  );
}
