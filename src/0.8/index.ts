/**
 * A2UI React Renderer - Public API
 *
 * This is the main entry point for the A2UI React renderer library.
 * Import from '@easyops-cn/a2ui-react/0.8'
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

// ============ Types ============

export type {
  A2UIMessage,
  ActionPayload as A2UIAction,
  Action,
  ValueSource,
} from './types'

// ============ Components ============

export { A2UIRender } from './A2UIRender'
export { ComponentRenderer } from './components/ComponentRenderer'

// ============ Hooks ============

export { useDispatchAction } from './hooks/useDispatchAction'
export { useDataBinding, useFormBinding } from './hooks/useDataBinding'
