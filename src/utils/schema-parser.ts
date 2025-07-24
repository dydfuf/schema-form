import { z } from "zod";
import { $ZodTypeDef } from "zod/v4/core";
import { match } from "ts-pattern";
import { isNil } from "es-toolkit";
import { ParsedField, FieldMeta, ZodTypeName } from "../types";
import { validateMeta } from "./meta-validation";

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

  return match(typeName)
    .with("optional", "nullable", "default", () => 
      unwrapSchema((schema as any)._def.innerType)
    )
    .otherwise(() => schema);
}

/**
 * Get meta information from a Zod schema with proper typing and validation
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

  // If no meta found, return undefined
  if (isNil(rawMeta)) {
    return undefined;
  }

  // Validate meta against the schema type
  const validation = validateMeta(rawMeta, schema);
  
  if (!validation.isValid) {
    console.warn(
      `Invalid meta for field type ${getZodTypeName(schema)}:`,
      validation.errors
    );
    // Return undefined for invalid meta to prevent runtime errors
    return undefined;
  }

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

  return match(typeName)
    .with("object", () => {
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
            type: "object" as ZodTypeName,
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
    })
    .with("array", () => {
      const arraySchema = unwrapped as z.ZodArray<any>;
      const elementSchema = arraySchema.element;
      const elementFields = parseSchema(elementSchema, "0", fieldPath);

      return [
        {
          name: fieldPath,
          type: "array" as ZodTypeName,
          schema,
          required,
          nested: elementFields,
          meta,
        },
      ];
    })
    .with("string", "number", "boolean", "date", "bigint", (type) => [
      {
        name: fieldPath,
        type: type as ZodTypeName,
        schema,
        required,
        meta,
      },
    ])
    .with("literal", () => [
      {
        name: fieldPath,
        type: "literal" as ZodTypeName,
        schema,
        required,
        meta,
      },
    ])
    .with("record", () => [
      {
        name: fieldPath,
        type: "record" as ZodTypeName,
        schema,
        required,
        meta,
      },
    ])
    .with("tuple", () => [
      {
        name: fieldPath,
        type: "tuple" as ZodTypeName,
        schema,
        required,
        meta,
      },
    ])
    .with("enum", () => {
      const options = getEnumOptions(schema);
      return [
        {
          name: fieldPath,
          type: "enum" as ZodTypeName,
          schema,
          required,
          options,
          meta,
        },
      ];
    })
    .with("union", () => {
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
            type: "enum" as ZodTypeName,
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
          type: "string" as ZodTypeName,
          schema,
          required,
          meta,
        },
      ];
    })
    .otherwise(() => {
      // Fallback to string for unsupported types
      const result = [
        {
          name: fieldPath,
          type: "string" as ZodTypeName,
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
    });

}

/**
 * Get field type for rendering
 */
export function getFieldType(schema: z.ZodTypeAny): string {
  const unwrapped = unwrapSchema(schema);
  const typeName = getZodTypeName(unwrapped);
  const meta = getSchemaMeta(schema);

  return match(typeName)
    .with("string", () => {
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
    })
    .with("number", "bigint", () => {
      // Check meta for variant
      if (meta?.variant) {
        return meta.variant;
      }
      return "number";
    })
    .with("boolean", () => {
      // Check meta for variant
      if (meta?.variant) {
        return meta.variant;
      }
      return "boolean";
    })
    .with("date", () => "date")
    .with("array", () => "array")
    .with("object", () => "object")
    .with("enum", () => "enum")
    .with("literal", () => "literal")
    .with("record", () => "record")
    .with("tuple", () => "tuple")
    .with("union", () => {
      // Check if it's a simple string union
      const unionSchema = unwrapped as z.ZodUnion<any>;
      const isStringUnion = unionSchema.options.every(
        (option: z.ZodTypeAny) => getZodTypeName(option) === "literal"
      );
      return isStringUnion ? "enum" : "string";
    })
    .otherwise(() => "string");
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
