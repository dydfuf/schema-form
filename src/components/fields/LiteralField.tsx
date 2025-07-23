import { FieldComponentProps } from "../../types";

export function LiteralField({
  name,
  schema,
  label,
  description,
  className,
  ...additionalProps
}: FieldComponentProps & Record<string, any>) {
  // Get the literal value from the schema
  const literalValue = (schema as any)._def?.value;

  // Extract meta props
  const { props: metaProps = {}, ...otherAdditionalProps } = additionalProps;
  const { as = "p", ...restMetaProps } = metaProps;

  const displayValue = literalValue !== undefined ? String(literalValue) : "";

  const containerProps = {
    className:
      className ||
      `
      w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md
      text-gray-700 text-sm
    `.trim(),
    ...restMetaProps,
    ...otherAdditionalProps,
  };

  const renderContent = () => {
    if (as === "div") {
      return <div {...containerProps}>{displayValue}</div>;
    }
    if (as === "span") {
      return <span {...containerProps}>{displayValue}</span>;
    }
    if (as === "code") {
      return (
        <code
          {...containerProps}
          className={`
            ${containerProps.className}
            font-mono bg-gray-100 border-gray-300
          `.trim()}
        >
          {displayValue}
        </code>
      );
    }
    // Default to paragraph
    return <p {...containerProps}>{displayValue}</p>;
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {renderContent()}

      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
}
