# API Reference

## Core

```typescript
/**
 * Main entry component for rendering A2UI messages.
 * @param messages - Array of A2UI messages to render
 * @param onAction - Callback when an action is dispatched
 * @param components - Custom component overrides
 */
function A2UIRender(props: {
  messages: A2UIMessage[]
  onAction?: (action: A2UIAction) => void
  components?: Map<string, React.ComponentType<any>>
}): React.ReactElement

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
```

## Hooks

```typescript
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
 * @param surfaceId - The surface ID for data model lookup
 * @param source - The value source (literal or path reference)
 * @param defaultValue - Default value if source is undefined or path not found
 */
function useDataBinding<T = unknown>(
  surfaceId: string,
  source: ValueSource | undefined,
  defaultValue?: T
): T

/**
 * Hook for two-way data binding in form components.
 * @param surfaceId - The surface ID
 * @param source - The value source (must be a path reference for setting)
 * @param defaultValue - Default value if not found
 * @returns Tuple of [value, setValue]
 */
function useFormBinding<T = unknown>(
  surfaceId: string,
  source: ValueSource | undefined,
  defaultValue?: T
): [T, (value: T) => void]
```

## Others

```typescript
/**
 * Renders a component by ID from the component registry.
 * @param surfaceId - The surface ID
 * @param componentId - The component ID to render
 */
function ComponentRenderer(props: {
  surfaceId: string
  componentId: string
}): React.ReactElement

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
