import { FieldComponentProps, FieldAdditionalProps } from "../../types";
import {
  BaseInputField,
  useInputField,
  extractInputProps,
} from "./BaseInputField";
import {
  getBaseInputClasses,
  getErrorAriaAttributes,
} from "../../utils/error-handling";

export function TextareaField({
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
  const { value, handleChange } = useInputField(name, form);

  const { commonProps, otherProps } = extractInputProps(additionalProps);
  const { rows, cols, ...restProps } = otherProps;

  const textareaProps = {
    id: name,
    name,
    value,
    onChange: handleChange,
    placeholder,
    rows: rows || 4,
    cols,
    className: className || `${getBaseInputClasses(error)} resize-vertical`,
    ...getErrorAriaAttributes(error, name),
    ...commonProps,
    ...restProps,
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
