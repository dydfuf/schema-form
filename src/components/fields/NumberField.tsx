import { FieldComponentProps } from "../../types";
import { unwrapSchema } from "../../utils/schema-parser";

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
}: FieldComponentProps & Record<string, any>) {
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

  // Extract meta props
  const { props: metaProps = {}, ...otherAdditionalProps } = additionalProps;
  const { step, min, max, ...restMetaProps } = metaProps;

  // Determine number type and constraints
  const zodDef = (unwrapped as any)._def;
  const isInteger =
    zodDef?.typeName === "ZodNumber" &&
    zodDef?.checks?.some((check: any) => check.kind === "int");

  const minValue =
    zodDef?.checks?.find((check: any) => check.kind === "min")?.value ?? min;
  const maxValue =
    zodDef?.checks?.find((check: any) => check.kind === "max")?.value ?? max;

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
        step={step || (isInteger ? "1" : "any")}
        min={minValue}
        max={maxValue}
        placeholder={placeholder}
        className={
          className ||
          `
          w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500
          ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : ""
          }
        `.trim()
        }
        {...restMetaProps}
        {...otherAdditionalProps}
      />

      {description && <p className="text-sm text-gray-500">{description}</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
