/**
 * ComponentsMapContext - Context for custom component overrides.
 *
 * This context allows users to provide custom component implementations
 * that override or extend the default component registry.
 */

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
  type ComponentType,
} from 'react'
import type { A2UIComponentProps } from '@/0.9/components/types'
import { hasOwn } from '@/lib/utils'

/**
 * Type for a component in the components map.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type A2UIComponent = ComponentType<A2UIComponentProps & any>

/**
 * Context value for ComponentsMapContext.
 */
export interface ComponentsMapContextValue {
  /** Get a component by type name */
  getComponent: (type: string) => A2UIComponent | undefined
}

/**
 * Context for custom component overrides.
 */
export const ComponentsMapContext =
  createContext<ComponentsMapContextValue | null>(null)

/**
 * Props for ComponentsMapProvider.
 */
export interface ComponentsMapProviderProps {
  /** Component registry */
  components: Record<string, A2UIComponent>
  children: ReactNode
}

/**
 * Provider for component registry.
 *
 * @example
 * ```tsx
 * <ComponentsMapProvider components={catalog.components}>
 *   <App />
 * </ComponentsMapProvider>
 * ```
 */
export function ComponentsMapProvider({
  components,
  children,
}: ComponentsMapProviderProps) {
  const value = useMemo<ComponentsMapContextValue>(() => {
    const getComponent = (type: string): A2UIComponent | undefined => {
      return hasOwn(components, type) ? components[type] : undefined
    }

    return {
      getComponent,
    }
  }, [components])

  return (
    <ComponentsMapContext.Provider value={value}>
      {children}
    </ComponentsMapContext.Provider>
  )
}

/**
 * Hook to access the ComponentsMap context.
 *
 * @throws Error if used outside of ComponentsMapProvider
 */
export function useComponentsMapContext(): ComponentsMapContextValue {
  const context = useContext(ComponentsMapContext)
  if (!context) {
    throw new Error(
      'useComponentsMapContext must be used within a ComponentsMapProvider'
    )
  }
  return context
}

/**
 * Hook to get a component by type name.
 * Returns custom component if available, otherwise default.
 *
 * @param type - The component type name
 * @returns The component or undefined if not found
 */
export function useComponentFromMap(type: string): A2UIComponent | undefined {
  const { getComponent } = useComponentsMapContext()
  return getComponent(type)
}
