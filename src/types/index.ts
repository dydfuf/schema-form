import { z } from "zod";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { ReactNode, ComponentType } from "react";

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

// Schema metadata for field configuration
export interface SchemaMetadata {
  [fieldPath: string]: FieldConfig;
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
  meta?: Record<string, any>;
}
