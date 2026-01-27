/**
 * TemplateRenderer - Renders template-bound children with data scoping.
 *
 * Iterates over data at a template path and renders a component for each item,
 * wrapping each in a ScopeProvider to enable relative path resolution.
 */

import { memo } from 'react'
import type { TemplateBinding, DataModel } from '@a2ui-sdk/types/0.8'
import { getValueByPath, resolvePath } from '@a2ui-sdk/utils/0.8'
import { ScopeProvider } from '../../contexts/ScopeContext'
import { ComponentRenderer } from '../../components/ComponentRenderer'

export interface TemplateRendererProps {
  surfaceId: string
  template: TemplateBinding
  dataModel: DataModel
  basePath: string | null
}

/**
 * Renders template-bound children with scoped data context.
 *
 * @example
 * ```tsx
 * <TemplateRenderer
 *   surfaceId="main"
 *   template={{ componentId: "item-card", dataBinding: "/items" }}
 *   dataModel={{ items: { 0: { name: "Alice" }, 1: { name: "Bob" } } }}
 *   basePath={null}
 * />
 * // Renders two item-card components, each with scoped access to its data
 * ```
 */
export const TemplateRenderer = memo(function TemplateRenderer({
  surfaceId,
  template,
  dataModel,
  basePath,
}: TemplateRendererProps) {
  const { componentId, dataBinding } = template

  // Resolve template path against current scope
  const resolvedPath = resolvePath(dataBinding, basePath)

  // Get data at resolved path
  const listData = getValueByPath(dataModel, resolvedPath)

  // Return null if no data or invalid data type
  if (!listData || typeof listData !== 'object') {
    return null
  }

  // Iterate over items (object keys or array indices)
  const items = Object.entries(listData as Record<string, unknown>)

  return (
    <>
      {items.map(([key]) => {
        const itemPath = `${resolvedPath}/${key}`
        return (
          <ScopeProvider key={`${componentId}-${key}`} basePath={itemPath}>
            <ComponentRenderer
              surfaceId={surfaceId}
              componentId={componentId}
            />
          </ScopeProvider>
        )
      })}
    </>
  )
})

TemplateRenderer.displayName = 'A2UI.TemplateRenderer'
