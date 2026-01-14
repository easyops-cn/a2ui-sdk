/**
 * ChoicePickerComponent - Choice picker with two-way binding.
 * Renamed from MultipleChoice in 0.8. Supports both single selection (dropdown) and multi-selection (checkboxes).
 */

import { memo, useCallback } from 'react'
import type { DynamicString } from '@a2ui-sdk/types/0.9'
import type { ChoicePickerComponentProps } from '@a2ui-sdk/types/0.9/standard-catalog'
import type { A2UIComponentProps } from '@/0.9/components/types'
import { useStringBinding, useFormBinding } from '../../hooks/useDataBinding'
import { useValidation } from '../../hooks/useValidation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/**
 * Helper component to resolve option labels.
 */
function OptionLabel({
  surfaceId,
  label,
}: {
  surfaceId: string
  label: DynamicString | undefined
}) {
  const labelText = useStringBinding(surfaceId, label, '')
  return <>{labelText}</>
}

/**
 * ChoicePicker component - choice picker input.
 * When variant === 'mutuallyExclusive', renders as a dropdown.
 * When variant === 'multipleSelection' or undefined, renders as checkboxes.
 */
export const ChoicePickerComponent = memo(function ChoicePickerComponent({
  surfaceId,
  componentId,
  label,
  variant = 'multipleSelection',
  options,
  value: valueProp,
  checks,
  weight,
}: A2UIComponentProps<ChoicePickerComponentProps>) {
  const labelText = useStringBinding(surfaceId, label, '')
  const isSingleSelection = variant === 'mutuallyExclusive'
  const { valid, errors } = useValidation(surfaceId, checks)

  const [selectedValue, setSelectedValue] = useFormBinding<string | string[]>(
    surfaceId,
    valueProp,
    isSingleSelection ? '' : []
  )

  const handleSingleChange = useCallback(
    (value: string) => {
      setSelectedValue(value)
    },
    [setSelectedValue]
  )

  const handleMultiChange = useCallback(
    (value: string, checked: boolean) => {
      const currentSelections = Array.isArray(selectedValue)
        ? selectedValue
        : selectedValue
          ? [selectedValue]
          : []

      if (checked) {
        setSelectedValue([...currentSelections, value])
      } else {
        setSelectedValue(currentSelections.filter((v) => v !== value))
      }
    },
    [selectedValue, setSelectedValue]
  )

  const id = `choicepicker-${componentId}`

  // Apply weight as flex-grow if set
  const style = weight ? { flexGrow: weight } : undefined

  if (!options || options.length === 0) {
    return null
  }

  // Single selection mode - use dropdown
  if (isSingleSelection) {
    const currentValue = Array.isArray(selectedValue)
      ? selectedValue[0] || ''
      : selectedValue

    return (
      <div className={cn('flex flex-col gap-2')} style={style}>
        {labelText && <Label htmlFor={id}>{labelText}</Label>}
        <Select value={currentValue} onValueChange={handleSingleChange}>
          <SelectTrigger
            id={id}
            className={cn(!valid && 'border-destructive')}
            aria-invalid={!valid}
          >
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <OptionLabel surfaceId={surfaceId} label={option.label} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.length > 0 && (
          <div className="text-sm text-destructive">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Multi-selection mode - use checkboxes
  const currentSelections = Array.isArray(selectedValue)
    ? selectedValue
    : selectedValue
      ? [selectedValue]
      : []

  return (
    <div className={cn('flex flex-col gap-2')} style={style}>
      {labelText && <Label>{labelText}</Label>}
      {options.map((option) => {
        const isChecked = currentSelections.includes(option.value)
        const checkboxId = `${id}-${option.value}`

        return (
          <div key={option.value} className="flex items-center gap-2">
            <Checkbox
              id={checkboxId}
              checked={isChecked}
              onCheckedChange={(checked) =>
                handleMultiChange(option.value, checked === true)
              }
            />
            <Label htmlFor={checkboxId} className="cursor-pointer">
              <OptionLabel surfaceId={surfaceId} label={option.label} />
            </Label>
          </div>
        )
      })}
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

ChoicePickerComponent.displayName = 'A2UI.ChoicePicker'
