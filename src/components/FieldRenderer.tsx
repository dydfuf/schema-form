import { FieldComponentProps, FieldRendererMap } from "../types";
import { getFieldType } from "../utils/schema-parser";
import {
  StringField,
  NumberField,
  BooleanField,
  EnumField,
  DateField,
  ObjectField,
} from "./fields";

// Default field renderer map
const defaultFieldRenderers: FieldRendererMap = {
  string: StringField,
  number: NumberField,
  boolean: BooleanField,
  date: DateField,
  enum: EnumField,
  array: StringField, // TODO: Implement ArrayField
  object: ObjectField,
};

export interface FieldRendererProps extends FieldComponentProps {
  customRenderers?: Partial<FieldRendererMap>;
}

export function FieldRenderer({
  schema,
  customRenderers = {},
  ...fieldProps
}: FieldRendererProps) {
  const fieldType = getFieldType(schema);
  const renderers = { ...defaultFieldRenderers, ...customRenderers };

  const FieldComponent = renderers[fieldType] || renderers.string;

  return <FieldComponent schema={schema} {...fieldProps} />;
}
