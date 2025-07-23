import { FieldComponentProps } from "../../types";

export function BooleanField({
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
  const value = watch ? watch(name) || false : false;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setValue) {
      setValue(name, e.target.checked, { shouldValidate: true });
    }
  };

  // Extract meta props
  const { props: metaProps = {}, ...otherAdditionalProps } = additionalProps;
  const { ...restMetaProps } = metaProps;

  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={value}
          onChange={handleChange}
          className={
            className ||
            `
            h-4 w-4 text-blue-600 border-gray-300 rounded 
            focus:ring-2 focus:ring-blue-500
            ${error ? "border-red-500 focus:ring-red-500" : ""}
          `.trim()
          }
          {...restMetaProps}
          {...otherAdditionalProps}
        />
        {label && (
          <label
            htmlFor={name}
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>

      {description && <p className="text-sm text-gray-500">{description}</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
