/**
 * ComponentRenderer - Routes component rendering based on type.
 */

import { memo, useContext } from 'react'
import { useComponent } from '../hooks/useComponent'
import { ComponentsMapContext } from '../contexts/ComponentsMapContext'

/**
 * Props for ComponentRenderer.
 */
export interface ComponentRendererProps {
  surfaceId: string
  componentId: string
}

/**
 * Renders a component based on its type from the component registry.
 * Supports custom component overrides via ComponentsMapContext.
 *
 * @example
 * ```tsx
 * // Render a component by ID
 * <ComponentRenderer surfaceId="surface-1" componentId="text-1" />
 * ```
 */
export const ComponentRenderer = memo(function ComponentRenderer({
  surfaceId,
  componentId,
}: ComponentRendererProps) {
  const component = useComponent(surfaceId, componentId)
  const componentsMapContext = useContext(ComponentsMapContext)

  if (!component) {
    console.warn(
      `A2UI: Component not found: ${componentId} on surface ${surfaceId}`
    )
    return null
  }

  // Extract the component type and props from the definition
  // component.component is { [componentType]: props }
  const entries = Object.entries(component.component)
  if (entries.length === 0) {
    console.warn(`A2UI: Component ${componentId} has no type definition`)
    return null
  }

  const [componentType, props] = entries[0]

  const Component = componentsMapContext?.getComponent(componentType)

  if (!Component) {
    // In development mode, render a placeholder for unknown components
    // In production, skip unknown components silently
    console.warn(`A2UI: Unknown component type: ${componentType}`)
    return null
  }

  return (
    // eslint-disable-next-line react-hooks/static-components
    <Component
      surfaceId={surfaceId}
      componentId={componentId}
      weight={component.weight}
      {...(props as Record<string, unknown>)}
    />
  )
})

ComponentRenderer.displayName = 'A2UI.ComponentRenderer'
