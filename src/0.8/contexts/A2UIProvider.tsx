/**
 * A2UIProvider - Combined provider for all A2UI contexts.
 *
 * This component wraps all the necessary context providers for A2UI rendering.
 * It should be placed at the top level of any component tree that uses A2UI.
 */

import { type ReactNode } from 'react'
import { SurfaceProvider } from './SurfaceContext'
import { DataModelProvider } from './DataModelContext'
import { ActionProvider } from './ActionContext'
import type { ActionHandler } from '../types'

/**
 * Props for A2UIProvider.
 */
export interface A2UIProviderProps {
  /** Callback when an action is dispatched */
  onAction?: ActionHandler
  children: ReactNode
}

/**
 * Combined provider for all A2UI contexts.
 *
 * Provides:
 * - SurfaceContext: Component tree management
 * - DataModelContext: Data model state
 * - ActionContext: Action dispatching
 *
 * @example
 * ```tsx
 * function App() {
 *   const handleAction = (action) => {
 *     console.log('Action:', action);
 *   };
 *
 *   return (
 *     <A2UIProvider onAction={handleAction}>
 *       <A2UIReactRenderer messages={messages} />
 *     </A2UIProvider>
 *   );
 * }
 * ```
 */
export function A2UIProvider({ onAction, children }: A2UIProviderProps) {
  return (
    <SurfaceProvider>
      <DataModelProvider>
        <ActionProvider onAction={onAction}>{children}</ActionProvider>
      </DataModelProvider>
    </SurfaceProvider>
  )
}
