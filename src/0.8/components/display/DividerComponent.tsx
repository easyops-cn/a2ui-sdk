/**
 * DividerComponent - Displays a separator line.
 */

import React, { memo } from 'react'
import type { DividerComponentProps } from '../../types'
import { Separator } from '../../../../../components/ui/separator'

/**
 * Divider component for visual separation.
 */
export const DividerComponent = memo(function DividerComponent({
  axis = 'horizontal',
}: DividerComponentProps) {
  return (
    <Separator
      orientation={axis}
      className={axis === 'vertical' ? 'h-auto' : 'w-full'}
    />
  )
})

DividerComponent.displayName = 'A2UI.Divider'
