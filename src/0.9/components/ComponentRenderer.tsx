/**
 * ComponentRenderer - Routes component rendering based on type.
 *
 * Uses the flat discriminator format from 0.9 protocol where
 * the component type is a property on the component itself.
 */

import { memo, useContext, type ComponentType } from 'react'
import { useComponent } from '../hooks/useComponent'
import {
  ComponentsMapContext,
  type A2UIComponentProps,
} from '../contexts/ComponentsMapContext'
import { UnknownComponent } from './UnknownComponent'

/**
 * Component registry mapping component type names to React components.
 * This will be populated with actual components.
 */
export const componentRegistry: Record<
  string,
  ComponentType<A2UIComponentProps>
> = {}

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

  // Try to get component from context first (custom components), then fall back to registry
  let ComponentImpl: ComponentType<A2UIComponentProps> | undefined
  if (componentsMapContext) {
    ComponentImpl = componentsMapContext.getComponent(componentType)
  } else {
    ComponentImpl = componentRegistry[componentType]
  }

  // If component type is unknown, render the fallback
  if (!ComponentImpl) {
    return <UnknownComponent surfaceId={surfaceId} component={component} />
  }

  // Add to rendering set for circular reference detection
  renderingComponents.add(renderKey)

  try {
    return <ComponentImpl surfaceId={surfaceId} component={component} />
  } finally {
    // Remove from rendering set after render
    renderingComponents.delete(renderKey)
  }
})

ComponentRenderer.displayName = 'A2UI.ComponentRenderer'

/**
 * Registers a component type in the default registry.
 *
 * @param type - The component type name
 * @param component - The React component to register
 *
 * @example
 * ```tsx
 * registerComponent('CustomChart', ({ surfaceId, component }) => {
 *   return <Chart data={component.data} />;
 * });
 * ```
 */
export function registerComponent(
  type: string,
  component: ComponentType<A2UIComponentProps>
): void {
  componentRegistry[type] = component
}
