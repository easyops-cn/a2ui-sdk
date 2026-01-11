# Quickstart: A2UIRenderer Component Library

**Date**: 2026-01-10
**Feature**: 001-a2ui-renderer

## Installation

```bash
npm install @easyops-cn/a2ui-react
# or
pnpm add @easyops-cn/a2ui-react
```

## Basic Usage

```tsx
import { A2UIRender, A2UIMessage, A2UIAction } from '@easyops-cn/a2ui-react/0.8'

function App() {
  const messages: A2UIMessage[] = [
    // Messages from your A2UI server
  ]

  const handleAction = (action: A2UIAction) => {
    console.log('Action received:', action)
    // Handle the action (e.g., send to server)
  }

  return <A2UIRender messages={messages} onAction={handleAction} />
}
```

## Custom Components

Override default components or add new ones:

```tsx
import {
  A2UIRender,
  useDispatchAction,
  ComponentRenderer,
} from '@easyops-cn/a2ui-react/0.8'

// Custom Button component
function CustomButton({ surfaceId, componentId, child, action }) {
  const dispatchAction = useDispatchAction()

  const handleClick = () => {
    if (action) {
      dispatchAction(surfaceId, componentId, action)
    }
  }

  return (
    <button className="my-custom-button" onClick={handleClick}>
      <ComponentRenderer surfaceId={surfaceId} componentId={child} />
    </button>
  )
}

// Register custom components
const ComponentsMap = new Map([['Button', CustomButton]])

function App() {
  return (
    <A2UIRender
      components={ComponentsMap}
      messages={messages}
      onAction={handleAction}
    />
  )
}
```

## Data Binding in Custom Components

```tsx
import { useDataBinding, useFormBinding } from '@easyops-cn/a2ui-react/0.8'

// Read-only binding
function DisplayComponent({ surfaceId, text }) {
  const textValue = useDataBinding<string>(surfaceId, text, '')
  return <span>{textValue}</span>
}

// Two-way binding for forms
function InputComponent({ surfaceId, value }) {
  const [inputValue, setInputValue] = useFormBinding<string>(
    surfaceId,
    value,
    ''
  )

  return (
    <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
  )
}
```

## API Reference

### A2UIRender Props

| Prop         | Type                           | Required | Description                           |
| ------------ | ------------------------------ | -------- | ------------------------------------- |
| `messages`   | `A2UIMessage[]`                | Yes      | Array of A2UI messages to render      |
| `onAction`   | `(action: A2UIAction) => void` | No       | Callback when user triggers an action |
| `components` | `Map<string, ComponentType>`   | No       | Custom component overrides            |

### Hooks

| Hook                | Signature                                                 | Description                             |
| ------------------- | --------------------------------------------------------- | --------------------------------------- |
| `useDispatchAction` | `() => (surfaceId, componentId, action) => void`          | Dispatch actions from custom components |
| `useDataBinding`    | `<T>(surfaceId, source, default?) => T`                   | Read data from the data model           |
| `useFormBinding`    | `<T>(surfaceId, source, default?) => [T, (v: T) => void]` | Two-way data binding                    |

### Types

| Type          | Description                                |
| ------------- | ------------------------------------------ |
| `A2UIMessage` | Server-to-client message                   |
| `A2UIAction`  | Action payload sent to onAction callback   |
| `Action`      | Action definition in component props       |
| `ValueSource` | Literal value or data model path reference |

## Message Flow

```
Server                          Client (A2UIRender)
  │                                    │
  │──── beginRendering ───────────────►│ Initialize surface
  │                                    │
  │──── surfaceUpdate ────────────────►│ Add/update components
  │                                    │
  │──── dataModelUpdate ──────────────►│ Update data model
  │                                    │
  │◄─── ActionPayload ────────────────│ User interaction
  │                                    │
  │──── deleteSurface ────────────────►│ Remove surface
```
