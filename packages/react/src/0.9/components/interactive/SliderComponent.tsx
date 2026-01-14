/**
 * SliderComponent - Slider input with two-way binding.
 */

import { memo, useCallback } from 'react'
import type { SliderComponentProps } from '@a2ui-sdk/types/0.9/standard-catalog'
import type { A2UIComponentProps } from '@/0.9/components/types'
import { useStringBinding, useFormBinding } from '../../hooks/useDataBinding'
import { useValidation } from '../../hooks/useValidation'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/**
 * Slider component - range slider input.
 * Note: In 0.9, minValue/maxValue are renamed to min/max.
 */
export const SliderComponent = memo(function SliderComponent({
  surfaceId,
  componentId,
  label,
  min = 0,
  max = 100,
  value: valueProp,
  checks,
  weight,
}: A2UIComponentProps<SliderComponentProps>) {
  const labelText = useStringBinding(surfaceId, label, '')
  const { valid, errors } = useValidation(surfaceId, checks)

  const [sliderValue, setSliderValue] = useFormBinding<number>(
    surfaceId,
    valueProp,
    min
  )

  const handleChange = useCallback(
    (values: number[]) => {
      if (values.length > 0) {
        setSliderValue(values[0])
      }
    },
    [setSliderValue]
  )

  const id = `slider-${componentId}`

  // Apply weight as flex-grow if set
  const style = weight ? { flexGrow: weight } : undefined

  return (
    <div className={cn('flex flex-col gap-2 py-2')} style={style}>
      {labelText && <Label htmlFor={id}>{labelText}</Label>}
      <Slider
        id={id}
        value={[sliderValue]}
        onValueChange={handleChange}
        min={min}
        max={max}
        step={1}
        aria-invalid={!valid}
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{min}</span>
        <span className="font-medium text-foreground">{sliderValue}</span>
        <span>{max}</span>
      </div>
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

SliderComponent.displayName = 'A2UI.Slider'
