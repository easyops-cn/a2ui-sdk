/**
 * A2UIProvider - Combined provider for all A2UI 0.9 contexts.
 *
 * This component wraps all the necessary context providers for A2UI rendering.
 * It should be placed at the top level of any component tree that uses A2UI.
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

import { useEffect, type ReactNode } from 'react'
import { SurfaceProvider } from './SurfaceContext'
import { ActionProvider } from './ActionContext'
import {
  ComponentsMapProvider,
  type ComponentsMap,
} from './ComponentsMapContext'
import type { A2UIMessage, ActionHandler } from '@a2ui-sdk/types/0.9'
import { useA2UIMessageHandler } from '../hooks/useA2UIMessageHandler'
import { componentRegistry } from '../components'

export type { ComponentsMap }

/**
 * Props for A2UIProvider.
 */
export interface A2UIProviderProps {
  /** Array of A2UI messages to render */
  messages: A2UIMessage[]
  /** Callback when an action is dispatched */
  onAction?: ActionHandler
  /** Custom component overrides */
  components?: ComponentsMap
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
 * - ActionContext: Action dispatch handling
 * - ComponentsMapContext: Custom component overrides
 *
 * @param props - Component props
 * @param props.messages - Array of A2UI messages to render
 * @param props.onAction - Callback when an action is dispatched
 * @param props.components - Optional custom component overrides
 * @param props.children - Child components (typically A2UIRenderer)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <A2UIProvider messages={messages} onAction={handleAction}>
 *   <A2UIRenderer />
 * </A2UIProvider>
 *
 * // With custom components
 * const customComponents = new Map([
 *   ['Button', CustomButton],
 *   ['Switch', CustomSwitch],
 * ])
 * <A2UIProvider
 *   messages={messages}
 *   onAction={handleAction}
 *   components={customComponents}
 * >
 *   <A2UIRenderer />
 * </A2UIProvider>
 *
 * // Render specific surfaces
 * <A2UIProvider messages={messages} onAction={handleAction}>
 *   <A2UIRenderer surfaceId="sidebar" />
 *   <A2UIRenderer surfaceId="main" />
 * </A2UIProvider>
 * ```
 */
export function A2UIProvider({
  messages,
  onAction,
  components,
  children,
}: A2UIProviderProps) {
  // Handle null/undefined messages gracefully
  const safeMessages = messages ?? []

  return (
    <SurfaceProvider>
      <ActionProvider onAction={onAction}>
        <ComponentsMapProvider
          components={components}
          defaultComponents={componentRegistry}
        >
          <A2UIMessageProcessor messages={safeMessages}>
            {children}
          </A2UIMessageProcessor>
        </ComponentsMapProvider>
      </ActionProvider>
    </SurfaceProvider>
  )
}
