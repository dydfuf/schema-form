import { useState } from "react";
import { FieldComponentProps } from "../../types";

export function RecordField({
  name,
  form,
  schema,
  label,
  description,
  className,
  error,
  ...additionalProps
}: FieldComponentProps & Record<string, any>) {
  const { watch, setValue } = form || {};

  // Use controlled component approach
  const value = watch ? watch(name) || {} : {};
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleAddPair = () => {
    if (newKey.trim() && setValue) {
      const updatedValue = {
        ...value,
        [newKey.trim()]: newValue,
      };
      setValue(name, updatedValue, { shouldValidate: true });
      setNewKey("");
      setNewValue("");
    }
  };

  const handleRemovePair = (keyToRemove: string) => {
    if (setValue) {
      const updatedValue = { ...value };
      delete updatedValue[keyToRemove];
      setValue(name, updatedValue, { shouldValidate: true });
    }
  };

  const handleUpdateValue = (key: string, newVal: string) => {
    if (setValue) {
      const updatedValue = {
        ...value,
        [key]: newVal,
      };
      setValue(name, updatedValue, { shouldValidate: true });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newKey.trim()) {
      e.preventDefault();
      handleAddPair();
    }
  };

  // Extract meta props
  const { props: metaProps = {}, ...otherAdditionalProps } = additionalProps;
  const {
    keyPlaceholder = "Key",
    valuePlaceholder = "Value",
    addButtonText = "Add",
    ...restMetaProps
  } = metaProps;

  const inputClassName = `
    px-3 py-2 border border-gray-300 rounded-md shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-50 disabled:text-gray-500
  `.trim();

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Existing pairs */}
      <div className="space-y-2">
        {Object.entries(value).map(([key, val]) => (
          <div key={key} className="flex items-center space-x-2">
            <input
              type="text"
              value={key}
              readOnly
              className={`${inputClassName} bg-gray-50 flex-1`}
            />
            <span className="text-gray-500">:</span>
            <input
              type="text"
              value={String(val)}
              onChange={(e) => handleUpdateValue(key, e.target.value)}
              className={`${inputClassName} flex-1`}
            />
            <button
              type="button"
              onClick={() => handleRemovePair(key)}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
              title="Remove"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Add new pair */}
      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
        <input
          type="text"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={keyPlaceholder}
          className={`${inputClassName} flex-1`}
        />
        <span className="text-gray-500">:</span>
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={valuePlaceholder}
          className={`${inputClassName} flex-1`}
        />
        <button
          type="button"
          onClick={handleAddPair}
          disabled={!newKey.trim()}
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {addButtonText}
        </button>
      </div>

      {description && <p className="text-sm text-gray-500">{description}</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
