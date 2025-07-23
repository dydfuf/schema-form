import { z } from "zod";
import { $ZodTypeDef } from "zod/v4/core";
import { ParsedField, FieldMeta } from "../types";

// Cache for parsed schemas to improve performance
const schemaParseCache = new WeakMap<z.ZodTypeAny, ParsedField[]>();
const defaultValueCache = new WeakMap<z.ZodTypeAny, any>();

/**
 * Get the Zod type name from a schema
 */
export function getZodTypeName(schema: z.ZodTypeAny): $ZodTypeDef["type"] {
  // Try both typeName and type for compatibility
  const def = schema.def;
  return def.type;
}

/**
 * Check if a field is required (not optional or nullable)
 */
export function isFieldRequired(schema: z.ZodTypeAny): boolean {
  const typeName = getZodTypeName(schema);
  return typeName !== "optional" && typeName !== "nullable";
}

/**
 * Unwrap optional, nullable, and default schemas to get the inner type
 */
export function unwrapSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  const typeName = getZodTypeName(schema);

  switch (typeName) {
    case "optional":
    case "nullable":
    case "default":
      return unwrapSchema((schema as any)._def.innerType);
    default:
      return schema;
  }
}

/**
 * Get meta information from a Zod schema with proper typing
 */
export function getSchemaMeta(schema: z.ZodTypeAny): FieldMeta | undefined {
  // Get raw meta from schema
  let rawMeta: any;
  try {
    rawMeta = (schema as any).meta?.();
  } catch (error) {
    // Fallback to _def.meta for compatibility
    if ("_def" in schema && "meta" in (schema as any)._def) {
      rawMeta = (schema as any)._def.meta;
    }
  }

  // Return meta as-is since it should only contain UI/UX information
  return rawMeta as FieldMeta;
}

/**
 * Get enum options from ZodEnum or ZodNativeEnum
 */
export function getEnumOptions(
  schema: z.ZodTypeAny
): Array<{ label: string; value: any }> | undefined {
  const unwrapped = unwrapSchema(schema);
  const typeName = getZodTypeName(unwrapped);

  if (typeName === "enum") {
    const enumSchema = unwrapped as z.ZodEnum<any>;
    return enumSchema.options.map((value: any) => ({
      label: String(value),
      value,
    }));
  }

  // Note: nativeEnum is deprecated in Zod 4, use enum instead

  return undefined;
}

/**
 * Parse a Zod schema into field information
 */
export function parseSchema(
  schema: z.ZodTypeAny,
  name = "",
  parentPath = ""
): ParsedField[] {
  // Check cache for root schema (when name and parentPath are empty)
  if (!name && !parentPath) {
    const cached = schemaParseCache.get(schema);
    if (cached) {
      return cached;
    }
  }

  const unwrapped = unwrapSchema(schema);
  const typeName = getZodTypeName(unwrapped);
  const required = isFieldRequired(schema);
  const fieldPath = parentPath ? `${parentPath}.${name}` : name;
  const meta = getSchemaMeta(schema);

  switch (typeName) {
    case "object": {
      const objectSchema = unwrapped as z.ZodObject<any>;
      const shape = objectSchema.shape;

      if (name) {
        // This is a nested object
        const nestedFields = Object.entries(shape).flatMap(
          ([key, fieldSchema]) => {
            return parseSchema(fieldSchema as z.ZodTypeAny, key, fieldPath);
          }
        );

        return [
          {
            name: fieldPath,
            type: "object",
            schema,
            required,
            nested: nestedFields,
            meta,
          },
        ];
      } else {
        // This is the root object
        const result = Object.entries(shape).flatMap(([key, fieldSchema]) =>
          parseSchema(fieldSchema as z.ZodTypeAny, key, "")
        );

        // Cache the result for root schema
        schemaParseCache.set(schema, result);

        return result;
      }
    }

    case "array": {
      const arraySchema = unwrapped as z.ZodArray<any>;
      const elementSchema = arraySchema.element;
      const elementFields = parseSchema(elementSchema, "0", fieldPath);

      return [
        {
          name: fieldPath,
          type: "array",
          schema,
          required,
          nested: elementFields,
          meta,
        },
      ];
    }

    case "string":
    case "number":
    case "boolean":
    case "date":
    case "bigint": {
      return [
        {
          name: fieldPath,
          type: typeName,
          schema,
          required,
          meta,
        },
      ];
    }

    case "literal": {
      return [
        {
          name: fieldPath,
          type: "literal",
          schema,
          required,
          meta,
        },
      ];
    }

    case "record": {
      return [
        {
          name: fieldPath,
          type: "record",
          schema,
          required,
          meta,
        },
      ];
    }

    case "tuple": {
      return [
        {
          name: fieldPath,
          type: "tuple",
          schema,
          required,
          meta,
        },
      ];
    }

    case "enum": {
      const options = getEnumOptions(schema);
      return [
        {
          name: fieldPath,
          type: "enum",
          schema,
          required,
          options,
          meta,
        },
      ];
    }

    case "union": {
      const unionSchema = unwrapped as z.ZodUnion<any>;
      const options = unionSchema.options;

      // Check if it's a simple string union (enum-like)
      const isStringUnion = options.every(
        (option: z.ZodTypeAny) => getZodTypeName(option) === "literal"
      );

      if (isStringUnion) {
        const unionOptions = options.map((option: z.ZodLiteral<any>) => ({
          label: String(option.value),
          value: option.value,
        }));

        return [
          {
            name: fieldPath,
            type: "enum",
            schema,
            required,
            options: unionOptions,
            meta,
          },
        ];
      }

      // For complex unions, treat as string for now
      return [
        {
          name: fieldPath,
          type: "string",
          schema,
          required,
          meta,
        },
      ];
    }

    default: {
      // Fallback to string for unsupported types
      const result = [
        {
          name: fieldPath,
          type: "string" as const,
          schema,
          required,
          meta,
        },
      ];

      // Cache the result for root schema
      if (!name && !parentPath) {
        schemaParseCache.set(schema, result);
      }

      return result;
    }
  }

  // This should not be reached, but we need to handle the end of the function
  const result: ParsedField[] = [];

  // Cache the result for root schema
  if (!name && !parentPath) {
    schemaParseCache.set(schema, result);
  }

  return result;
}

/**
 * Get field type for rendering
 */
export function getFieldType(schema: z.ZodTypeAny): string {
  const unwrapped = unwrapSchema(schema);
  const typeName = getZodTypeName(unwrapped);
  const meta = getSchemaMeta(schema);

  switch (typeName) {
    case "string":
      // Check meta for variant
      if (meta?.variant) {
        return meta.variant;
      }

      // Check schema for specific string validations
      const stringSchema = unwrapped as z.ZodString;
      const checks = (stringSchema as any)._def.checks || [];

      for (const check of checks) {
        if (check.kind === "email") {
          return "email";
        }
        if (check.kind === "url") {
          return "url";
        }
        if (check.kind === "datetime") {
          return "datetime-local";
        }
      }

      return "string";
    case "number":
    case "bigint":
      // Check meta for variant
      if (meta?.variant) {
        return meta.variant;
      }
      return "number";
    case "boolean":
      // Check meta for variant
      if (meta?.variant) {
        return meta.variant;
      }
      return "boolean";
    case "date":
      return "date";
    case "array":
      return "array";
    case "object":
      return "object";
    case "enum":
      return "enum";
    case "literal":
      return "literal";
    case "record":
      return "record";
    case "tuple":
      return "tuple";
    case "union":
      // Check if it's a simple string union
      const unionSchema = unwrapped as z.ZodUnion<any>;
      const isStringUnion = unionSchema.options.every(
        (option: z.ZodTypeAny) => getZodTypeName(option) === "literal"
      );
      return isStringUnion ? "enum" : "string";
    default:
      return "string";
  }
}

/**
 * Get default value from schema
 */
export function getDefaultValue(schema: z.ZodTypeAny): any {
  // Check cache first
  if (defaultValueCache.has(schema)) {
    return defaultValueCache.get(schema);
  }

  const typeName = getZodTypeName(schema);
  let result: any;

  if (typeName === "default") {
    const defaultSchema = schema as z.ZodDefault<any>;
    result = (defaultSchema as any)._def.defaultValue();
  } else {
    result = undefined;
  }

  // Cache the result
  defaultValueCache.set(schema, result);

  return result;
}
