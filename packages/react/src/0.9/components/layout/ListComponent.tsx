/**
 * ListComponent - List container with support for both static and dynamic children.
 *
 * Similar to Row/Column but specifically designed for list rendering with template binding.
 */

import { memo } from 'react'
import type {
  ListComponentProps,
  Align,
} from '@a2ui-sdk/types/0.9/standard-catalog'
import type { A2UIComponentProps } from '@/0.9/components/types'
import { useDataModel } from '../../hooks/useDataBinding'
import { useScope } from '../../contexts/ScopeContext'
import { cn } from '@/lib/utils'
import { ComponentRenderer } from '../ComponentRenderer'
import { TemplateRenderer } from './TemplateRenderer'

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
 * List component - displays children in a list layout.
 * Supports both static children and template binding for dynamic children.
 *
 * @example
 * // Static children
 * { component: "List", id: "list-1", children: ["item-1", "item-2"] }
 *
 * // Template binding (dynamic children)
 * {
 *   component: "List",
 *   id: "list-1",
 *   children: { componentId: "item-template", path: "/items" }
 * }
 */
export const ListComponent = memo(function ListComponent({
  surfaceId,
  children,
  direction = 'vertical',
  align = 'stretch',
  weight,
}: A2UIComponentProps<ListComponentProps>) {
  const dataModel = useDataModel(surfaceId)
  const { basePath } = useScope()

  const className = cn(
    'flex gap-3',
    direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
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

ListComponent.displayName = 'A2UI.List'
