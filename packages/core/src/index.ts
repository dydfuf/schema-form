// Main exports
export { SchemaForm } from "./components/SchemaForm";
export { FieldRenderer } from "./components/FieldRenderer";
export { useSchemaForm, useSchemaFormSubmit } from "./hooks/useSchemaForm";
export type { UseSchemaFormOptions } from "./hooks/useSchemaForm";

// Field components
export {
  StringField,
  NumberField,
  BooleanField,
  EnumField,
  DateField,
} from "./components/fields";

// Types
export type {
  ZodSchema,
  InferredType,
  SchemaFormProps,
  FieldComponentProps,
  FieldRenderer as FieldRendererType,
  FieldRendererMap,
  FieldConfig,
  SchemaMetadata,
  UseSchemaFormReturn,
  ParsedField,
  ZodTypeName,
  BaseFieldProps,
  FieldMeta,
  StringFieldMeta,
  NumberFieldMeta,
  BooleanFieldMeta,
  DateFieldMeta,
  ArrayFieldMeta,
  ObjectFieldMeta,
  EnumFieldMeta,
  BaseFieldMeta,
} from "./types";

// Meta helper functions
export {
  createStringMeta,
  createNumberMeta,
  createBooleanMeta,
  createDateMeta,
  createArrayMeta,
  createObjectMeta,
  createEnumMeta,
} from "./types";

// Utilities
export {
  parseSchema,
  getFieldType,
  getZodTypeName,
  isFieldRequired,
  unwrapSchema,
  getEnumOptions,
  getDefaultValue,
} from "./utils/schema-parser";
