# Quickstart: A2UI 0.9 Renderer

**Date**: 2026-01-12

## Installation

```bash
npm install @easyops-cn/a2ui-react
```

## Basic Usage

```tsx
import {
  A2UIProvider,
  A2UIRenderer,
  type A2UIMessage,
  type A2UIAction,
} from '@easyops-cn/a2ui-react/0.9'

function App() {
  const [messages, setMessages] = useState<A2UIMessage[]>([])

  const handleAction = (action: A2UIAction) => {
    console.log('Action dispatched:', action)
    // Send action to your server
  }

  // Example: Add messages from server stream
  useEffect(() => {
    const stream = connectToServer()
    stream.onMessage((msg) => {
      setMessages((prev) => [...prev, msg])
    })
    return () => stream.close()
  }, [])

  return (
    <A2UIProvider messages={messages} onAction={handleAction}>
      <A2UIRenderer />
    </A2UIProvider>
  )
}
```

## Message Examples

### Create a Surface

```json
{
  "createSurface": {
    "surfaceId": "main",
    "catalogId": "https://a2ui.dev/specification/0.9/standard_catalog.json"
  }
}
```

### Add Components

```json
{
  "updateComponents": {
    "surfaceId": "main",
    "components": [
      {
        "id": "root",
        "component": "Column",
        "children": ["greeting", "input", "submit"]
      },
      {
        "id": "greeting",
        "component": "Text",
        "text": "Hello, ${/user/name}!",
        "variant": "h2"
      },
      {
        "id": "input",
        "component": "TextField",
        "label": "Your name",
        "value": { "path": "/user/name" }
      },
      {
        "id": "submit",
        "component": "Button",
        "child": "submit_label",
        "action": {
          "name": "greet",
          "context": {
            "name": { "path": "/user/name" }
          }
        }
      },
      {
        "id": "submit_label",
        "component": "Text",
        "text": "Say Hello"
      }
    ]
  }
}
```

### Update Data Model

```json
{
  "updateDataModel": {
    "surfaceId": "main",
    "path": "/user",
    "value": {
      "name": "Alice"
    }
  }
}
```

## Key Differences from 0.8

| Feature              | 0.8                                             | 0.9                              |
| -------------------- | ----------------------------------------------- | -------------------------------- |
| Component format     | `{"component": {"Text": {...}}}`                | `{"component": "Text", ...}`     |
| Data binding         | `{"literalString": "..."}` or `{"path": "..."}` | `"literal"` or `{"path": "..."}` |
| String interpolation | Not supported                                   | `"Hello, ${/user/name}!"`        |
| Data model update    | Array of key-value pairs                        | JSON object                      |
| Validation           | `validationRegexp`                              | `checks` array                   |

## Custom Components

```tsx
import {
  A2UIProvider,
  A2UIRenderer,
  ComponentRenderer,
  useDataBinding,
} from '@easyops-cn/a2ui-react/0.9'

// Custom component using hooks
function MyCustomCard({ surfaceId, component }) {
  const { child, title } = component
  const resolvedTitle = useDataBinding(surfaceId, title, '')

  return (
    <div className="my-custom-card">
      <h3>{resolvedTitle}</h3>
      <ComponentRenderer surfaceId={surfaceId} componentId={child} />
    </div>
  )
}

// Register custom components
const customComponents = new Map([['MyCustomCard', MyCustomCard]])

function App() {
  return (
    <A2UIProvider
      messages={messages}
      onAction={handleAction}
      components={customComponents}
    >
      <A2UIRenderer />
    </A2UIProvider>
  )
}
```

## Validation with Checks

```json
{
  "id": "email_field",
  "component": "TextField",
  "label": "Email",
  "value": { "path": "/form/email" },
  "variant": "shortText",
  "checks": [
    {
      "call": "required",
      "args": { "value": { "path": "/form/email" } },
      "message": "Email is required"
    },
    {
      "call": "email",
      "args": { "value": { "path": "/form/email" } },
      "message": "Please enter a valid email"
    }
  ]
}
```

## Template Binding (Dynamic Lists)

```json
{
  "id": "user_list",
  "component": "List",
  "children": {
    "componentId": "user_item",
    "path": "/users"
  }
},
{
  "id": "user_item",
  "component": "Text",
  "text": { "path": "name" }
}
```

With data model:

```json
{
  "updateDataModel": {
    "surfaceId": "main",
    "path": "/users",
    "value": [{ "name": "Alice" }, { "name": "Bob" }, { "name": "Charlie" }]
  }
}
```

This renders three Text components with "Alice", "Bob", and "Charlie".

## Available Hooks

```tsx
// Get data binding value (requires surfaceId and value source)
const value = useDataBinding(surfaceId, { path: '/user/name' }, '')

// Two-way form binding
const [value, setValue] = useFormBinding(surfaceId, { path: '/form/email' }, '')

// Dispatch action programmatically
const dispatch = useDispatchAction()
dispatch(surfaceId, componentId, { name: 'custom', context: { key: 'value' } })

// Access surface context (full API)
const { surfaces, getComponent, getDataModel, setDataValue } =
  useSurfaceContext()

// Get data model for a surface
const dataModel = useDataModel(surfaceId)
```

## Multi-Surface Support

```tsx
// Multiple surfaces render automatically when created
<A2UIProvider messages={messages} onAction={handleAction}>
  <A2UIRenderer />  {/* Renders all surfaces */}
</A2UIProvider>

// Or render specific surface
<A2UIProvider messages={messages} onAction={handleAction}>
  <A2UIRenderer surfaceId="sidebar" />
  <A2UIRenderer surfaceId="main" />
</A2UIProvider>
```
