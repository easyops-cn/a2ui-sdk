/**
 * A2UIRenderer - Component for rendering A2UI 0.9 surfaces.
 *
 * This component renders the surfaces from the A2UI context.
 * It must be used within an A2UIProvider.
 *
 * @example
 * ```tsx
 * import { A2UIProvider, A2UIRenderer, A2UIMessage, A2UIAction } from '@a2ui-sdk/react/0.9'
 *
 * function App() {
 *   const messages: A2UIMessage[] = [...]
 *   const handleAction = (action: A2UIAction) => {
 *     console.log('Action:', action)
 *   }
 *   return (
 *     <A2UIProvider messages={messages} onAction={handleAction}>
 *       <A2UIRenderer />
 *     </A2UIProvider>
 *   )
 * }
 * ```
 */

import { useSurfaceContext } from './contexts/SurfaceContext'
import { ComponentRenderer } from './components/ComponentRenderer'
import type { Component } from '@a2ui-sdk/types/0.9'

/**
 * Props for A2UIRenderer.
 */
export interface A2UIRendererProps {
  /** Optional surface ID to render a specific surface (renders all if not provided) */
  surfaceId?: string
}

/**
 * Gets the root component ID from a surface's component tree.
 * The root component is typically identified as "root" or is the first component added.
 */
function findRootComponentId(
  components: Map<string, Component>
): string | undefined {
  // Check for component with id "root"
  if (components.has('root')) {
    return 'root'
  }

  // Otherwise, find a component that has children but is not a child of any other component
  const allChildIds = new Set<string>()

  for (const comp of components.values()) {
    // Check if component has children property (layout components)
    if ('children' in comp) {
      const children = comp.children as
        | string[]
        | { componentId: string; path: string }
      if (Array.isArray(children)) {
        children.forEach((id) => allChildIds.add(id))
      }
    }
    // Check for single child
    if ('child' in comp && typeof comp.child === 'string') {
      allChildIds.add(comp.child)
    }
    // Check for trigger/content (Modal)
    if ('trigger' in comp && typeof comp.trigger === 'string') {
      allChildIds.add(comp.trigger)
    }
    if ('content' in comp && typeof comp.content === 'string') {
      allChildIds.add(comp.content)
    }
    // Check for tabs
    if ('tabs' in comp && Array.isArray(comp.tabs)) {
      ;(comp.tabs as Array<{ child: string }>).forEach((tab) => {
        if (tab.child) allChildIds.add(tab.child)
      })
    }
  }

  // Find a component that is not a child of any other component
  for (const [id] of components) {
    if (!allChildIds.has(id)) {
      return id
    }
  }

  return undefined
}

/**
 * Component for rendering A2UI 0.9 surfaces.
 *
 * Renders all surfaces from the A2UI context, or a specific surface if surfaceId is provided.
 * Must be used within an A2UIProvider.
 *
 * @example
 * ```tsx
 * // Render all surfaces
 * <A2UIProvider messages={messages} onAction={handleAction}>
 *   <A2UIRenderer />
 * </A2UIProvider>
 *
 * // Render specific surface
 * <A2UIProvider messages={messages} onAction={handleAction}>
 *   <A2UIRenderer surfaceId="sidebar" />
 *   <A2UIRenderer surfaceId="main" />
 * </A2UIProvider>
 * ```
 */
export function A2UIRenderer({ surfaceId }: A2UIRendererProps) {
  const { surfaces } = useSurfaceContext()

  // Render specific surface if surfaceId is provided
  if (surfaceId) {
    const surface = surfaces.get(surfaceId)
    if (!surface || !surface.created) {
      return null
    }

    const rootId = findRootComponentId(surface.components)
    if (!rootId) {
      return null
    }

    return <ComponentRenderer surfaceId={surfaceId} componentId={rootId} />
  }

  // Render all surfaces
  const surfaceEntries = Array.from(surfaces.entries())

  if (surfaceEntries.length === 0) {
    return null
  }

  return (
    <>
      {surfaceEntries.map(([id, surface]) => {
        if (!surface.created) {
          return null
        }

        const rootId = findRootComponentId(surface.components)
        if (!rootId) {
          return null
        }

        return (
          <ComponentRenderer key={id} surfaceId={id} componentId={rootId} />
        )
      })}
    </>
  )
}

A2UIRenderer.displayName = 'A2UI.Renderer'
