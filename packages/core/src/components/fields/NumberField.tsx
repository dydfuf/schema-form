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

export function NumberField({
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
  const { value, handleNumberChange } = useInputField(name, form);

  // Extract constraints from schema
  const zodDef = (schema as any)?._def;
  const isInteger =
    zodDef?.typeName === "ZodNumber" &&
    zodDef?.checks?.some((check: any) => check.kind === "int");
  const min = zodDef?.checks?.find((check: any) => check.kind === "min")?.value;
  const max = zodDef?.checks?.find((check: any) => check.kind === "max")?.value;

  const { commonProps, otherProps } = extractInputProps(additionalProps);
  const { step, ...restProps } = otherProps;

  const inputProps = {
    id: name,
    name,
    type: "number",
    value,
    onChange: handleNumberChange,
    placeholder,
    step: step || (isInteger ? 1 : "any"),
    min,
    max,
    className: className || getBaseInputClasses(error),
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
      renderInput={() => <input {...inputProps} />}
    />
  );
}
