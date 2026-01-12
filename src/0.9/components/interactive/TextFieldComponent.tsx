/**
 * TextFieldComponent - Text input field with two-way binding.
 */

import { memo, useCallback } from 'react'
import type { TextFieldComponent as TextFieldComponentType } from '../../types'
import type { A2UIComponentProps } from '../../contexts/ComponentsMapContext'
import { useStringBinding, useFormBinding } from '../../hooks/useDataBinding'
import { useValidation } from '../../hooks/useValidation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/**
 * Maps variant to HTML input type.
 */
const inputTypeMap: Record<string, string> = {
  shortText: 'text',
  longText: 'text', // Uses textarea
  number: 'number',
  obscured: 'password',
}

/**
 * TextField component - text input with label.
 */
export const TextFieldComponent = memo(function TextFieldComponent({
  surfaceId,
  component,
}: A2UIComponentProps) {
  const textField = component as TextFieldComponentType
  const labelText = useStringBinding(surfaceId, textField.label, '')
  const [value, setValue] = useFormBinding<string>(
    surfaceId,
    textField.value,
    ''
  )
  const { valid, errors } = useValidation(surfaceId, textField.checks)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValue(e.target.value)
    },
    [setValue]
  )

  const id = `textfield-${textField.id}`
  const variant = textField.variant ?? 'shortText'
  const inputType = inputTypeMap[variant] || 'text'
  const isLongText = variant === 'longText'

  // Apply weight as flex-grow if set
  const style = textField.weight ? { flexGrow: textField.weight } : undefined

  return (
    <div className={cn('flex flex-col gap-2')} style={style}>
      {labelText && <Label htmlFor={id}>{labelText}</Label>}
      {isLongText ? (
        <Textarea
          id={id}
          value={value}
          onChange={handleChange}
          className={cn('min-h-[100px]', !valid && 'border-destructive')}
          aria-invalid={!valid}
        />
      ) : (
        <Input
          id={id}
          type={inputType}
          value={value}
          onChange={handleChange}
          className={cn(!valid && 'border-destructive')}
          aria-invalid={!valid}
        />
      )}
      {errors.length > 0 && (
        <div className="text-sm text-destructive">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  )
})

TextFieldComponent.displayName = 'A2UI.TextField'
