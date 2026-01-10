/**
 * MultipleChoiceComponent - Dropdown/Select input with two-way binding.
 */

import React, { memo, useCallback } from 'react'
import type { MultipleChoiceComponentProps } from '@/types'
import { useDataBinding, useFormBinding } from '@/hooks/useDataBinding'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

/**
 * MultipleChoice component - dropdown/select input.
 */
export const MultipleChoiceComponent = memo(function MultipleChoiceComponent({
  surfaceId,
  componentId,
  selections,
  options,
}: MultipleChoiceComponentProps) {
  const [selectedValue, setSelectedValue] = useFormBinding<string | string[]>(
    surfaceId,
    selections,
    ''
  )

  const handleChange = useCallback(
    (value: string) => {
      setSelectedValue(value)
    },
    [setSelectedValue]
  )

  const id = `multiplechoice-${componentId}`

  // For now, only support single selection
  const currentValue = Array.isArray(selectedValue)
    ? selectedValue[0] || ''
    : selectedValue

  if (!options || options.length === 0) {
    return null
  }

  return (
    <div className={cn('flex flex-col gap-2')}>
      <Select value={currentValue} onValueChange={handleChange}>
        <SelectTrigger id={id}>
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
    </div>
  )
})

/**
 * Helper component to resolve option labels.
 */
function OptionLabel({
  surfaceId,
  label,
}: {
  surfaceId: string
  label: MultipleChoiceComponentProps['options'] extends Array<infer T>
    ? T extends { label?: infer U }
      ? U
      : never
    : never
}) {
  const labelText = useDataBinding<string>(surfaceId, label, '')
  return <>{labelText}</>
}

MultipleChoiceComponent.displayName = 'A2UI.MultipleChoice'
