---
url: https://a2ui-sdk.js.org/api/
---

# API Reference

## V0.8

### React

```typescript
// @a2ui-sdk/react/0.8

/**
 * Provider component that processes A2UI messages and sets up contexts.
 */
function A2UIProvider(props: {
  messages: A2UIMessage[]
  catalog?: Catalog
  children: React.ReactNode
}): React.ReactElement

/**
 * Catalog containing components and functions.
 */
interface Catalog {
  components: Record<string, React.ComponentType<any>>
  functions?: Record<string, unknown>
}

/**
 * Standard catalog with all built-in components.
 * Use as base and extend with custom components.
 */
const standardCatalog: Catalog

/**
 * Main renderer component that renders all surfaces.
 */
function A2UIRenderer(): React.ReactElement

/**
 * Renders a component by ID from the component registry.
 */
function ComponentRenderer(props: {
  surfaceId: string
  componentId: string
}): React.ReactElement

/**
 * Returns a function to dispatch actions from custom components.
 */
function useDispatchAction(): (
  surfaceId: string,
  componentId: string,
  action: Action
) => void

/**
 * Resolves a ValueSource to its actual value.
 */
function useDataBinding<T = unknown>(
  surfaceId: string,
  source: ValueSource | undefined,
  defaultValue?: T
): T

/**
 * Hook for two-way data binding in form components.
 * @returns Tuple of [value, setValue]
 */
function useFormBinding<T = unknown>(
  surfaceId: string,
  source: ValueSource | undefined,
  defaultValue?: T
): [T, (value: T) => void]

/**
 * Hook to access the Surface context.
 */
function useSurfaceContext(): SurfaceContextValue

/**
 * Hook to access the DataModel context.
 */
function useDataModelContext(): DataModelContextValue

/**
 * Hook to access the current scope value.
 */
function useScope(): ScopeValue

/**
 * Hook to get the current scope base path.
 */
function useScopeBasePath(): string | null
```

### Utils

```typescript
// @a2ui-sdk/utils/0.8

/**
 * Resolves a ValueSource to its actual value.
 *
 * @param source - The value source to resolve
 * @param dataModel - The data model to resolve against
 * @param basePath - Base path for relative path resolution (default: null)
 * @param defaultValue - Default value if resolution fails
 *
 * @example
 * // Literal values
 * resolveValue({ literalString: "Hello" }, {}, null); // "Hello"
 * resolveValue({ literalNumber: 42 }, {}, null);      // 42
 *
 * // Absolute path references
 * const model = { user: { name: "John" } };
 * resolveValue({ path: "/user/name" }, model, null);  // "John"
 *
 * // Relative path with basePath
 * const items = { items: [{ name: "Item 1" }] };
 * resolveValue({ path: "name" }, items, "/items/0");  // "Item 1"
 */
function resolveValue<T = unknown>(
  source: ValueSource | undefined,
  dataModel: DataModel,
  basePath: string | null = null,
  defaultValue?: T
): T

/**
 * Converts a DataEntry array to a plain object.
 * Used for processing dataModelUpdate message contents.
 */
function contentsToObject(contents: DataEntry[]): Record<string, DataModelValue>

/**
 * Resolves action context items to a plain object.
 * Used when dispatching actions to resolve all context values.
 *
 * @param context - Action context items to resolve
 * @param dataModel - The data model to resolve against
 * @param basePath - Base path for relative path resolution (default: null)
 */
function resolveActionContext(
  context: Array<{ key: string; value: ValueSource }> | undefined,
  dataModel: DataModel,
  basePath: string | null = null
): Record<string, unknown>

/**
 * Gets a value from the data model by path.
 */
function getValueByPath(
  dataModel: DataModel,
  path: string
): DataModelValue | undefined

/**
 * Sets a value in the data model by path, returning a new data model.
 * This function is immutable.
 */
function setValueByPath(
  dataModel: DataModel,
  path: string,
  value: unknown
): DataModel

/**
 * Merges data into the data model at a given path.
 * Used for dataModelUpdate messages where contents are merged.
 */
function mergeAtPath(
  dataModel: DataModel,
  path: string,
  data: Record<string, unknown>
): DataModel

/**
 * Normalizes a path to ensure it starts with '/' and has no trailing '/'.
 *
 * @example
 * normalizePath("user/name") // "/user/name"
 * normalizePath("/items/")   // "/items"
 */
function normalizePath(path: string): string

/**
 * Checks if a path is absolute (starts with '/').
 *
 * @example
 * isAbsolutePath("/user/name") // true
 * isAbsolutePath("name")       // false
 */
function isAbsolutePath(path: string): boolean

/**
 * Joins a base path with a relative path.
 *
 * @example
 * joinPaths("/items/0", "name")  // "/items/0/name"
 * joinPaths("/items", "../users") // "/users"
 */
function joinPaths(basePath: string, relativePath: string): string

/**
 * Resolves a path against a base path.
 * Absolute paths are returned as-is.
 * Relative paths are joined with the base path.
 * If basePath is null, relative paths are treated as absolute.
 *
 * @example
 * resolvePath("/user/name", "/items/0") // "/user/name" (absolute)
 * resolvePath("name", "/items/0")       // "/items/0/name" (relative)
 * resolvePath("name", null)             // "/name" (relative, no base)
 */
function resolvePath(path: string, basePath: string | null): string
```

### Types

```typescript
// @a2ui-sdk/types/0.8

/**
 * A2UI message from server to client.
 * Only one of the fields should be set per message.
 */
interface A2UIMessage {
  beginRendering?: BeginRenderingPayload
  surfaceUpdate?: SurfaceUpdatePayload
  dataModelUpdate?: DataModelUpdatePayload
  deleteSurface?: DeleteSurfacePayload
}

/**
 * Resolved action payload sent to the action handler.
 */
interface A2UIAction {
  surfaceId: string
  name: string
  context: Record<string, unknown>
  sourceComponentId: string
}

/**
 * Represents a value source - either a literal value or a reference to a data model path.
 */
type ValueSource =
  | { literalString: string }
  | { literalNumber: number }
  | { literalBoolean: boolean }
  | { literalArray: string[] }
  | { path: string }

/**
 * Action definition (attached to Button components).
 */
interface Action {
  name: string
  context?: ActionContextItem[]
}

/**
 * Scope value for collection scopes.
 * Tracks the current data path when rendering template-bound children.
 */
interface ScopeValue {
  /**
   * Base path for relative path resolution.
   * null = root scope (no scoping)
   * string = scoped to a specific data path (e.g., "/items/0")
   */
  basePath: string | null
}
```

## V0.9

### React

```typescript
// @a2ui-sdk/react/0.9

/**
 * Provider component that processes A2UI messages and sets up contexts.
 */
function A2UIProvider(props: {
  messages: A2UIMessage[]
  catalog?: Catalog
  children: React.ReactNode
}): React.ReactElement

/**
 * Catalog containing components and functions.
 */
interface Catalog {
  components: Record<string, React.ComponentType<any>>
  functions: Record<string, unknown>
}

/**
 * Standard catalog with all built-in components.
 * Use as base and extend with custom components.
 */
const standardCatalog: Catalog

/**
 * Main renderer component that renders all surfaces.
 */
function A2UIRenderer(): React.ReactElement

/**
 * Renders a component by ID from the component registry.
 */
function ComponentRenderer(props: {
  surfaceId: string
  componentId: string
}): React.ReactElement

/**
 * Returns a function to dispatch actions from custom components.
 */
function useDispatchAction(): (
  surfaceId: string,
  componentId: string,
  action: Action
) => void

/**
 * Resolves a DynamicValue to its actual value.
 */
function useDataBinding<T = unknown>(
  source: DynamicValue | undefined,
  defaultValue?: T
): T

/**
 * Hook for two-way data binding in form components.
 * @returns Tuple of [value, setValue]
 */
function useFormBinding<T = unknown>(
  source: FormBindableValue | undefined,
  defaultValue?: T
): [T, (value: T) => void]

/**
 * Resolves a DynamicString with interpolation support.
 */
function useStringBinding(
  source: DynamicString | undefined,
  defaultValue?: string
): string

/**
 * Hook to access the data model for a surface.
 */
function useDataModel(): DataModel

/**
 * Hook to validate components with check rules.
 */
function useValidation(checks: CheckRule[] | undefined): ValidationResult

/**
 * Hook to access the Surface context.
 */
function useSurfaceContext(): SurfaceContextValue

/**
 * Hook to access the current scope value.
 */
function useScope(): ScopeValue

/**
 * Hook to get the current scope base path.
 */
function useScopeBasePath(): string | null
```

### Utils

```typescript
// @a2ui-sdk/utils/0.9

/**
 * Interpolates a string template with values from the data model.
 * Supports `${path}` syntax for data binding.
 * @example
 * interpolate("Hello ${/user/name}!", { user: { name: "World" } })
 * // => "Hello World!"
 */
function interpolate(template: string, dataModel: DataModel): string

/**
 * Checks if a string contains interpolation expressions.
 */
function hasInterpolation(value: string): boolean

/**
 * Resolves a DynamicValue to its actual value.
 */
function resolveDynamicValue<T>(
  value: DynamicValue | undefined,
  dataModel: DataModel,
  basePath: string | null,
  defaultValue?: T
): T

/**
 * Gets a value from the data model at a JSON Pointer path.
 */
function getValueByPath(dataModel: DataModel, path: string): unknown

/**
 * Sets a value in the data model at a JSON Pointer path.
 */
function setValueByPath(
  dataModel: DataModel,
  path: string,
  value: unknown
): DataModel

/**
 * Evaluates a CheckRule against the data model.
 */
function evaluateCheckRule(
  rule: CheckRule,
  dataModel: DataModel,
  basePath: string | null
): ValidationResult
```

### Types

```typescript
// @a2ui-sdk/types/0.9

/**
 * A2UI message from server to client.
 */
type A2UIMessage =
  | { createSurface: CreateSurfacePayload }
  | { updateComponents: UpdateComponentsPayload }
  | { updateDataModel: UpdateDataModelPayload }
  | { deleteSurface: DeleteSurfacePayload }

/**
 * Resolved action payload sent to the action handler.
 */
interface A2UIAction {
  name: string
  surfaceId: string
  sourceComponentId: string
  timestamp: string // ISO 8601
  context: Record<string, unknown>
}

/**
 * Dynamic value types for data binding.
 */
type DynamicValue = string | number | boolean | { path: string } | FunctionCall
type DynamicString = string | { path: string } | FunctionCall
type DynamicNumber = number | { path: string } | FunctionCall
type DynamicBoolean = boolean | { path: string } | LogicExpression
type DynamicStringList = string[] | { path: string } | FunctionCall

/**
 * Action definition (attached to Button components).
 */
interface Action {
  name: string
  context?: Record<string, DynamicValue>
}

/**
 * Check rule for validation.
 */
interface CheckRule {
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
 * Validation result.
 */
interface ValidationResult {
  valid: boolean
  errors: string[]
}

/**
 * Children definition for container components.
 */
type ChildList = string[] | TemplateBinding

/**
 * Template binding for dynamic child generation.
 */
interface TemplateBinding {
  componentId: string
  path: string
}
```
