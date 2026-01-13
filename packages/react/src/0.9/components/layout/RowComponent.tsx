/**
 * RowComponent - Horizontal flex container.
 */

import { memo } from 'react'
import type {
  RowComponent as RowComponentType,
  Justify,
  Align,
} from '@a2ui-sdk/types/0.9'
import type { A2UIComponentProps } from '../../contexts/ComponentsMapContext'
import { useDataModel } from '../../hooks/useDataBinding'
import { useScope } from '../../contexts/ScopeContext'
import { cn } from '@/lib/utils'
import { ComponentRenderer } from '../ComponentRenderer'
import { TemplateRenderer } from './TemplateRenderer'

/**
 * Maps justify values to Tailwind justify-content classes.
 */
const justifyStyles: Record<Justify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  spaceBetween: 'justify-between',
  spaceAround: 'justify-around',
  spaceEvenly: 'justify-evenly',
  stretch: 'justify-stretch',
}

/**
 * Maps align values to Tailwind align-items classes.
 */
const alignStyles: Record<Align, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

/**
 * Row component - horizontal flex container.
 * Supports both static children and template binding for dynamic children.
 */
export const RowComponent = memo(function RowComponent({
  surfaceId,
  component,
}: A2UIComponentProps) {
  const rowComp = component as RowComponentType
  const dataModel = useDataModel(surfaceId)
  const { basePath } = useScope()

  const justify = rowComp.justify ?? 'start'
  const align = rowComp.align ?? 'stretch'

  const className = cn(
    'flex flex-row gap-3',
    justifyStyles[justify],
    alignStyles[align]
  )

  // Apply weight as flex-grow if set
  const style = rowComp.weight ? { flexGrow: rowComp.weight } : undefined

  // Get children - either static list or template binding
  const children = rowComp.children

  // Handle static list of children
  if (Array.isArray(children)) {
    return (
      <div className={className} style={style}>
        {children.map((childId) => (
          <ComponentRenderer
            key={childId}
            surfaceId={surfaceId}
            componentId={childId}
          />
        ))}
      </div>
    )
  }

  // Handle template binding
  if (children && typeof children === 'object' && 'componentId' in children) {
    return (
      <div className={className} style={style}>
        <TemplateRenderer
          surfaceId={surfaceId}
          template={children}
          dataModel={dataModel}
          basePath={basePath}
        />
      </div>
    )
  }

  return <div className={className} style={style} />
})

RowComponent.displayName = 'A2UI.Row'
