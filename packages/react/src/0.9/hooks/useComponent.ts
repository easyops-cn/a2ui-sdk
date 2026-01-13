/**
 * useComponent - Hook to get a component from a Surface.
 */

import { useMemo } from 'react'
import type { Component } from '@a2ui-sdk/types/0.9'
import { useSurfaceContext } from '../contexts/SurfaceContext'

/**
 * Gets a component from a Surface by its ID.
 *
 * @param surfaceId - The surface ID
 * @param componentId - The component ID to look up
 * @returns The Component, or undefined if not found
 *
 * @example
 * ```tsx
 * function MyComponent({ surfaceId, componentId }) {
 *   const component = useComponent(surfaceId, componentId);
 *
 *   if (!component) {
 *     return null;
 *   }
 *
 *   // Use component.component to get the type ("Text", "Button", etc.)
 *   // All other properties are available directly on the component
 * }
 * ```
 */
export function useComponent(
  surfaceId: string,
  componentId: string
): Component | undefined {
  const { getComponent } = useSurfaceContext()

  return useMemo(() => {
    return getComponent(surfaceId, componentId)
  }, [getComponent, surfaceId, componentId])
}
