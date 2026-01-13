/**
 * ListComponent - List container with support for both static and dynamic children.
 *
 * Similar to Row/Column but specifically designed for list rendering with template binding.
 */

import { memo } from 'react'
import type {
  ListComponent as ListComponentType,
  Align,
} from '@a2ui-sdk/types/0.9'
import type { A2UIComponentProps } from '../../contexts/ComponentsMapContext'
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
  component,
}: A2UIComponentProps) {
  const listComp = component as ListComponentType
  const dataModel = useDataModel(surfaceId)
  const { basePath } = useScope()

  const direction = listComp.direction ?? 'vertical'
  const align = listComp.align ?? 'stretch'

  const className = cn(
    'flex gap-3',
    direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
    alignStyles[align]
  )

  // Apply weight as flex-grow if set
  const style = listComp.weight ? { flexGrow: listComp.weight } : undefined

  // Get children - either static list or template binding
  const children = listComp.children

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
