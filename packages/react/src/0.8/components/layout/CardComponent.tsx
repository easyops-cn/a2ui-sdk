/**
 * CardComponent - Card container.
 */

import { memo } from 'react'
import type { CardComponentProps } from '@a2ui-sdk/types/0.8/standard-catalog'
import { Card, CardContent } from '@/components/ui/card'
import { ComponentRenderer } from '../ComponentRenderer'
import type { A2UIComponentProps } from '@/0.8/components/types'

/**
 * Card component - container with card styling.
 */
export const CardComponent = memo(function CardComponent({
  surfaceId,
  child,
}: A2UIComponentProps<CardComponentProps>) {
  if (!child) {
    return <Card />
  }

  return (
    <Card>
      <CardContent className="p-4">
        <ComponentRenderer surfaceId={surfaceId} componentId={child} />
      </CardContent>
    </Card>
  )
})

CardComponent.displayName = 'A2UI.Card'
