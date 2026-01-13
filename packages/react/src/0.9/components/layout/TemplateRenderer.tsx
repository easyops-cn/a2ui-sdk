/**
 * TemplateRenderer - Renders children from a template binding.
 *
 * Handles iterating over array data and rendering the template component
 * for each item with the appropriate ScopeContext.
 */

import { memo } from 'react'
import type { TemplateBinding, DataModel } from '@a2ui-sdk/types/0.9'
import { ScopeProvider } from '../../contexts/ScopeContext'
import { ComponentRenderer } from '../ComponentRenderer'
import { getValueByPath, resolvePath } from '../../utils/pathUtils'

/**
 * Props for TemplateRenderer.
 */
export interface TemplateRendererProps {
  surfaceId: string
  template: TemplateBinding
  dataModel: DataModel
  basePath: string | null
}

/**
 * Renders children from a template binding.
 *
 * For each item in the array at the template path, renders the template
 * component with a ScopeContext that sets the base path to the item's path.
 *
 * @example
 * Given template: { componentId: "item-template", path: "/items" }
 * And data: { items: [{ name: "A" }, { name: "B" }] }
 *
 * Renders:
 * - item-template with basePath "/items/0"
 * - item-template with basePath "/items/1"
 */
export const TemplateRenderer = memo(function TemplateRenderer({
  surfaceId,
  template,
  dataModel,
  basePath,
}: TemplateRendererProps) {
  const { componentId, path } = template

  // Resolve the template path against the current base path
  const resolvedPath = resolvePath(path, basePath)

  // Get the array data at the template path
  const arrayData = getValueByPath(dataModel, resolvedPath)

  // Handle missing or invalid data
  if (arrayData === undefined || arrayData === null) {
    console.warn(
      `[A2UI 0.9] Template binding path "${resolvedPath}" resolved to undefined or null.`
    )
    return null
  }

  // Handle array data
  if (Array.isArray(arrayData)) {
    return (
      <>
        {arrayData.map((_, index) => {
          const itemPath = `${resolvedPath}/${index}`
          return (
            <ScopeProvider key={`${componentId}-${index}`} basePath={itemPath}>
              <ComponentRenderer
                surfaceId={surfaceId}
                componentId={componentId}
              />
            </ScopeProvider>
          )
        })}
      </>
    )
  }

  // Handle object data (iterate over keys)
  if (typeof arrayData === 'object') {
    const keys = Object.keys(arrayData)
    return (
      <>
        {keys.map((key) => {
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
  }

  console.warn(
    `[A2UI 0.9] Template binding path "${resolvedPath}" resolved to non-iterable value:`,
    arrayData
  )
  return null
})

TemplateRenderer.displayName = 'A2UI.TemplateRenderer'
