/**
 * A2UI 0.9 React Renderer - Type Definitions
 *
 * Core type definitions for the A2UI 0.9 React renderer.
 * Based on the A2UI 0.9 protocol specification.
 */

// ============ Message Types (Server to Client) ============

/**
 * A2UI message from server to client.
 * Each message contains exactly one of the four message types.
 */
export type A2UIMessage =
  | { createSurface: CreateSurfacePayload }
  | { updateComponents: UpdateComponentsPayload }
  | { updateDataModel: UpdateDataModelPayload }
  | { deleteSurface: DeleteSurfacePayload }

/**
 * CreateSurface message payload - initializes a new Surface.
 */
export interface CreateSurfacePayload {
  surfaceId: string
  catalogId: string
}

/**
 * UpdateComponents message payload - adds/updates components in the surface's component tree.
 */
export interface UpdateComponentsPayload {
  surfaceId: string
  components: Component[]
}

/**
 * UpdateDataModel message payload - updates the data model at a specific path.
 */
export interface UpdateDataModelPayload {
  surfaceId: string
  /** JSON Pointer path (RFC 6901), defaults to "/" (root) */
  path?: string
  /** If omitted, data at path is removed */
  value?: unknown
}

/**
 * DeleteSurface message payload - removes a Surface.
 */
export interface DeleteSurfacePayload {
  surfaceId: string
}

// ============ Dynamic Value Types ============

/**
 * A function call expression.
 */
export interface FunctionCall {
  call: string
  args?: Record<string, DynamicValue>
  returnType?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'any'
}

/**
 * Logic expression for boolean evaluation.
 */
export type LogicExpression =
  | { and: LogicExpression[] }
  | { or: LogicExpression[] }
  | { not: LogicExpression }
  | FunctionCall
  | { true: true }
  | { false: false }

/**
 * Generic dynamic value (any type).
 */
export type DynamicValue =
  | string
  | number
  | boolean
  | { path: string }
  | FunctionCall

/**
 * Dynamic string value.
 */
export type DynamicString = string | { path: string } | FunctionCall

/**
 * Dynamic number value.
 */
export type DynamicNumber = number | { path: string } | FunctionCall

/**
 * Dynamic boolean value.
 */
export type DynamicBoolean = boolean | { path: string } | LogicExpression

/**
 * Dynamic string list value.
 */
export type DynamicStringList = string[] | { path: string } | FunctionCall

/**
 * Union of all bindable value types (for form binding hooks).
 * Used by useFormBinding to accept any dynamic value type.
 */
export type FormBindableValue =
  | DynamicValue
  | DynamicString
  | DynamicNumber
  | DynamicBoolean
  | DynamicStringList

// ============ Children Definition ============

/**
 * Template binding for dynamic child generation.
 */
export interface TemplateBinding {
  componentId: string
  path: string
}

/**
 * Children definition for container components.
 */
export type ChildList =
  | string[] // Static list of component IDs
  | TemplateBinding // Template binding

// ============ Validation ============

/**
 * Check rule for validation.
 */
export interface CheckRule {
  message: string
  call?: string
  args?: Record<string, DynamicValue>
  and?: CheckRule[]
  or?: CheckRule[]
  not?: CheckRule
  true?: true
  false?: false
}

/**
 * Mixin interface for components that support validation checks.
 */
export interface Checkable {
  checks?: CheckRule[]
}

// ============ Base Component ============

/**
 * Base component properties that all components share.
 */
export interface ComponentBase {
  id: string
  /** Discriminator: "Text", "Button", etc. */
  component: string
  /** flex-grow for Row/Column children */
  weight?: number
}

// ============ Display Components ============

/**
 * Text component.
 */
export interface TextComponent extends ComponentBase {
  component: 'Text'
  text: DynamicString
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'caption' | 'body'
}

/**
 * Image component.
 */
export interface ImageComponent extends ComponentBase {
  component: 'Image'
  url: DynamicString
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  variant?:
    | 'icon'
    | 'avatar'
    | 'smallFeature'
    | 'mediumFeature'
    | 'largeFeature'
    | 'header'
}

/**
 * Icon component.
 */
export interface IconComponent extends ComponentBase {
  component: 'Icon'
  name: DynamicString
}

/**
 * Video component.
 */
export interface VideoComponent extends ComponentBase {
  component: 'Video'
  url: DynamicString
}

/**
 * AudioPlayer component.
 */
export interface AudioPlayerComponent extends ComponentBase {
  component: 'AudioPlayer'
  url: DynamicString
  description?: DynamicString
}

/**
 * Divider component.
 */
export interface DividerComponent extends ComponentBase {
  component: 'Divider'
  axis?: 'horizontal' | 'vertical'
}

// ============ Layout Components ============

/**
 * Justify values for flex layouts (main axis distribution).
 */
export type Justify =
  | 'start'
  | 'center'
  | 'end'
  | 'spaceBetween'
  | 'spaceAround'
  | 'spaceEvenly'
  | 'stretch'

/**
 * Align values for flex layouts (cross axis alignment).
 */
export type Align = 'start' | 'center' | 'end' | 'stretch'

/**
 * Row component.
 */
export interface RowComponent extends ComponentBase {
  component: 'Row'
  children: ChildList
  justify?: Justify
  align?: Align
}

/**
 * Column component.
 */
export interface ColumnComponent extends ComponentBase {
  component: 'Column'
  children: ChildList
  justify?: Justify
  align?: Align
}

/**
 * List component.
 */
export interface ListComponent extends ComponentBase {
  component: 'List'
  children: ChildList
  direction?: 'vertical' | 'horizontal'
  align?: Align
}

/**
 * Card component.
 */
export interface CardComponent extends ComponentBase {
  component: 'Card'
  /** Single child component ID */
  child: string
}

/**
 * Tab item definition.
 */
export interface TabItem {
  title: DynamicString
  /** Component ID */
  child: string
}

/**
 * Tabs component.
 */
export interface TabsComponent extends ComponentBase {
  component: 'Tabs'
  tabs: TabItem[]
}

/**
 * Modal component.
 */
export interface ModalComponent extends ComponentBase {
  component: 'Modal'
  /** Component ID for trigger */
  trigger: string
  /** Component ID for content */
  content: string
}

// ============ Interactive Components ============

/**
 * Action definition (attached to Button components).
 */
export interface Action {
  name: string
  context?: Record<string, DynamicValue>
}

/**
 * Button component.
 */
export interface ButtonComponent extends ComponentBase, Checkable {
  component: 'Button'
  /** Component ID (typically Text or Icon) */
  child: string
  primary?: boolean
  action: Action
}

/**
 * TextField component.
 */
export interface TextFieldComponent extends ComponentBase, Checkable {
  component: 'TextField'
  label: DynamicString
  /** Two-way binding path */
  value?: DynamicString
  variant?: 'longText' | 'number' | 'shortText' | 'obscured'
}

/**
 * CheckBox component.
 */
export interface CheckBoxComponent extends ComponentBase, Checkable {
  component: 'CheckBox'
  label: DynamicString
  /** Two-way binding path */
  value: DynamicBoolean
}

/**
 * Choice option definition.
 */
export interface ChoiceOption {
  label: DynamicString
  value: string
}

/**
 * ChoicePicker component (renamed from MultipleChoice).
 */
export interface ChoicePickerComponent extends ComponentBase, Checkable {
  component: 'ChoicePicker'
  label?: DynamicString
  variant?: 'multipleSelection' | 'mutuallyExclusive'
  options: ChoiceOption[]
  /** Two-way binding path */
  value: DynamicStringList
}

/**
 * Slider component.
 */
export interface SliderComponent extends ComponentBase, Checkable {
  component: 'Slider'
  label?: DynamicString
  min: number
  max: number
  /** Two-way binding path */
  value: DynamicNumber
}

/**
 * DateTimeInput component.
 */
export interface DateTimeInputComponent extends ComponentBase, Checkable {
  component: 'DateTimeInput'
  /** Two-way binding path (ISO 8601) */
  value: DynamicString
  enableDate?: boolean
  enableTime?: boolean
  outputFormat?: string
  label?: DynamicString
}

// ============ Component Union Type ============

/**
 * Union type of all standard catalog components.
 */
export type Component =
  | TextComponent
  | ImageComponent
  | IconComponent
  | VideoComponent
  | AudioPlayerComponent
  | DividerComponent
  | RowComponent
  | ColumnComponent
  | ListComponent
  | CardComponent
  | TabsComponent
  | ModalComponent
  | ButtonComponent
  | TextFieldComponent
  | CheckBoxComponent
  | ChoicePickerComponent
  | SliderComponent
  | DateTimeInputComponent

// ============ Internal State Types ============

/**
 * Data model type (hierarchical key-value store).
 */
export type DataModel = Record<string, unknown>

/**
 * Surface state.
 */
export interface SurfaceState {
  surfaceId: string
  catalogId: string
  components: Map<string, Component>
  dataModel: DataModel
  created: boolean
}

/**
 * Provider state managing multiple surfaces.
 */
export interface ProviderState {
  surfaces: Map<string, SurfaceState>
  messageBuffer: Map<string, A2UIMessage[]>
}

/**
 * Scope value for collection scopes.
 */
export interface ScopeValue {
  /** null = root scope, otherwise the base path for relative resolution */
  basePath: string | null
}

/**
 * Validation result.
 */
export interface ValidationResult {
  valid: boolean
  /** List of failed check messages */
  errors: string[]
}

// ============ Action Types (Client to Server) ============

/**
 * Resolved action payload sent to the action handler.
 */
export interface ActionPayload {
  name: string
  surfaceId: string
  sourceComponentId: string
  timestamp: string // ISO 8601
  context: Record<string, unknown>
}

/**
 * Action handler callback type.
 */
export type ActionHandler = (action: ActionPayload) => void
