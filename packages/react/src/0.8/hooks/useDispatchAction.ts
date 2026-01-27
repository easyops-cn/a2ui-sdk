/**
 * useDispatchAction - Hook for dispatching actions from components.
 */

import { useCallback } from 'react'
import type { Action } from '@a2ui-sdk/types/0.8'
import { useActionContext } from '../contexts/ActionContext'
import { useScopeBasePath } from '../contexts/ScopeContext'

/**
 * Returns a function to dispatch actions.
 * Automatically captures the current scope context for action resolution.
 *
 * @returns A function that dispatches actions
 *
 * @example
 * ```tsx
 * function ButtonComponent({ surfaceId, componentId, action }) {
 *   const dispatchAction = useDispatchAction();
 *
 *   const handleClick = () => {
 *     if (action) {
 *       dispatchAction(surfaceId, componentId, action);
 *     }
 *   };
 *
 *   return <button onClick={handleClick}>Click me</button>;
 * }
 * ```
 */
export function useDispatchAction(): (
  surfaceId: string,
  componentId: string,
  action: Action
) => void {
  const { dispatchAction } = useActionContext()
  const basePath = useScopeBasePath()

  return useCallback(
    (surfaceId: string, componentId: string, action: Action) => {
      dispatchAction(surfaceId, componentId, action, basePath)
    },
    [dispatchAction, basePath]
  )
}
