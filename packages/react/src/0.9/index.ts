/**
 * A2UI 0.9 React Renderer - Public API
 *
 * This is the main entry point for the A2UI 0.9 React renderer library.
 * Import from '@a2ui-sdk/react/0.9'
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

// ============ Types ============

export type {
  // Message types
  A2UIMessage,
  CreateSurfacePayload,
  UpdateComponentsPayload,
  UpdateDataModelPayload,
  DeleteSurfacePayload,
  // Component types
  Component,
  TextComponent,
  ImageComponent,
  IconComponent,
  VideoComponent,
  AudioPlayerComponent,
  DividerComponent,
  RowComponent,
  ColumnComponent,
  ListComponent,
  CardComponent,
  TabsComponent,
  ModalComponent,
  ButtonComponent,
  TextFieldComponent,
  CheckBoxComponent,
  ChoicePickerComponent,
  SliderComponent,
  DateTimeInputComponent,
  // Value types
  DynamicValue,
  DynamicString,
  DynamicNumber,
  DynamicBoolean,
  DynamicStringList,
  ChildList,
  TemplateBinding,
  // Action types
  Action,
  ActionPayload as A2UIAction,
  ActionHandler,
  // Validation types
  CheckRule,
  Checkable,
  ValidationResult,
  // State types
  ScopeValue,
  DataModel,
} from '@a2ui-sdk/types/0.9'

export type { A2UIProviderProps, ComponentsMap } from './contexts/A2UIProvider'
export type { A2UIRendererProps } from './A2UIRenderer'

// ============ Components ============

export { A2UIProvider } from './contexts/A2UIProvider'
export { A2UIRenderer } from './A2UIRenderer'
export { ComponentRenderer } from './components/ComponentRenderer'

// ============ Hooks ============

export { useDispatchAction } from './hooks/useDispatchAction'
export {
  useDataBinding,
  useFormBinding,
  useStringBinding,
  useDataModel,
} from './hooks/useDataBinding'
export { useValidation } from './hooks/useValidation'
export { useSurfaceContext } from './contexts/SurfaceContext'
export { useScope, useScopeBasePath } from './contexts/ScopeContext'

// ============ Validation Utilities ============

export {
  validationFunctions,
  evaluateChecks,
  evaluateCheckRule,
  type ValidationFunction,
  type EvaluationContext,
} from './utils/validation'
