/**
 * ScopeContext - Context for collection scopes.
 *
 * Tracks the current data path when rendering template-bound children.
 * Relative paths resolve within the current scope, while absolute paths
 * resolve from the root data model.
 */

import { createContext, useContext, type ReactNode } from 'react'
import type { ScopeValue } from '@a2ui-sdk/types/0.9'

/**
 * Default scope value (root scope).
 */
const defaultScopeValue: ScopeValue = {
  basePath: null,
}

/**
 * Context for tracking collection scopes.
 *
 * When rendering children from template binding (e.g., List with `{"componentId": "item", "path": "/items"}`),
 * each item gets its own scope with a base path like "/items/0", "/items/1", etc.
 *
 * Components use this context to resolve relative paths within their scope.
 */
export const ScopeContext = createContext<ScopeValue>(defaultScopeValue)

/**
 * Props for ScopeProvider.
 */
export interface ScopeProviderProps {
  /** The base path for this scope (e.g., "/items/0") */
  basePath: string
  children: ReactNode
}

/**
 * Provider for creating a new scope.
 *
 * @example
 * ```tsx
 * // In ListComponent when rendering template children:
 * {items.map((_, index) => (
 *   <ScopeProvider key={index} basePath={`${dataPath}/${index}`}>
 *     <ComponentRenderer id={templateComponentId} />
 *   </ScopeProvider>
 * ))}
 * ```
 */
export function ScopeProvider({ basePath, children }: ScopeProviderProps) {
  const value: ScopeValue = { basePath }

  return <ScopeContext.Provider value={value}>{children}</ScopeContext.Provider>
}

/**
 * Hook to access the current scope.
 *
 * @returns The current scope value
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { basePath } = useScope()
 *   // basePath is null for root scope, or something like "/items/0" for item scope
 * }
 * ```
 */
export function useScope(): ScopeValue {
  return useContext(ScopeContext)
}

/**
 * Hook to get the base path for the current scope.
 *
 * @returns The base path (null for root scope, string for nested scope)
 */
export function useScopeBasePath(): string | null {
  const { basePath } = useScope()
  return basePath
}
