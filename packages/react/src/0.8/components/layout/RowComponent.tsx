/**
 * RowComponent - Horizontal flex container.
 */

import { memo } from 'react'
import type {
  RowComponentProps,
  Distribution,
  Alignment,
} from '@a2ui-sdk/types/0.8/standard-catalog'
import { useDataModel } from '@/0.8/hooks/useDataBinding'
import { cn } from '@/lib/utils'
import { ComponentRenderer } from '../ComponentRenderer'
import type { A2UIComponentProps } from '@/0.8/components/types'
import { TemplateRenderer } from './TemplateRenderer'
import { useScope } from '../../contexts/ScopeContext'

/**
 * Maps distribution values to Tailwind justify-content classes.
 */
const distributionStyles: Record<Distribution, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  spaceBetween: 'justify-between',
  spaceAround: 'justify-around',
  spaceEvenly: 'justify-evenly',
}

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
 * Row component - horizontal flex container.
 */
export const RowComponent = memo(function RowComponent({
  surfaceId,
  children,
  distribution = 'start',
  alignment = 'stretch',
}: A2UIComponentProps<RowComponentProps>) {
  const dataModel = useDataModel(surfaceId)
  const { basePath } = useScope()

  const className = cn(
    'flex flex-row gap-3',
    distributionStyles[distribution],
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
    return (
      <div className={className}>
        <TemplateRenderer
          surfaceId={surfaceId}
          template={children.template}
          dataModel={dataModel}
          basePath={basePath}
        />
      </div>
    )
  }

  return <div className={className} />
})

RowComponent.displayName = 'A2UI.Row'
