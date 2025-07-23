import { FieldComponentProps, FieldRendererMap } from "../types";
import { getFieldType, getSchemaMeta } from "../utils/schema-parser";
import {
  StringField,
  NumberField,
  BooleanField,
  EnumField,
  DateField,
  ObjectField,
  LiteralField,
  TextareaField,
  EmailField,
  PasswordField,
  UrlField,
  RecordField,
  TupleField,
  ArrayField,
} from "./fields";

// Default field renderer map
const defaultFieldRenderers: FieldRendererMap = {
  string: StringField,
  number: NumberField,
  boolean: BooleanField,
  date: DateField,
  enum: EnumField,
  array: ArrayField,
  object: ObjectField,
  literal: LiteralField,
  textarea: TextareaField,
  email: EmailField,
  password: PasswordField,
  url: UrlField,
  record: RecordField,
  tuple: TupleField,
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
  console.log({ fieldType, fieldProps });
  const renderers = { ...defaultFieldRenderers, ...customRenderers };
  const meta = getSchemaMeta(schema);

  // Determine which field component to render based on the field type
  const FieldComponent = renderers[fieldType] || renderers.string;

  // Merge meta props with field props
  const enhancedProps = {
    ...fieldProps,
    ...(meta && {
      placeholder: meta.placeholder || fieldProps.placeholder,
      className: meta.className || fieldProps.className,
      description: meta.description || fieldProps.description,
      label: meta.label || fieldProps.label,
      disabled:
        meta.disabled !== undefined ? meta.disabled : fieldProps.disabled,
      hidden: meta.hidden !== undefined ? meta.hidden : fieldProps.hidden,
      // Add other specific meta props here if needed, avoiding blind spread
    }),
  };

  return <FieldComponent schema={schema} {...enhancedProps} />;
}
