/**
 * ActionContext - Manages action dispatching for A2UI 0.9 components.
 *
 * Actions are triggered by user interactions (button clicks, form changes, etc.)
 * and are forwarded to the parent application for handling.
 */

import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react'
import type {
  Action,
  ActionPayload,
  ActionHandler,
  DynamicValue,
  DataModel,
} from '@a2ui-sdk/types/0.9'
import { resolveContext } from '@a2ui-sdk/utils/0.9'

/**
 * Action context value interface.
 */
export interface ActionContextValue {
  /** Dispatches an action with resolved context */
  dispatchAction: (
    surfaceId: string,
    componentId: string,
    action: Action,
    dataModel: DataModel,
    basePath?: string | null
  ) => void

  /** The action handler callback (if set) */
  onAction: ActionHandler | null
}

/**
 * Action context for A2UI 0.9 rendering.
 */
export const ActionContext = createContext<ActionContextValue | null>(null)

/**
 * Props for ActionProvider.
 */
export interface ActionProviderProps {
  /** Callback when an action is dispatched */
  onAction?: ActionHandler
  children: ReactNode
}

/**
 * Provider component for Action dispatching.
 */
export function ActionProvider({ onAction, children }: ActionProviderProps) {
  const dispatchAction = useCallback(
    (
      surfaceId: string,
      componentId: string,
      action: Action,
      dataModel: DataModel,
      basePath: string | null = null
    ) => {
      if (!onAction) {
        console.warn(
          '[A2UI 0.9] Action dispatched but no handler is registered'
        )
        return
      }

      // Resolve the action context values
      const resolvedContext = resolveContext(
        action.context as Record<string, DynamicValue> | undefined,
        dataModel,
        basePath
      )

      // Create the action payload
      const payload: ActionPayload = {
        surfaceId,
        name: action.name,
        context: resolvedContext,
        sourceComponentId: componentId,
        timestamp: new Date().toISOString(),
      }

      // Call the handler
      onAction(payload)
    },
    [onAction]
  )

  const value = useMemo<ActionContextValue>(
    () => ({
      dispatchAction,
      onAction: onAction ?? null,
    }),
    [dispatchAction, onAction]
  )

  return (
    <ActionContext.Provider value={value}>{children}</ActionContext.Provider>
  )
}

/**
 * Hook to access the Action context.
 *
 * @throws Error if used outside of ActionProvider
 */
export function useActionContext(): ActionContextValue {
  const context = useContext(ActionContext)
  if (!context) {
    throw new Error('useActionContext must be used within an ActionProvider')
  }
  return context
}
