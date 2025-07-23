import { FieldComponentProps, FieldAdditionalProps } from "../../types";
import { parseSchema } from "../../utils/schema-parser";
import { FieldRenderer } from "../FieldRenderer";
import { ErrorMessageComponent } from "../../utils/error-handling";

export function TupleField({
  name,
  form,
  schema,
  label,
  description,
  error,
}: FieldComponentProps & FieldAdditionalProps) {
  const { watch, setValue } = form || {};

  // Get tuple items from schema
  const tupleSchema = schema as any;
  const items = tupleSchema._def?.items || [];

  // Use controlled component approach
  const value = watch ? watch(name) || [] : [];

  const handleItemChange = (index: number, newValue: any) => {
    if (setValue) {
      const updatedValue = [...value];
      updatedValue[index] = newValue;
      setValue(name, updatedValue, { shouldValidate: true });
    }
  };

  // Define default values for tuple-specific props
  const itemLabels: string[] = [];

  // Use vertical layout as default (simplified to avoid type comparison issues)
  const containerClassName = "space-y-4";

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className={containerClassName}>
        {items.map((itemSchema: any, index: number) => {
          const itemName = `${name}.${index}`;
          const itemLabel = itemLabels[index] || `Item ${index + 1}`;
          const itemValue = value[index];

          // Parse the item schema to get field information
          const parsedFields = parseSchema(itemSchema, String(index), name);
          const fieldInfo = parsedFields[0];

          if (!fieldInfo) {
            return (
              <div key={index} className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {itemLabel}
                </label>
                <input
                  type="text"
                  value={itemValue || ""}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            );
          }

          return (
            <div key={index}>
              <FieldRenderer
                schema={itemSchema}
                name={itemName}
                form={{
                  ...form,
                  watch: () => itemValue,
                  setValue: (_name: string, value: any, _options?: any) => {
                    handleItemChange(index, value);
                  },
                }}
                label={itemLabel}
                {...(fieldInfo.meta || {})}
              />
            </div>
          );
        })}
      </div>

      {description && <p className="text-sm text-gray-500">{description}</p>}

      <ErrorMessageComponent error={error} />
    </div>
  );
}
