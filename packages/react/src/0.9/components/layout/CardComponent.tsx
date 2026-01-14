/**
 * CardComponent - Card container.
 */

import { memo } from 'react'
import type { CardComponentProps } from '@a2ui-sdk/types/0.9/standard-catalog'
import type { A2UIComponentProps } from '@/0.9/components/types'
import { Card, CardContent } from '@/components/ui/card'
import { ComponentRenderer } from '../ComponentRenderer'

/**
 * Card component - container with card styling.
 */
export const CardComponent = memo(function CardComponent({
  surfaceId,
  child,
  weight,
}: A2UIComponentProps<CardComponentProps>) {
  // Apply weight as flex-grow if set
  const style = weight ? { flexGrow: weight } : undefined

  if (!child) {
    return <Card style={style} />
  }

  return (
    <Card style={style}>
      <CardContent className="p-4">
        <ComponentRenderer surfaceId={surfaceId} componentId={child} />
      </CardContent>
    </Card>
  )
})

CardComponent.displayName = 'A2UI.Card'
