/**
 * ListComponent - List container with vertical or horizontal direction.
 */

import { memo } from 'react'
import type {
  ListComponentProps,
  Alignment,
} from '@a2ui-sdk/types/0.8/standard-catalog'
import { useDataModel } from '@/0.8/hooks/useDataBinding'
import { cn } from '@/lib/utils'
import { getValueByPath } from '@a2ui-sdk/utils/0.8'
import { ComponentRenderer } from '../ComponentRenderer'
import type { A2UIComponentProps } from '@/0.8/components/types'

/**
 * Maps alignment values to Tailwind align-items classes.
 */
const alignmentStyles: Record<Alignment, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

/**
 * List component - container for list items.
 */
export const ListComponent = memo(function ListComponent({
  surfaceId,
  children,
  direction = 'vertical',
  alignment = 'stretch',
}: A2UIComponentProps<ListComponentProps>) {
  const dataModel = useDataModel(surfaceId)

  const className = cn(
    'flex gap-3',
    direction === 'horizontal' ? 'flex-row' : 'flex-col',
    alignmentStyles[alignment]
  )

  // Render explicit list of children
  if (children?.explicitList) {
    return (
      <div className={className}>
        {children.explicitList.map((childId) => (
          <ComponentRenderer
            key={childId}
            surfaceId={surfaceId}
            componentId={childId}
          />
        ))}
      </div>
    )
  }

  // Render template-based children
  if (children?.template) {
    const { componentId, dataBinding } = children.template
    const listData = getValueByPath(dataModel, dataBinding)

    if (!listData || typeof listData !== 'object') {
      return <div className={className} />
    }

    const items = Object.entries(listData as Record<string, unknown>)

    return (
      <div className={className}>
        {items.map(([key]) => (
          <ComponentRenderer
            key={key}
            surfaceId={surfaceId}
            componentId={componentId}
          />
        ))}
      </div>
    )
  }

  return <div className={className} />
})

ListComponent.displayName = 'A2UI.List'
