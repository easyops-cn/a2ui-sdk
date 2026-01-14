/**
 * DividerComponent - Displays a separator line.
 */

import { memo } from 'react'
import type { DividerComponentProps } from '@a2ui-sdk/types/0.9/standard-catalog'
import { Separator } from '@/components/ui/separator'
import type { A2UIComponentProps } from '@/0.9/components/types'

/**
 * Divider component for visual separation.
 */
export const DividerComponent = memo(function DividerComponent({
  axis = 'horizontal',
}: A2UIComponentProps<DividerComponentProps>) {
  return (
    <Separator
      orientation={axis}
      className={axis === 'vertical' ? 'self-stretch h-auto!' : 'w-full'}
    />
  )
})

DividerComponent.displayName = 'A2UI.Divider'
