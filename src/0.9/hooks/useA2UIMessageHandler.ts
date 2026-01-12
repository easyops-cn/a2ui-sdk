/**
 * useA2UIMessageHandler - Hook for processing A2UI 0.9 messages.
 *
 * Handles message buffering for messages received before createSurface.
 */

import { useCallback, useRef } from 'react'
import type { A2UIMessage } from '../types'
import { useSurfaceContext } from '../contexts/SurfaceContext'

/**
 * Return type for the message handler hook.
 */
export interface A2UIMessageHandler {
  /** Processes a single A2UI message */
  processMessage: (message: A2UIMessage) => void

  /** Processes multiple A2UI messages */
  processMessages: (messages: A2UIMessage[]) => void

  /** Clears all surfaces and buffered messages */
  clear: () => void
}

/**
 * Hook that returns functions to process A2UI 0.9 messages.
 *
 * Messages received before createSurface are buffered and applied
 * when createSurface is received.
 *
 * @returns Object with processMessage, processMessages, and clear functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { processMessage, processMessages, clear } = useA2UIMessageHandler();
 *
 *   useEffect(() => {
 *     // Process initial messages
 *     processMessages(initialMessages);
 *
 *     // Listen for SSE updates
 *     const handler = (event) => {
 *       processMessage(JSON.parse(event.data));
 *     };
 *     eventSource.addEventListener('message', handler);
 *
 *     return () => {
 *       eventSource.close();
 *       clear();
 *     };
 *   }, []);
 * }
 * ```
 */
export function useA2UIMessageHandler(): A2UIMessageHandler {
  const {
    createSurface,
    updateComponents,
    updateDataModel,
    deleteSurface,
    clearSurfaces,
  } = useSurfaceContext()

  // Buffer for messages received before createSurface
  const messageBuffer = useRef<Map<string, A2UIMessage[]>>(new Map())

  // Track created surfaces synchronously (state updates are async)
  const createdSurfacesRef = useRef<Set<string>>(new Set())

  /**
   * Applies buffered messages for a surface.
   */
  const applyBufferedMessages = useCallback(
    (surfaceId: string) => {
      const buffered = messageBuffer.current.get(surfaceId)
      if (!buffered || buffered.length === 0) {
        return
      }

      // Process each buffered message
      for (const message of buffered) {
        if ('updateComponents' in message) {
          updateComponents(surfaceId, message.updateComponents.components)
        } else if ('updateDataModel' in message) {
          const { path, value } = message.updateDataModel
          updateDataModel(surfaceId, path, value)
        }
      }

      // Clear the buffer for this surface
      messageBuffer.current.delete(surfaceId)
    },
    [updateComponents, updateDataModel]
  )

  /**
   * Buffers a message for later processing.
   */
  const bufferMessage = useCallback(
    (surfaceId: string, message: A2UIMessage) => {
      const existing = messageBuffer.current.get(surfaceId) ?? []
      messageBuffer.current.set(surfaceId, [...existing, message])
    },
    []
  )

  const processMessage = useCallback(
    (message: A2UIMessage) => {
      // Handle createSurface
      if ('createSurface' in message) {
        const { surfaceId, catalogId } = message.createSurface
        createSurface(surfaceId, catalogId)
        // Track synchronously so subsequent messages in the same batch work
        createdSurfacesRef.current.add(surfaceId)
        // Apply any buffered messages
        applyBufferedMessages(surfaceId)
        return
      }

      // Handle updateComponents
      if ('updateComponents' in message) {
        const { surfaceId, components } = message.updateComponents

        // Check synchronous tracking (not async state)
        if (!createdSurfacesRef.current.has(surfaceId)) {
          // Buffer until createSurface is received
          bufferMessage(surfaceId, message)
          return
        }

        updateComponents(surfaceId, components)
        return
      }

      // Handle updateDataModel
      if ('updateDataModel' in message) {
        const { surfaceId, path, value } = message.updateDataModel

        // Check synchronous tracking (not async state)
        if (!createdSurfacesRef.current.has(surfaceId)) {
          // Buffer until createSurface is received
          bufferMessage(surfaceId, message)
          return
        }

        updateDataModel(surfaceId, path, value)
        return
      }

      // Handle deleteSurface
      if ('deleteSurface' in message) {
        const { surfaceId } = message.deleteSurface
        deleteSurface(surfaceId)
        // Also clear tracking and buffered messages for this surface
        createdSurfacesRef.current.delete(surfaceId)
        messageBuffer.current.delete(surfaceId)
        return
      }
    },
    [
      createSurface,
      updateComponents,
      updateDataModel,
      deleteSurface,
      applyBufferedMessages,
      bufferMessage,
    ]
  )

  const processMessages = useCallback(
    (messages: A2UIMessage[]) => {
      for (const message of messages) {
        processMessage(message)
      }
    },
    [processMessage]
  )

  const clear = useCallback(() => {
    clearSurfaces()
    messageBuffer.current.clear()
    createdSurfacesRef.current.clear()
  }, [clearSurfaces])

  return {
    processMessage,
    processMessages,
    clear,
  }
}
