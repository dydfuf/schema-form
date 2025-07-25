import { FieldComponentProps, FieldAdditionalProps } from "../../types";
import { BaseInputField } from "./BaseInputField";

export function EmailField({
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
      type="email"
      defaultPlaceholder="Enter your email"
      defaultAutoComplete="email"
      {...additionalProps}
    />
  );
}
