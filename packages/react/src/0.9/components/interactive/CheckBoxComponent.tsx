/**
 * CheckBoxComponent - Checkbox input with two-way binding.
 */

import { memo, useCallback } from 'react'
import type { CheckBoxComponent as CheckBoxComponentType } from '@a2ui-sdk/types/0.9'
import type { A2UIComponentProps } from '../../contexts/ComponentsMapContext'
import { useStringBinding, useFormBinding } from '../../hooks/useDataBinding'
import { useValidation } from '../../hooks/useValidation'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/**
 * CheckBox component - checkbox input with label.
 */
export const CheckBoxComponent = memo(function CheckBoxComponent({
  surfaceId,
  component,
}: A2UIComponentProps) {
  const checkBox = component as CheckBoxComponentType
  const labelText = useStringBinding(surfaceId, checkBox.label, '')
  const [checked, setChecked] = useFormBinding<boolean>(
    surfaceId,
    checkBox.value,
    false
  )
  const { valid, errors } = useValidation(surfaceId, checkBox.checks)

  const handleChange = useCallback(
    (newChecked: boolean) => {
      setChecked(newChecked)
    },
    [setChecked]
  )

  const id = `checkbox-${checkBox.id}`

  // Apply weight as flex-grow if set
  const style = checkBox.weight ? { flexGrow: checkBox.weight } : undefined

  return (
    <div className={cn('flex flex-col gap-1')} style={style}>
      <div className="flex items-center gap-3">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={handleChange}
          aria-invalid={!valid}
        />
        {labelText && (
          <Label htmlFor={id} className="cursor-pointer">
            {labelText}
          </Label>
        )}
      </div>
      {errors.length > 0 && (
        <div className="text-sm text-destructive ml-6">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  )
})

CheckBoxComponent.displayName = 'A2UI.CheckBox'
