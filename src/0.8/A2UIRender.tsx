/**
 * A2UIRender - Main entry component for rendering A2UI messages.
 *
 * This component processes A2UI messages and renders the resulting UI.
 * It supports custom component overrides via the components prop.
 *
 * @example
 * ```tsx
 * import { A2UIRender, A2UIMessage, A2UIAction } from '@easyops-cn/a2ui-react/0.8'
 *
 * function App() {
 *   const messages: A2UIMessage[] = [...]
 *   const handleAction = (action: A2UIAction) => {
 *     console.log('Action:', action)
 *   }
 *   return <A2UIRender messages={messages} onAction={handleAction} />
 * }
 * ```
 */

import { useEffect, type ComponentType } from 'react'
import type { A2UIMessage, ActionPayload, BaseComponentProps } from './types'
import { A2UIProvider } from './contexts/A2UIProvider'
import { ComponentsMapProvider } from './contexts/ComponentsMapContext'
import { useSurfaceContext } from './contexts/SurfaceContext'
import { useA2UIMessageHandler } from './hooks/useA2UIMessageHandler'
import {
  ComponentRenderer,
  componentRegistry,
} from './components/ComponentRenderer'

/**
 * Type for custom component map.
 */
export type ComponentsMap = Map<
  string,
  ComponentType<BaseComponentProps & Record<string, unknown>>
>

/**
 * Props for A2UIRender component.
 */
export interface A2UIRenderProps {
  /** Array of A2UI messages to render */
  messages: A2UIMessage[]
  /** Callback when an action is dispatched */
  onAction?: (action: ActionPayload) => void
  /** Custom component overrides */
  components?: ComponentsMap
}

/**
 * Internal component that handles message processing and surface rendering.
 */
function A2UIRenderInner({ messages }: { messages: A2UIMessage[] }) {
  const { processMessages, clear } = useA2UIMessageHandler()
  const { surfaces } = useSurfaceContext()

  // Process messages when they change
  useEffect(() => {
    // Clear existing state and process new messages
    clear()
    if (messages && messages.length > 0) {
      processMessages(messages)
    }
  }, [messages, processMessages, clear])

  // Render all surfaces
  const surfaceEntries = Array.from(surfaces.entries())

  if (surfaceEntries.length === 0) {
    return null
  }

  return (
    <>
      {surfaceEntries.map(([surfaceId, surface]) => {
        // Only render surfaces that have a root component
        if (!surface.root) {
          return null
        }
        return (
          <ComponentRenderer
            key={surfaceId}
            surfaceId={surfaceId}
            componentId={surface.root}
          />
        )
      })}
    </>
  )
}

/**
 * Main entry component for rendering A2UI messages.
 *
 * Processes an array of A2UIMessage objects and renders the resulting UI.
 * Supports custom component overrides via the components prop.
 *
 * @param props - Component props
 * @param props.messages - Array of A2UI messages to render
 * @param props.onAction - Optional callback when an action is dispatched
 * @param props.components - Optional custom component overrides
 *
 * @example
 * ```tsx
 * // Basic usage
 * <A2UIRender messages={messages} onAction={handleAction} />
 *
 * // With custom components
 * const customComponents = new Map([
 *   ['Button', CustomButton],
 *   ['Switch', CustomSwitch],
 * ])
 * <A2UIRender
 *   messages={messages}
 *   onAction={handleAction}
 *   components={customComponents}
 * />
 * ```
 */
export function A2UIRender({
  messages,
  onAction,
  components,
}: A2UIRenderProps) {
  // Handle null/undefined messages gracefully
  const safeMessages = messages ?? []

  return (
    <A2UIProvider onAction={onAction}>
      <ComponentsMapProvider
        components={components}
        defaultComponents={componentRegistry}
      >
        <A2UIRenderInner messages={safeMessages} />
      </ComponentsMapProvider>
    </A2UIProvider>
  )
}

A2UIRender.displayName = 'A2UI.Render'
