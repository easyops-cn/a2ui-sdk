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
  onAction?: (action: A2UIAction) => void
  components?: Map<string, React.ComponentType<any>>
  children?: React.ReactNode
}): React.ReactElement

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
```

### Utils

```typescript
// @a2ui-sdk/utils/0.8

/**
 * Resolves a ValueSource to its actual value.
 *
 * @example
 * // Literal values
 * resolveValue({ literalString: "Hello" }, {}); // "Hello"
 * resolveValue({ literalNumber: 42 }, {});      // 42
 *
 * // Path references
 * const model = { user: { name: "John" } };
 * resolveValue({ path: "/user/name" }, model);  // "John"
 */
function resolveValue<T = unknown>(
  source: ValueSource | undefined,
  dataModel: DataModel,
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
 */
function resolveActionContext(
  context: Array<{ key: string; value: ValueSource }> | undefined,
  dataModel: DataModel
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
  onAction?: (action: A2UIAction) => void
  components?: Map<string, React.ComponentType<any>>
  children?: React.ReactNode
}): React.ReactElement

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
