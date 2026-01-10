/**
 * DateTimeInputComponent - Date and/or time input with two-way binding.
 */

import React, { memo, useCallback } from 'react'
import type { DateTimeInputComponentProps } from '../../types'
import { useFormBinding } from '../../hooks/useDataBinding'
import { Input } from '../../../../../components/ui/input'
import { cn } from '../../../../../lib/utils'

/**
 * DateTimeInput component - date/time picker.
 */
export const DateTimeInputComponent = memo(function DateTimeInputComponent({
  surfaceId,
  componentId,
  value,
  enableDate = true,
  enableTime = false,
}: DateTimeInputComponentProps) {
  const [dateValue, setDateValue] = useFormBinding<string>(surfaceId, value, '')

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDateValue(e.target.value)
    },
    [setDateValue]
  )

  // Determine input type based on enabled features
  let inputType = 'date'
  if (enableDate && enableTime) {
    inputType = 'datetime-local'
  } else if (enableTime && !enableDate) {
    inputType = 'time'
  }

  const id = `datetime-${componentId}`

  return (
    <div className={cn('flex flex-col gap-2')}>
      <Input
        id={id}
        type={inputType}
        value={dateValue}
        onChange={handleChange}
      />
    </div>
  )
})

DateTimeInputComponent.displayName = 'A2UI.DateTimeInput'
