# A2UI SDK

[![NPM Version](https://img.shields.io/npm/v/%40a2ui-sdk%2Freact)](https://www.npmjs.com/package/@a2ui-sdk/react)

The TypeScript/React SDK for [A2UI](https://a2ui.org) protocol.

NOTE: this is NOT the official SDK maintained by the A2UI team.

Supports all components in A2UI standard catalog out of the box. Built with [shadcn/ui](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com/).

Currently both A2UI protocol v0.8 and v0.9 (draft 2026-01-12) are fully supported.

[Docs](https://a2ui-sdk.js.org/) | [Playground](https://a2ui-sdk.js.org/playground/)

## Packages

This SDK provides different levels of APIs to suit various use cases:

| Package                                                            | Description                                                                                                                      |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| [`@a2ui-sdk/react`](https://www.npmjs.com/package/@a2ui-sdk/react) | React components for rendering A2UI protocol. <br />Use this for rendering A2UI surfaces in React applications.                  |
| [`@a2ui-sdk/utils`](https://www.npmjs.com/package/@a2ui-sdk/utils) | Utility functions for A2UI protocol (e.g., string interpolation, path utilities). <br />Use this when building custom renderers. |
| [`@a2ui-sdk/types`](https://www.npmjs.com/package/@a2ui-sdk/types) | TypeScript type definitions for A2UI protocol. <br />Use this for type-safe A2UI message handling.                               |

```javascript
// React renderer - full rendering solution
import { A2UIProvider, A2UIRenderer } from '@a2ui-sdk/react/0.8'

// Utilities - for custom renderer implementations
import { resolveValue } from '@a2ui-sdk/utils/0.8'

// Types only - for type-safe message handling
import type { A2UIMessage, A2UIAction } from '@a2ui-sdk/types/0.8'
```

## Installation

```sh
npm install @a2ui-sdk/react
```

## V0.8

### Usage

First, use the `@source` directive to tell Tailwind to scan the library code for class names in your global CSS:

```css
@source "../node_modules/@a2ui-sdk/react";
```

Next, use `A2UIProvider` and `A2UIRenderer` to render A2UI messages:

```tsx
import {
  A2UIProvider,
  A2UIRenderer,
  type A2UIMessage,
  type A2UIAction,
} from '@a2ui-sdk/react/0.8'

function App() {
  const messages: A2UIMessage[] = []

  const handleAction = (action: A2UIAction) => {
    console.log('Action received:', action)
  }

  return (
    <A2UIProvider messages={messages}>
      <A2UIRenderer onAction={handleAction} />
    </A2UIProvider>
  )
}
```

#### Custom components

You can override default components or add new custom components via the `components` prop on `A2UIProvider`, which takes a `Map<string, React.ComponentType>`.

```tsx
import {
  A2UIProvider,
  A2UIRenderer,
  type A2UIMessage,
  type A2UIAction,
} from '@a2ui-sdk/react/0.8'

const ComponentsMap = new Map<string, React.ComponentType<any>>([
  // Override default Button component with a custom one
  ['Button', CustomButtonComponent],

  // Add a new custom Switch component
  ['Switch', CustomSwitchComponent],
])

function App() {
  return (
    <A2UIProvider components={ComponentsMap} messages={messages}>
      <A2UIRenderer onAction={handleAction} />
    </A2UIProvider>
  )
}
```

Custom button component with action dispatch:

```tsx
import {
  useDispatchAction,
  ComponentRenderer,
  type ButtonComponentProps,
} from '@a2ui-sdk/react/0.8'

export function CustomButtonComponent({
  surfaceId,
  componentId,
  child,
  action,
}: ButtonComponentProps) {
  const dispatchAction = useDispatchAction()

  const handleClick = () => {
    if (action) {
      dispatchAction(surfaceId, componentId, action)
    }
  }

  return (
    <button onClick={handleClick}>
      <ComponentRenderer surfaceId={surfaceId} componentId={child} />
    </button>
  )
}
```

Custom switch component with data binding:

```tsx
import { useDataBinding, useFormBinding } from '@a2ui-sdk/react/0.8'

export function CustomSwitchComponent({
  surfaceId,
  componentId,
  label,
  value,
}: SwitchComponentProps) {
  const labelText = useDataBinding<string>(surfaceId, label, '')
  const [checked, setChecked] = useFormBinding<boolean>(surfaceId, value, false)

  const handleChange = (newChecked: boolean) => {
    setChecked(newChecked)
  }

  return (
    <Switch checked={checked} onChange={handleChange}>
      {labelText}
    </Switch>
  )
}
```

## V0.9

### Usage

First, use the `@source` directive to tell Tailwind to scan the library code for class names in your global CSS:

```css
@source "../node_modules/@a2ui-sdk/react";
```

Next, use `A2UIProvider` and `A2UIRenderer` to render A2UI messages:

```tsx
import {
  A2UIProvider,
  A2UIRenderer,
  type A2UIMessage,
  type A2UIAction,
} from '@a2ui-sdk/react/0.9'

function App() {
  const messages: A2UIMessage[] = []

  const handleAction = (action: A2UIAction) => {
    console.log('Action received:', action)
  }

  return (
    <A2UIProvider messages={messages}>
      <A2UIRenderer onAction={handleAction} />
    </A2UIProvider>
  )
}
```
