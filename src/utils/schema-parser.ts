import { z } from "zod";
import { ZodTypeName, ParsedField } from "../types";

/**
 * Get the Zod type name from a schema
 */
export function getZodTypeName(schema: z.ZodTypeAny): ZodTypeName {
  return (schema._def as any).typeName as ZodTypeName;
}

/**
 * Check if a field is required (not optional or nullable)
 */
export function isFieldRequired(schema: z.ZodTypeAny): boolean {
  const typeName = getZodTypeName(schema);
  return typeName !== "ZodOptional" && typeName !== "ZodNullable";
}

/**
 * Unwrap optional, nullable, and default schemas to get the inner type
 */
export function unwrapSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  const typeName = getZodTypeName(schema);

  switch (typeName) {
    case "ZodOptional":
    case "ZodNullable":
    case "ZodDefault":
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
  // Check if the schema has meta information
  if ("_def" in schema && "meta" in schema._def) {
    return (schema._def as any).meta;
  }
  return undefined;
}

/**
 * Get enum options from ZodEnum or ZodNativeEnum
 */
export function getEnumOptions(
  schema: z.ZodTypeAny
): Array<{ label: string; value: any }> | undefined {
  const unwrapped = unwrapSchema(schema);
  const typeName = getZodTypeName(unwrapped);

  if (typeName === "ZodEnum") {
    const enumSchema = unwrapped as z.ZodEnum<any>;
    return enumSchema.options.map((value: any) => ({
      label: String(value),
      value,
    }));
  }

  if (typeName === "ZodNativeEnum") {
    const nativeEnumSchema = unwrapped as any;
    const enumObject = nativeEnumSchema._def.values;
    return Object.entries(enumObject).map(([key, value]) => ({
      label: key,
      value: value as string | number,
    }));
  }

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
    case "ZodObject": {
      const objectSchema = unwrapped as z.ZodObject<any>;
      const shape = objectSchema.shape;

      if (name) {
        // This is a nested object
        const nestedFields = Object.entries(shape).flatMap(
          ([key, fieldSchema]) =>
            parseSchema(fieldSchema as z.ZodTypeAny, key, fieldPath)
        );

        return [
          {
            name: fieldPath,
            type: "ZodObject",
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

    case "ZodArray": {
      const arraySchema = unwrapped as z.ZodArray<any>;
      const elementSchema = arraySchema.element;
      const elementFields = parseSchema(elementSchema, "0", fieldPath);

      return [
        {
          name: fieldPath,
          type: "ZodArray",
          schema,
          required,
          nested: elementFields,
          meta,
        },
      ];
    }

    case "ZodString":
    case "ZodNumber":
    case "ZodBoolean":
    case "ZodDate":
    case "ZodBigInt": {
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

    case "ZodEnum":
    case "ZodNativeEnum": {
      const options = getEnumOptions(schema);
      return [
        {
          name: fieldPath,
          type: "ZodEnum",
          schema,
          required,
          options,
          meta,
        },
      ];
    }

    case "ZodUnion": {
      const unionSchema = unwrapped as z.ZodUnion<any>;
      const options = unionSchema.options;

      // Check if it's a simple string union (enum-like)
      const isStringUnion = options.every(
        (option: z.ZodTypeAny) => getZodTypeName(option) === "ZodLiteral"
      );

      if (isStringUnion) {
        const unionOptions = options.map((option: z.ZodLiteral<any>) => ({
          label: String(option.value),
          value: option.value,
        }));

        return [
          {
            name: fieldPath,
            type: "ZodEnum",
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
          type: "ZodString",
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
          type: "ZodString",
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

  switch (typeName) {
    case "ZodString":
      return "string";
    case "ZodNumber":
    case "ZodBigInt":
      return "number";
    case "ZodBoolean":
      return "boolean";
    case "ZodDate":
      return "date";
    case "ZodArray":
      return "array";
    case "ZodObject":
      return "object";
    case "ZodEnum":
    case "ZodNativeEnum":
      return "enum";
    case "ZodUnion":
      // Check if it's a simple string union
      const unionSchema = unwrapped as z.ZodUnion<any>;
      const isStringUnion = unionSchema.options.every(
        (option: z.ZodTypeAny) => getZodTypeName(option) === "ZodLiteral"
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

  if (typeName === "ZodDefault") {
    const defaultSchema = schema as z.ZodDefault<any>;
    return defaultSchema._def.defaultValue();
  }

  return undefined;
}
