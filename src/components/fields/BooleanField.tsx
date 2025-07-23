import { FieldComponentProps, FieldAdditionalProps } from "../../types";
import {
  getErrorInputClasses,
  getErrorAriaAttributes,
  ErrorMessageComponent,
} from "../../utils/error-handling";

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
}: FieldComponentProps & FieldAdditionalProps) {
  const { watch, setValue } = form || {};

  // Use controlled component approach to avoid ref issues
  const value = watch ? watch(name) || false : false;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setValue) {
      setValue(name, e.target.checked, { shouldValidate: true });
    }
  };

  // Extract specific props for boolean field
  const {
    autoFocus,
    readOnly,
    tabIndex,
    onFocus,
    onBlur,
    onChange: customOnChange,
    ...otherAdditionalProps
  } = additionalProps;

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
            `h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 ${getErrorInputClasses(
              error
            )}`.trim()
          }
          autoFocus={autoFocus}
          readOnly={readOnly}
          tabIndex={tabIndex}
          onFocus={onFocus}
          onBlur={onBlur}
          {...getErrorAriaAttributes(error, name)}
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

      <ErrorMessageComponent error={error} />
    </div>
  );
}
