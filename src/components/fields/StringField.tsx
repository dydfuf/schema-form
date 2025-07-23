import { FieldComponentProps, FieldAdditionalProps } from "../../types";
import { unwrapSchema } from "../../utils/schema-parser";
import {
  getBaseInputClasses,
  getErrorAriaAttributes,
  ErrorMessageComponent,
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
  const { watch, setValue } = form || {};

  // Use controlled component approach to avoid ref issues
  const value = watch ? watch(name) || "" : "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (setValue) {
      setValue(name, e.target.value, { shouldValidate: true });
    }
  };

  const unwrapped = unwrapSchema(schema);

  // Check if it's a textarea (multiline string)
  const zodDef = (unwrapped as any)._def;
  const isTextarea =
    zodDef?.checks?.some(
      (check: any) => check.kind === "min" && check.value > 100
    ) || false;

  // Extract specific props for string field
  const {
    autoComplete,
    autoFocus,
    maxLength,
    minLength,
    pattern,
    readOnly,
    tabIndex,
    rows,
    onFocus,
    onBlur,
    onChange: customOnChange,
    ...otherAdditionalProps
  } = additionalProps;

  // Default type for string field
  const type = "text";

  // Determine if it should be a textarea based on schema or rows prop
  const shouldBeTextarea = isTextarea || (rows && rows > 1);

  const inputProps = {
    id: name,
    name,
    value,
    onChange: handleChange,
    placeholder,
    type: shouldBeTextarea ? undefined : type,
    rows: shouldBeTextarea ? rows || 4 : undefined,
    className: className || getBaseInputClasses(error),
    autoComplete,
    autoFocus,
    maxLength,
    minLength,
    pattern,
    readOnly,
    tabIndex,
    onFocus,
    onBlur,
    ...getErrorAriaAttributes(error, name),
    ...otherAdditionalProps,
  };

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

      {shouldBeTextarea ? (
        <textarea {...inputProps} />
      ) : (
        <input {...inputProps} />
      )}

      {description && <p className="text-sm text-gray-500">{description}</p>}

      <ErrorMessageComponent error={error} />
    </div>
  );
}
