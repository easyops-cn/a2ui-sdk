/**
 * ColumnComponent - Vertical flex container.
 */

import { memo } from 'react'
import type {
  ColumnComponentProps,
  Justify,
  Align,
} from '@a2ui-sdk/types/0.9/standard-catalog'
import type { A2UIComponentProps } from '@/0.9/components/types'
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
 * Column component - vertical flex container.
 * Supports both static children and template binding for dynamic children.
 */
export const ColumnComponent = memo(function ColumnComponent({
  surfaceId,
  children,
  justify = 'start',
  align = 'stretch',
  weight,
}: A2UIComponentProps<ColumnComponentProps>) {
  const dataModel = useDataModel(surfaceId)
  const { basePath } = useScope()

  const className = cn(
    'flex flex-col gap-4',
    justifyStyles[justify],
    alignStyles[align]
  )

  // Apply weight as flex-grow if set
  const style = weight ? { flexGrow: weight } : undefined

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

ColumnComponent.displayName = 'A2UI.Column'
