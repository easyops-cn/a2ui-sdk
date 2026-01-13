/**
 * useDispatchAction - Hook for dispatching actions from components.
 */

import { useCallback } from 'react'
import type { Action, DataModel } from '@a2ui-sdk/types/0.9'
import { useActionContext } from '../contexts/ActionContext'
import { useSurfaceContext } from '../contexts/SurfaceContext'
import { useScope } from '../contexts/ScopeContext'

/**
 * Returns a function to dispatch actions.
 *
 * @returns A function that dispatches actions
 *
 * @example
 * ```tsx
 * function ButtonComponent({ surfaceId, component }) {
 *   const dispatchAction = useDispatchAction();
 *
 *   const handleClick = () => {
 *     if (component.action) {
 *       dispatchAction(surfaceId, component.id, component.action);
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
  const { getDataModel } = useSurfaceContext()
  const { basePath } = useScope()

  return useCallback(
    (surfaceId: string, componentId: string, action: Action) => {
      const dataModel: DataModel = getDataModel(surfaceId)
      dispatchAction(surfaceId, componentId, action, dataModel, basePath)
    },
    [dispatchAction, getDataModel, basePath]
  )
}
