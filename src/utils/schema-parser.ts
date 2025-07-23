import { z } from "zod";
import { $ZodTypeDef } from "zod/v4/core";
import { ParsedField } from "../types";

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
 * Get meta information from a Zod schema
 */
export function getSchemaMeta(
  schema: z.ZodTypeAny
): Record<string, any> | undefined {
  // In Zod v4, meta() method is used to retrieve metadata from globalRegistry
  try {
    const meta = (schema as any).meta?.();
    return meta;
  } catch (error) {
    // Fallback to _def.meta for compatibility
    if ("_def" in schema && "meta" in (schema as any)._def) {
      return (schema as any)._def.meta;
    }

    return undefined;
  }
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
        return Object.entries(shape).flatMap(([key, fieldSchema]) =>
          parseSchema(fieldSchema as z.ZodTypeAny, key, "")
        );
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
  }
}

/**
 * Get field type for rendering
 */
export function getFieldType(schema: z.ZodTypeAny): string {
  const unwrapped = unwrapSchema(schema);
  const typeName = getZodTypeName(unwrapped);
  const meta = getSchemaMeta(schema);

  console.log({ unwrapped, typeName, meta });

  // Check for meta-based field type override
  if (meta?.fieldType) {
    return meta.fieldType;
  }

  switch (typeName) {
    case "string":
      // Check meta for specific string field types
      if (meta?.props?.type === "email") {
        console.log("Returning email field type for:", meta);
        return "email";
      }
      if (meta?.props?.type === "password") {
        console.log("Returning password field type for:", meta);
        return "password";
      }
      if (meta?.props?.type === "url") {
        console.log("Returning url field type for:", meta);
        return "url";
      }
      if (meta?.props?.as === "textarea") {
        console.log("Returning textarea field type for:", meta);
        return "textarea";
      }
      console.log("Returning string field type for:", typeName, meta);
      return "string";
    case "number":
    case "bigint":
      console.log("Returning number field type for:", typeName);
      return "number";
    case "boolean":
      console.log("Returning boolean field type for:", typeName, meta);
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
      console.log("Returning literal field type for:", typeName);
      return "literal";
    case "record":
      console.log("Returning record field type for:", typeName);
      return "record";
    case "tuple":
      console.log("Returning tuple field type for:", typeName);
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
  const typeName = getZodTypeName(schema);

  if (typeName === "default") {
    const defaultSchema = schema as z.ZodDefault<any>;
    return (defaultSchema as any)._def.defaultValue();
  }

  return undefined;
}
