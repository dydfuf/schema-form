import { FieldComponentProps, FieldAdditionalProps } from "../../types";
import { BaseInputField } from "./BaseInputField";
import {
  getBaseInputClasses,
  getErrorAriaAttributes,
} from "../../utils/error-handling";

export function StringField({
  name,
  form,
  schema,
  label,
  placeholder,
  description,
  className,
  error,
  ...additionalProps
}: FieldComponentProps & FieldAdditionalProps) {
  // Check if this should be a textarea based on schema or props
  const isTextarea =
    (schema as any)?.format === "textarea" || additionalProps.rows;

  if (isTextarea) {
    const { watch, setValue } = form || {};
    const value = watch ? watch(name) || "" : "";

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (setValue) {
        setValue(name, e.target.value, { shouldValidate: true });
      }
    };

    const {
      rows,
      cols,
      autoComplete,
      autoFocus,
      maxLength,
      minLength,
      readOnly,
      tabIndex,
      onFocus,
      onBlur,
      onChange: customOnChange,
      ...otherAdditionalProps
    } = additionalProps;

    const textareaProps = {
      id: name,
      name,
      value,
      onChange: handleChange,
      placeholder,
      rows: rows || 4,
      cols,
      autoComplete,
      autoFocus,
      maxLength,
      minLength,
      readOnly,
      tabIndex,
      onFocus,
      onBlur,
      className: className || `${getBaseInputClasses(error)} resize-vertical`,
      ...getErrorAriaAttributes(error, name),
      ...otherAdditionalProps,
    };

    return (
      <BaseInputField
        name={name}
        form={form}
        schema={schema}
        label={label}
        description={description}
        error={error}
        renderInput={() => <textarea {...textareaProps} />}
      />
    );
  }

  return (
    <BaseInputField
      name={name}
      form={form}
      schema={schema}
      label={label}
      placeholder={placeholder}
      description={description}
      className={className}
      error={error}
      type="text"
      {...additionalProps}
    />
  );
}
