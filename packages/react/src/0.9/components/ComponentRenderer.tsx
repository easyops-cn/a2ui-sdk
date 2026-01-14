/**
 * ComponentRenderer - Routes component rendering based on type.
 *
 * Uses the flat discriminator format from 0.9 protocol where
 * the component type is a property on the component itself.
 * Props are spread directly to components like in v0.8.
 */

import { memo, useContext } from 'react'
import { useComponent } from '../hooks/useComponent'
import { ComponentsMapContext } from '../contexts/ComponentsMapContext'
import { UnknownComponent } from './UnknownComponent'

/**
 * Props for ComponentRenderer.
 */
export interface ComponentRendererProps {
  surfaceId: string
  componentId: string
}

/**
 * Set of component IDs currently being rendered (for circular reference detection).
 */
const renderingComponents = new Set<string>()

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

  // Check for circular reference
  const renderKey = `${surfaceId}:${componentId}`
  if (renderingComponents.has(renderKey)) {
    console.error(
      `[A2UI 0.9] Circular reference detected for component "${componentId}" on surface "${surfaceId}". Skipping render.`
    )
    return null
  }

  if (!component) {
    console.warn(
      `[A2UI 0.9] Component not found: ${componentId} on surface ${surfaceId}`
    )
    return null
  }

  // Get the component type from the discriminator property
  const componentType = component.component

  const ComponentImpl = componentsMapContext?.getComponent(componentType)

  // If component type is unknown, render the fallback
  if (!ComponentImpl) {
    return (
      <UnknownComponent
        surfaceId={surfaceId}
        componentId={componentId}
        componentType={componentType}
      />
    )
  }

  // Add to rendering set for circular reference detection
  renderingComponents.add(renderKey)

  // Extract props from component, excluding 'component' (the type discriminator) and 'id'
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { component: _type, id: _id, ...props } = component

  try {
    return (
      <ComponentImpl
        surfaceId={surfaceId}
        componentId={componentId}
        {...props}
      />
    )
  } finally {
    // Remove from rendering set after render
    renderingComponents.delete(renderKey)
  }
})

ComponentRenderer.displayName = 'A2UI.ComponentRenderer'
