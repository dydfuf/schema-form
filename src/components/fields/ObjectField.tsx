import { FieldComponentProps } from '../../types'
import { parseSchema } from '../../utils/schema-parser'
import { FieldRenderer } from '../FieldRenderer'
import { z } from 'zod'

export function ObjectField({ name, form, schema, label, description, className, error }: FieldComponentProps) {
  // Parse the object schema to get its properties
  const unwrappedSchema = schema instanceof z.ZodOptional || schema instanceof z.ZodNullable || schema instanceof z.ZodDefault
    ? schema._def.innerType
    : schema

  if (!(unwrappedSchema instanceof z.ZodObject)) {
    return (
      <div className={`mb-4 ${className || ''}`}>
        <div className="text-red-500">Invalid object schema</div>
      </div>
    )
  }

  const objectShape = unwrappedSchema.shape

  return (
    <div className={`mb-6 p-4 border border-gray-200 rounded-lg ${className || ''}`}>
      {label && (
        <h3 className="text-lg font-medium text-gray-900 mb-3">{label}</h3>
      )}
      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}
      
      <div className="space-y-4">
        {Object.entries(objectShape).map(([fieldName, fieldSchema]) => {
          const fieldPath = name ? `${name}.${fieldName}` : fieldName
          
          // Get nested error using lodash-style path
          const getNestedError = (errors: any, path: string) => {
            return path.split('.').reduce((current, key) => current?.[key], errors)
          }
          
          const fieldError = getNestedError(form.formState.errors, fieldPath)
          
          return (
            <FieldRenderer
              key={fieldPath}
              name={fieldPath}
              form={form}
              schema={fieldSchema as z.ZodTypeAny}
              label={fieldName}
              error={fieldError}
            />
          )
        })}
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {typeof error === 'string' ? error : (error as any)?.message || 'Validation error'}
        </div>
      )}
    </div>
  )
}