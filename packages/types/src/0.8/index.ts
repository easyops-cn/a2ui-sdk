/**
 * A2UI SDK - Type Definitions
 *
 * Core type definitions for the A2UI SDK.
 * Based on the A2UI specification documents.
 */

// ============ Value Types ============

/**
 * Represents a value source - either a literal value or a reference to a data model path.
 */
export type ValueSource =
  | { literalString: string }
  | { literalNumber: number }
  | { literalBoolean: boolean }
  | { literalArray: string[] }
  | { path: string }

// ============ Data Model ============

/**
 * Primitive values that can be stored in the data model.
 */
export type DataModelValue =
  | string
  | number
  | boolean
  | null
  | DataModel
  | unknown[]

/**
 * The data model is a hierarchical key-value store.
 * Components reference data using paths like "/user/name".
 */
export interface DataModel {
  [key: string]: DataModelValue
}

/**
 * Data entry from server messages (dataModelUpdate).
 */
export interface DataEntry {
  key: string
  valueString?: string
  valueNumber?: number
  valueBoolean?: boolean
  valueMap?: DataEntry[]
}

// ============ Scope ============

/**
 * Scope value for collection scopes.
 * Tracks the current data path when rendering template-bound children.
 *
 * @example
 * // Root scope
 * { basePath: null }
 *
 * // Item scope in a list
 * { basePath: "/items/0" }
 */
export interface ScopeValue {
  /** null = root scope, otherwise the base path for relative path resolution */
  basePath: string | null
}

// ============ Surface ============

/**
 * Surface styles configuration.
 */
export interface SurfaceStyles {
  font?: string
  primaryColor?: string
}

/**
 * A Surface is the top-level container for A2UI rendering.
 */
export interface Surface {
  surfaceId: string
  root: string
  components: Map<string, ComponentDefinition>
  styles?: SurfaceStyles
}

// ============ Component Definition ============

/**
 * Base component properties that all components share.
 */
export interface ComponentDefinition {
  id: string
  weight?: number
  component: {
    [componentType: string]: ComponentProps
  }
}

/**
 * Generic component properties type.
 */
export type ComponentProps = Record<string, unknown>

// ============ Children Definition ============

/**
 * Template binding for dynamic child generation.
 */
export interface TemplateBinding {
  componentId: string
  dataBinding: string
}

/**
 * Children definition for container components.
 */
export interface ChildrenDefinition {
  explicitList?: string[]
  template?: TemplateBinding
}

// ============ Action ============

/**
 * A single item in the action context.
 */
export interface ActionContextItem {
  key: string
  value: ValueSource
}

/**
 * Action definition (attached to Button components).
 */
export interface Action {
  name: string
  context?: ActionContextItem[]
}

/**
 * Resolved action payload sent to the action handler.
 */
export interface ActionPayload {
  surfaceId: string
  name: string
  context: Record<string, unknown>
  sourceComponentId: string
}

/**
 * Action handler callback type.
 */
export type ActionHandler = (action: ActionPayload) => void

// ============ Message Types ============

/**
 * BeginRendering message payload - initializes a new Surface.
 */
export interface BeginRenderingPayload {
  surfaceId: string
  root: string
  catalogId?: string
  styles?: SurfaceStyles
}

/**
 * SurfaceUpdate message payload - updates the component tree.
 */
export interface SurfaceUpdatePayload {
  surfaceId: string
  components: ComponentDefinition[]
}

/**
 * DataModelUpdate message payload - updates the data model.
 */
export interface DataModelUpdatePayload {
  surfaceId: string
  path?: string
  contents: DataEntry[]
}

/**
 * DeleteSurface message payload - removes a Surface.
 */
export interface DeleteSurfacePayload {
  surfaceId: string
}

/**
 * A2UI message from server to client.
 * Only one of the fields should be set per message.
 */
export interface A2UIMessage {
  beginRendering?: BeginRenderingPayload
  surfaceUpdate?: SurfaceUpdatePayload
  dataModelUpdate?: DataModelUpdatePayload
  deleteSurface?: DeleteSurfacePayload
}

export * as StandardCatalog from './standard-catalog.js'
