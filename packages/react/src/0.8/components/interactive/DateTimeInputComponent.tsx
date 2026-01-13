/**
 * DateTimeInputComponent - Date and/or time input with two-way binding.
 * Uses native HTML5 input types (date, datetime-local, time).
 */

import { memo, useCallback } from 'react'
import { CalendarIcon, ClockIcon } from 'lucide-react'
import type { DateTimeInputComponentProps } from '@a2ui-sdk/types/0.8'
import { useDataBinding, useFormBinding } from '@/0.8/hooks/useDataBinding'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

/**
 * DateTimeInput component - date/time picker using native HTML5 inputs.
 */
export const DateTimeInputComponent = memo(function DateTimeInputComponent({
  surfaceId,
  componentId,
  label,
  value,
  enableDate = true,
  enableTime = false,
}: DateTimeInputComponentProps) {
  const labelText = useDataBinding<string>(surfaceId, label, '')
  const [dateValue, setDateValue] = useFormBinding<string>(surfaceId, value, '')

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDateValue(e.target.value)
    },
    [setDateValue]
  )

  const id = `datetime-${componentId}`

  // Determine input type based on enableDate and enableTime
  const inputType =
    enableDate && enableTime ? 'datetime-local' : enableDate ? 'date' : 'time'

  // Choose icon based on mode
  const Icon = enableDate ? CalendarIcon : ClockIcon

  return (
    <div className={cn('flex flex-col gap-2')}>
      {labelText && <Label htmlFor={id}>{labelText}</Label>}
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={dateValue}
          onChange={handleChange}
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            'pr-9 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-9 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer'
          )}
        />
        <Icon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  )
})

DateTimeInputComponent.displayName = 'A2UI.DateTimeInput'
