import { SchemaFormProps, ZodSchema } from "../types";
import { useSchemaForm, useSchemaFormSubmit } from "../hooks/useSchemaForm";
import { parseSchema } from "../utils/schema-parser";
import { FieldRenderer } from "./FieldRenderer";
import { isFunction } from "es-toolkit";

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
      return isFunction(submitButton) 
        ? submitButton(isSubmitting, isValid)
        : submitButton;
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
      return isFunction(resetButton)
        ? resetButton(form.reset)
        : resetButton;
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
