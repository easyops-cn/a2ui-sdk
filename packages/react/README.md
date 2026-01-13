# @a2ui-sdk/react

React implementation for rendering A2UI protocol. This package provides React components and hooks for integrating A2UI surfaces into your application.

## Installation

```bash
npm install @a2ui-sdk/react
```

### Peer Dependencies

- `react` ^19.0.0
- `react-dom` ^19.0.0

## Usage

### Basic Usage

```tsx
import {
  A2UIProvider,
  A2UIRenderer,
  type A2UIMessage,
  type A2UIAction,
} from '@a2ui-sdk/react/0.9'

function App() {
  const messages: A2UIMessage[] = [
    // A2UI messages from your backend
  ]

  const handleAction = (action: A2UIAction) => {
    console.log('Action:', action.name, action.context)
  }

  return (
    <A2UIProvider messages={messages} onAction={handleAction}>
      <A2UIRenderer />
    </A2UIProvider>
  )
}
```

### With Custom Components

You can override default components or add new ones via the `components` prop:

```tsx
import { A2UIProvider, A2UIRenderer, useDataBinding } from '@a2ui-sdk/react/0.9'

// Custom component implementation
function MyCustomText({ text }: { text: DynamicString }) {
  const resolvedText = useDataBinding(text)
  return <span className="my-custom-style">{resolvedText}</span>
}

function App() {
  const components = new Map([['Text', MyCustomText]])

  return (
    <A2UIProvider
      messages={messages}
      onAction={handleAction}
      components={components}
    >
      <A2UIRenderer />
    </A2UIProvider>
  )
}
```

## Exports

### v0.9 (Latest)

```tsx
import {
  // Components
  A2UIProvider,
  A2UIRenderer,
  ComponentRenderer,

  // Hooks
  useDispatchAction,
  useDataBinding,
  useFormBinding,
  useStringBinding,
  useDataModel,
  useValidation,
  useSurfaceContext,
  useScope,
  useScopeBasePath,

  // Types
  type A2UIMessage,
  type A2UIAction,
  type A2UIProviderProps,
  type A2UIRendererProps,
  type ComponentsMap,
  type Component,
  type Action,
  type DynamicValue,
  type DynamicString,
  type DynamicNumber,
  type DynamicBoolean,
  type DynamicStringList,
  type ChildList,
  type TemplateBinding,
  type CheckRule,
  type Checkable,
  type ValidationResult,
  type ScopeValue,
  type DataModel,
} from '@a2ui-sdk/react/0.9'
```

### v0.8

```tsx
import {
  // Components
  A2UIProvider,
  A2UIRenderer,
  ComponentRenderer,

  // Hooks
  useDispatchAction,
  useDataBinding,
  useFormBinding,
  useSurfaceContext,
  useDataModelContext,

  // Types
  type A2UIMessage,
  type A2UIAction,
  type A2UIProviderProps,
  type A2UIRendererProps,
  type ComponentsMap,
  type Action,
  type ValueSource,
} from '@a2ui-sdk/react/0.8'
```

### Namespace Import

```tsx
import { v0_8, v0_9 } from '@a2ui-sdk/react'

// Use v0.9 API
const { A2UIProvider, A2UIRenderer } = v0_9
```

## Hooks

### useDataBinding

Resolves a dynamic value from the data model:

```tsx
const value = useDataBinding({ path: '/user/name' })
// Returns the value at /user/name in the data model
```

### useFormBinding

Two-way binding for form components:

```tsx
const [value, setValue] = useFormBinding({ path: '/form/email' })
// value: current value
// setValue: update the data model
```

### useDispatchAction

Dispatch actions from custom components:

```tsx
const dispatch = useDispatchAction()

const handleClick = () => {
  dispatch({
    name: 'submit',
    context: { formId: 'contact' },
  })
}
```

### useValidation

Validate form inputs against check rules:

```tsx
const { valid, errors } = useValidation(checks)
// valid: boolean
// errors: string[] - list of failed validation messages
```

## License

Apache-2.0
