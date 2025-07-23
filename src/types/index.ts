import { z } from "zod";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { ReactNode, ComponentType } from "react";

// Extend Zod's meta type for better type inference
declare module "zod" {
  interface ZodTypeDef {
    meta?: FieldMeta;
  }
}

// Zod schema types
export type ZodSchema = z.ZodTypeAny;
export type InferredType<T extends ZodSchema> = z.infer<T> extends FieldValues
  ? z.infer<T>
  : FieldValues;

// Field component props
export interface BaseFieldProps<T extends FieldValues = FieldValues> {
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
  error?: string;
}

export interface FieldComponentProps<T extends FieldValues = FieldValues>
  extends BaseFieldProps<T> {
  form: UseFormReturn<FieldValues>;
  schema: ZodSchema;
}

// Field renderer types
export type FieldRenderer<T extends FieldValues = FieldValues> = ComponentType<
  FieldComponentProps<T>
>;

export interface FieldRendererMap {
  string: FieldRenderer;
  number: FieldRenderer;
  boolean: FieldRenderer;
  date: FieldRenderer;
  array: FieldRenderer;
  object: FieldRenderer;
  enum: FieldRenderer;
  [key: string]: FieldRenderer;
}

// Schema form props
export interface SchemaFormProps<T extends ZodSchema> {
  schema: T;
  onSubmit: (data: InferredType<T>) => void | Promise<void>;
  defaultValues?: Partial<InferredType<T>>;
  className?: string;
  children?: ReactNode;
  fieldRenderers?: Partial<FieldRendererMap>;
  submitButton?:
    | ReactNode
    | ((isSubmitting: boolean, isValid: boolean) => ReactNode);
  resetButton?: ReactNode | ((reset: () => void) => ReactNode);
}

// Field configuration
export interface FieldConfig {
  label?: string;
  placeholder?: string;
  description?: string;
  hidden?: boolean;
  disabled?: boolean;
  className?: string;
  renderer?: string | FieldRenderer;
  props?: Record<string, any>;
}

// Base field metadata with common properties
export interface BaseFieldMeta {
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  hidden?: boolean;
  // Index signature to satisfy Zod's meta requirements
  [key: string]: unknown;
}

// Field-specific meta types for better type inference
export interface StringFieldMeta extends BaseFieldMeta {
  variant?: "text" | "password" | "email" | "url" | "textarea" | "search";
  errorMessages?: {
    required?: string;
    invalid?: string;
    min?: string;
    max?: string;
    pattern?: string;
    email?: string;
    url?: string;
  };
}

export interface NumberFieldMeta extends BaseFieldMeta {
  variant?: "number" | "range" | "slider";
  step?: number;
  errorMessages?: {
    required?: string;
    invalid?: string;
    min?: string;
    max?: string;
  };
}

export interface BooleanFieldMeta extends BaseFieldMeta {
  variant?: "checkbox" | "switch" | "toggle";
  errorMessages?: {
    required?: string;
  };
}

export interface DateFieldMeta extends BaseFieldMeta {
  variant?: "date" | "datetime-local" | "time";
  errorMessages?: {
    required?: string;
    invalid?: string;
    min?: string;
    max?: string;
  };
}

export interface ArrayFieldMeta extends BaseFieldMeta {
  variant?: "list" | "tags" | "multiselect";
  errorMessages?: {
    required?: string;
    minItems?: string;
    maxItems?: string;
  };
}

export interface ObjectFieldMeta extends BaseFieldMeta {
  variant?: "fieldset" | "card" | "accordion";
}

export interface EnumFieldMeta extends BaseFieldMeta {
  variant?: "select" | "radio" | "buttons";
  options?: Array<{ label: string; value: any }>;
  errorMessages?: {
    required?: string;
    invalid?: string;
  };
}

// Union type for all field meta types
export type FieldMeta = 
  | StringFieldMeta
  | NumberFieldMeta
  | BooleanFieldMeta
  | DateFieldMeta
  | ArrayFieldMeta
  | ObjectFieldMeta
  | EnumFieldMeta;

// Helper functions for type-safe meta creation
export const createStringMeta = (meta: StringFieldMeta): StringFieldMeta => meta;
export const createNumberMeta = (meta: NumberFieldMeta): NumberFieldMeta => meta;
export const createBooleanMeta = (meta: BooleanFieldMeta): BooleanFieldMeta => meta;
export const createDateMeta = (meta: DateFieldMeta): DateFieldMeta => meta;
export const createArrayMeta = (meta: ArrayFieldMeta): ArrayFieldMeta => meta;
export const createObjectMeta = (meta: ObjectFieldMeta): ObjectFieldMeta => meta;
export const createEnumMeta = (meta: EnumFieldMeta): EnumFieldMeta => meta;

// Schema metadata for field configuration
export interface SchemaMetadata {
  [fieldPath: string]: FieldConfig & {
    meta?: FieldMeta;
  };
}

// Hook return types
export interface UseSchemaFormReturn<T extends ZodSchema> {
  form: UseFormReturn<FieldValues>;
  schema: T;
  isSubmitting: boolean;
  isValid: boolean;
  errors: Record<string, string>;
}

// Utility types
export type ZodTypeName =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "array"
  | "object"
  | "enum"
  | "optional"
  | "nullable"
  | "default"
  | "union"
  | "intersection"
  | "record"
  | "map"
  | "set"
  | "function"
  | "lazy"
  | "literal"
  | "tuple"
  | "void"
  | "never"
  | "undefined"
  | "null"
  | "any"
  | "bigint"
  | "ZodUnknown"
  | "ZodBigInt"
  | "ZodSymbol"
  | "object";

export interface ParsedField {
  name: string;
  type: ZodTypeName;
  schema: ZodSchema;
  required: boolean;
  label?: string;
  placeholder?: string;
  description?: string;
  options?: Array<{ label: string; value: any }>;
  nested?: ParsedField[];
  meta?: FieldMeta;
}
