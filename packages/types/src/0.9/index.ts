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
  components: ComponentDefinition[]
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

// ============ Component Definitions ============

/**
 * Common properties for all components.
 */
export interface ComponentCommon {
  id: string
  /** flex-grow for Row/Column children */
  weight?: number
}

/**
 * Base component properties that all components share.
 */
export interface BaseComponentDefinition extends ComponentCommon {
  id: string
  /** Discriminator: "Text", "Button", etc. */
  component: string
}

/**
 * Any components.
 */
export interface ComponentDefinition extends BaseComponentDefinition {
  [key: string]: unknown
}

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
  components: Map<string, ComponentDefinition>
  dataModel: DataModel
  created: boolean
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
 * Action definition (attached to Button components).
 */
export interface Action {
  name: string
  context?: Record<string, DynamicValue>
}

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

export * as StandardCatalog from './standard-catalog.js'
