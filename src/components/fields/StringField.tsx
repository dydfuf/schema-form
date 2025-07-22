import { FieldComponentProps } from "../../types";
import { unwrapSchema } from "../../utils/schema-parser";

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
}: FieldComponentProps & Record<string, any>) {
  const { register } = form;
  const unwrapped = unwrapSchema(schema);

  // Check if it's a textarea (multiline string)
  const isTextarea =
    unwrapped._def?.checks?.some(
      (check: any) => check.kind === "min" && check.value > 100
    ) || false;

  // Extract meta props
  const { props: metaProps = {}, ...otherAdditionalProps } = additionalProps;
  const { as, type = "text", rows, ...restMetaProps } = metaProps;

  // Determine if it should be a textarea
  const shouldBeTextarea = as === "textarea" || isTextarea;

  const inputProps = {
    ...register(name),
    placeholder,
    type: shouldBeTextarea ? undefined : type,
    rows: shouldBeTextarea ? rows || 4 : undefined,
    className:
      className ||
      `
      w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      disabled:bg-gray-50 disabled:text-gray-500
      ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
    `.trim(),
    ...restMetaProps,
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
        <textarea id={name} {...inputProps} />
      ) : (
        <input id={name} {...inputProps} />
      )}

      {description && <p className="text-sm text-gray-500">{description}</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
