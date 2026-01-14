/**
 * SliderComponent - Slider input with two-way binding.
 */

import { memo, useCallback } from 'react'
import type { SliderComponentProps } from '@a2ui-sdk/types/0.8/standard-catalog'
import { useDataBinding, useFormBinding } from '@/0.8/hooks/useDataBinding'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { A2UIComponentProps } from '@/0.8/components/types'

/**
 * Slider component - range slider input.
 */
export const SliderComponent = memo(function SliderComponent({
  surfaceId,
  componentId,
  label,
  value,
  minValue = 0,
  maxValue = 100,
}: A2UIComponentProps<SliderComponentProps>) {
  const labelText = useDataBinding<string>(surfaceId, label, '')
  const [sliderValue, setSliderValue] = useFormBinding<number>(
    surfaceId,
    value,
    minValue
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

  return (
    <div className={cn('flex flex-col gap-2 py-2')}>
      {labelText && <Label htmlFor={id}>{labelText}</Label>}
      <Slider
        id={id}
        value={[sliderValue]}
        onValueChange={handleChange}
        min={minValue}
        max={maxValue}
        step={1}
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{minValue}</span>
        <span className="font-medium text-foreground">{sliderValue}</span>
        <span>{maxValue}</span>
      </div>
    </div>
  )
})

SliderComponent.displayName = 'A2UI.Slider'
