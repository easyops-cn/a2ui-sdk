/**
 * CardComponent - Card container.
 */

import { memo } from 'react'
import type { CardComponent as CardComponentType } from '@a2ui-sdk/types/0.9'
import type { A2UIComponentProps } from '../../contexts/ComponentsMapContext'
import { Card, CardContent } from '@/components/ui/card'
import { ComponentRenderer } from '../ComponentRenderer'

/**
 * Card component - container with card styling.
 */
export const CardComponent = memo(function CardComponent({
  surfaceId,
  component,
}: A2UIComponentProps) {
  const cardComp = component as CardComponentType

  // Apply weight as flex-grow if set
  const style = cardComp.weight ? { flexGrow: cardComp.weight } : undefined

  if (!cardComp.child) {
    return <Card style={style} />
  }

  return (
    <Card style={style}>
      <CardContent className="p-4">
        <ComponentRenderer surfaceId={surfaceId} componentId={cardComp.child} />
      </CardContent>
    </Card>
  )
})

CardComponent.displayName = 'A2UI.Card'
