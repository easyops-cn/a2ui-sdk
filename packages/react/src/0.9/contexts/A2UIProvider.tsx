/**
 * A2UIProvider - Combined provider for all A2UI 0.9 contexts.
 *
 * This component wraps all the necessary context providers for A2UI rendering.
 * It should be placed at the top level of any component tree that uses A2UI.
 *
 * @example
 * ```tsx
 * import { A2UIProvider, A2UIRenderer, A2UIMessage, A2UIAction } from '@a2ui-sdk/react/0.9'
 * import { standardCatalog } from '@a2ui-sdk/react/0.9/standard-catalog'
 *
 * function App() {
 *   const messages: A2UIMessage[] = [...]
 *   const handleAction = (action: A2UIAction) => {
 *     console.log('Action:', action)
 *   }
 *   return (
 *     <A2UIProvider messages={messages}>
 *       <A2UIRenderer onAction={handleAction} />
 *     </A2UIProvider>
 *   )
 * }
 *
 * // With extended catalog (add custom components on top of standard)
 * function AppWithExtendedCatalog() {
 *   const extendedCatalog = {
 *     ...standardCatalog,
 *     components: {
 *       ...standardCatalog.components,
 *       CustomChart: MyChartComponent,
 *     },
 *   }
 *   return (
 *     <A2UIProvider messages={messages} catalog={extendedCatalog}>
 *       <A2UIRenderer onAction={handleAction} />
 *     </A2UIProvider>
 *   )
 * }
 *
 * // With completely custom catalog (override everything)
 * function AppWithCustomCatalog() {
 *   const customCatalog = {
 *     components: { Text: MyTextComponent },
 *     functions: {},
 *   }
 *   return (
 *     <A2UIProvider messages={messages} catalog={customCatalog}>
 *       <A2UIRenderer onAction={handleAction} />
 *     </A2UIProvider>
 *   )
 * }
 * ```
 */

import { useEffect, type ReactNode } from 'react'
import { SurfaceProvider } from './SurfaceContext'
import { ComponentsMapProvider } from './ComponentsMapContext'
import type { A2UIMessage } from '@a2ui-sdk/types/0.9'
import { useA2UIMessageHandler } from '../hooks/useA2UIMessageHandler'
import { standardCatalog, type Catalog } from '../standard-catalog'

/**
 * Props for A2UIProvider.
 */
export interface A2UIProviderProps {
  /** Array of A2UI messages to render */
  messages: A2UIMessage[]
  /**
   * Catalog containing components and functions.
   * Use `standardCatalog` from '@a2ui-sdk/react/0.9/standard-catalog' as base.
   *
   * @example
   * ```tsx
   * // Extend standard catalog
   * const catalog = {
   *   ...standardCatalog,
   *   components: { ...standardCatalog.components, Custom: MyComponent },
   * }
   * ```
   */
  catalog?: Catalog
  children: ReactNode
}

/**
 * Internal component that handles message processing.
 */
function A2UIMessageProcessor({
  messages,
  children,
}: {
  messages: A2UIMessage[]
  children: ReactNode
}) {
  const { processMessages, clear } = useA2UIMessageHandler()

  // Process messages when they change
  useEffect(() => {
    // Clear existing state and process new messages
    clear()
    if (messages && messages.length > 0) {
      processMessages(messages)
    }
  }, [messages, processMessages, clear])

  return <>{children}</>
}

/**
 * Combined provider for all A2UI 0.9 contexts.
 *
 * Provides:
 * - SurfaceContext: Multi-surface state management
 * - ComponentsMapContext: Custom component overrides
 *
 * @param props - Component props
 * @param props.messages - Array of A2UI messages to render
 * @param props.catalog - Catalog containing components and functions
 * @param props.children - Child components (typically A2UIRenderer)
 *
 * @example
 * ```tsx
 * import { standardCatalog } from '@a2ui-sdk/react/0.9/standard-catalog'
 *
 * // Basic usage (uses standard catalog by default)
 * <A2UIProvider messages={messages}>
 *   <A2UIRenderer onAction={handleAction} />
 * </A2UIProvider>
 *
 * // With extended catalog
 * const extendedCatalog = {
 *   ...standardCatalog,
 *   components: {
 *     ...standardCatalog.components,
 *     CustomChart: MyChartComponent,
 *   },
 * }
 * <A2UIProvider messages={messages} catalog={extendedCatalog}>
 *   <A2UIRenderer onAction={handleAction} />
 * </A2UIProvider>
 *
 * // With completely custom catalog
 * const customCatalog = {
 *   components: { Text: MyTextComponent },
 *   functions: {},
 * }
 * <A2UIProvider messages={messages} catalog={customCatalog}>
 *   <A2UIRenderer onAction={handleAction} />
 * </A2UIProvider>
 *
 * // Render specific surfaces
 * <A2UIProvider messages={messages}>
 *   <A2UIRenderer surfaceId="sidebar" onAction={handleAction} />
 *   <A2UIRenderer surfaceId="main" onAction={handleAction} />
 * </A2UIProvider>
 * ```
 */
export function A2UIProvider({
  messages,
  catalog,
  children,
}: A2UIProviderProps) {
  // Handle null/undefined messages gracefully
  const safeMessages = messages ?? []

  // Determine the components to use:
  // 1. If catalog is provided, use catalog.components directly
  // 2. Otherwise, use standard catalog
  const effectiveCatalog = catalog ?? standardCatalog

  return (
    <SurfaceProvider>
      <ComponentsMapProvider components={effectiveCatalog.components}>
        <A2UIMessageProcessor messages={safeMessages}>
          {children}
        </A2UIMessageProcessor>
      </ComponentsMapProvider>
    </SurfaceProvider>
  )
}
