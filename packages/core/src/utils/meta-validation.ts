import { z } from "zod";
import { match } from "ts-pattern";
import { isNil } from "es-toolkit";
import {
  StringFieldMeta,
  NumberFieldMeta,
  BooleanFieldMeta,
  DateFieldMeta,
  ArrayFieldMeta,
  ObjectFieldMeta,
  EnumFieldMeta,
} from "../types";
import { getZodTypeName, unwrapSchema } from "./schema-parser";

// Zod schemas for meta validation
const baseFieldMetaSchema = z.object({
  label: z.string().optional(),
  placeholder: z.string().optional(),
  description: z.string().optional(),
  className: z.string().optional(),
  disabled: z.boolean().optional(),
  hidden: z.boolean().optional(),
}).passthrough(); // Allow additional properties

const stringFieldMetaSchema = baseFieldMetaSchema.extend({
  variant: z.enum(["text", "password", "email", "url", "textarea", "search"]).optional(),
  errorMessages: z.object({
    required: z.string().optional(),
    invalid: z.string().optional(),
    min: z.string().optional(),
    max: z.string().optional(),
    pattern: z.string().optional(),
    email: z.string().optional(),
    url: z.string().optional(),
  }).optional(),
});

const numberFieldMetaSchema = baseFieldMetaSchema.extend({
  variant: z.enum(["number", "range", "slider"]).optional(),
  step: z.number().optional(),
  errorMessages: z.object({
    required: z.string().optional(),
    invalid: z.string().optional(),
    min: z.string().optional(),
    max: z.string().optional(),
  }).optional(),
});

const booleanFieldMetaSchema = baseFieldMetaSchema.extend({
  variant: z.enum(["checkbox", "switch", "toggle"]).optional(),
  errorMessages: z.object({
    required: z.string().optional(),
  }).optional(),
});

const dateFieldMetaSchema = baseFieldMetaSchema.extend({
  variant: z.enum(["date", "datetime-local", "time"]).optional(),
  errorMessages: z.object({
    required: z.string().optional(),
    invalid: z.string().optional(),
    min: z.string().optional(),
    max: z.string().optional(),
  }).optional(),
});

const arrayFieldMetaSchema = baseFieldMetaSchema.extend({
  variant: z.enum(["list", "tags", "multiselect"]).optional(),
  errorMessages: z.object({
    required: z.string().optional(),
    minItems: z.string().optional(),
    maxItems: z.string().optional(),
  }).optional(),
});

const objectFieldMetaSchema = baseFieldMetaSchema.extend({
  variant: z.enum(["fieldset", "card", "accordion"]).optional(),
});

const enumFieldMetaSchema = baseFieldMetaSchema.extend({
  variant: z.enum(["select", "radio", "buttons"]).optional(),
  options: z.array(z.object({
    label: z.string(),
    value: z.any(),
  })).optional(),
  errorMessages: z.object({
    required: z.string().optional(),
    invalid: z.string().optional(),
  }).optional(),
});

// Meta validation result
export interface MetaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate meta object against the appropriate schema based on field type
 */
export function validateMeta(
  meta: unknown,
  fieldSchema: z.ZodTypeAny
): MetaValidationResult {
  const result: MetaValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  // If meta is undefined or null, it's valid (optional)
  if (isNil(meta)) {
    return result;
  }

  // Check if meta is an object
  if (typeof meta !== "object") {
    result.isValid = false;
    result.errors.push("Meta must be an object");
    return result;
  }

  // Get the field type to determine which schema to use
  const unwrapped = unwrapSchema(fieldSchema);
  const typeName = getZodTypeName(unwrapped);

  const validationSchema = match(typeName)
    .with("string", () => stringFieldMetaSchema)
    .with("number", "bigint", () => numberFieldMetaSchema)
    .with("boolean", () => booleanFieldMetaSchema)
    .with("date", () => dateFieldMetaSchema)
    .with("array", () => arrayFieldMetaSchema)
    .with("object", () => objectFieldMetaSchema)
    .with("enum", "union", () => enumFieldMetaSchema)
    .otherwise(() => {
      // For unknown types, use base meta schema
      result.warnings.push(`Unknown field type '${typeName}', using base meta validation`);
      return baseFieldMetaSchema;
    });

  // Validate meta against the schema
  const validationResult = validationSchema.safeParse(meta);

  if (!validationResult.success) {
    result.isValid = false;
    result.errors = validationResult.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
  }

  return result;
}

/**
 * Validate meta for a specific field type with type safety
 */
export function validateStringMeta(meta: unknown): MetaValidationResult {
  const result: MetaValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  if (isNil(meta)) {
    return result;
  }

  const validationResult = stringFieldMetaSchema.safeParse(meta);
  if (!validationResult.success) {
    result.isValid = false;
    result.errors = validationResult.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
  }

  return result;
}

export function validateNumberMeta(meta: unknown): MetaValidationResult {
  const result: MetaValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  if (isNil(meta)) {
    return result;
  }

  const validationResult = numberFieldMetaSchema.safeParse(meta);
  if (!validationResult.success) {
    result.isValid = false;
    result.errors = validationResult.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
  }

  return result;
}

export function validateBooleanMeta(meta: unknown): MetaValidationResult {
  const result: MetaValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  if (isNil(meta)) {
    return result;
  }

  const validationResult = booleanFieldMetaSchema.safeParse(meta);
  if (!validationResult.success) {
    result.isValid = false;
    result.errors = validationResult.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
  }

  return result;
}

export function validateDateMeta(meta: unknown): MetaValidationResult {
  const result: MetaValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  if (isNil(meta)) {
    return result;
  }

  const validationResult = dateFieldMetaSchema.safeParse(meta);
  if (!validationResult.success) {
    result.isValid = false;
    result.errors = validationResult.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
  }

  return result;
}

export function validateArrayMeta(meta: unknown): MetaValidationResult {
  const result: MetaValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  if (isNil(meta)) {
    return result;
  }

  const validationResult = arrayFieldMetaSchema.safeParse(meta);
  if (!validationResult.success) {
    result.isValid = false;
    result.errors = validationResult.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
  }

  return result;
}

export function validateObjectMeta(meta: unknown): MetaValidationResult {
  const result: MetaValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  if (isNil(meta)) {
    return result;
  }

  const validationResult = objectFieldMetaSchema.safeParse(meta);
  if (!validationResult.success) {
    result.isValid = false;
    result.errors = validationResult.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
  }

  return result;
}

export function validateEnumMeta(meta: unknown): MetaValidationResult {
  const result: MetaValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  if (isNil(meta)) {
    return result;
  }

  const validationResult = enumFieldMetaSchema.safeParse(meta);
  if (!validationResult.success) {
    result.isValid = false;
    result.errors = validationResult.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
  }

  return result;
}

/**
 * Validate all meta objects in a parsed schema
 */
export function validateSchemaMeta(
  fields: Array<{ schema: z.ZodTypeAny; meta?: unknown }>
): { isValid: boolean; fieldErrors: Record<string, MetaValidationResult> } {
  const fieldErrors: Record<string, MetaValidationResult> = {};
  let isValid = true;

  fields.forEach((field, index) => {
    if (field.meta !== undefined) {
      const result = validateMeta(field.meta, field.schema);
      if (!result.isValid) {
        isValid = false;
        fieldErrors[`field_${index}`] = result;
      }
    }
  });

  return { isValid, fieldErrors };
}

/**
 * Type guards for meta validation
 */
export function isValidStringMeta(meta: unknown): meta is StringFieldMeta {
  return validateStringMeta(meta).isValid;
}

export function isValidNumberMeta(meta: unknown): meta is NumberFieldMeta {
  return validateNumberMeta(meta).isValid;
}

export function isValidBooleanMeta(meta: unknown): meta is BooleanFieldMeta {
  return validateBooleanMeta(meta).isValid;
}

export function isValidDateMeta(meta: unknown): meta is DateFieldMeta {
  return validateDateMeta(meta).isValid;
}

export function isValidArrayMeta(meta: unknown): meta is ArrayFieldMeta {
  return validateArrayMeta(meta).isValid;
}

export function isValidObjectMeta(meta: unknown): meta is ObjectFieldMeta {
  return validateObjectMeta(meta).isValid;
}

export function isValidEnumMeta(meta: unknown): meta is EnumFieldMeta {
  return validateEnumMeta(meta).isValid;
}