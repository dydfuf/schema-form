import { FieldComponentProps, FieldAdditionalProps } from "../../types";
import { unwrapSchema } from "../../utils/schema-parser";
import {
  getBaseInputClasses,
  getErrorAriaAttributes,
  ErrorMessageComponent,
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
  const { watch, setValue } = form || {};

  // Use controlled component approach to avoid ref issues
  const value = watch ? watch(name) || "" : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setValue) {
      const numValue =
        e.target.value === "" ? undefined : Number(e.target.value);
      setValue(name, numValue, { shouldValidate: true });
    }
  };

  const unwrapped = unwrapSchema(schema);

  // Extract specific props for number field
  const {
    step: propStep,
    min: propMin,
    max: propMax,
    autoComplete,
    autoFocus,
    readOnly,
    tabIndex,
    onFocus,
    onBlur,
    onChange: customOnChange,
    ...otherAdditionalProps
  } = additionalProps;

  // Determine number type and constraints
  const zodDef = (unwrapped as any)._def;
  const isInteger =
    zodDef?.typeName === "ZodNumber" &&
    zodDef?.checks?.some((check: any) => check.kind === "int");

  const minValue =
    zodDef?.checks?.find((check: any) => check.kind === "min")?.value ??
    propMin;
  const maxValue =
    zodDef?.checks?.find((check: any) => check.kind === "max")?.value ??
    propMax;

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

      <input
        id={name}
        name={name}
        type="number"
        value={value}
        onChange={handleChange}
        step={propStep || (isInteger ? "1" : "any")}
        min={minValue}
        max={maxValue}
        placeholder={placeholder}
        className={className || getBaseInputClasses(error)}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        readOnly={readOnly}
        tabIndex={tabIndex}
        onFocus={onFocus}
        onBlur={onBlur}
        {...getErrorAriaAttributes(error, name)}
        {...otherAdditionalProps}
      />

      {description && <p className="text-sm text-gray-500">{description}</p>}

      <ErrorMessageComponent error={error} />
    </div>
  );
}
