# A2UI React Renderer Library

https://easyops-cn.github.io/a2ui-react/

A React renderer library for [A2UI](https://a2ui.org) protocol.

Supports all components in A2UI standard catalog out of the box. Built with [shadcn/ui](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com/).

Currently A2UI protocol v0.8 is fully supported. Work on v0.9 is in progress.

## Installation

```sh
npm install @easyops-cn/a2ui-react
```

## Usage

First, use the `@source` directive to tell Tailwind to scan the library code for class names in your global CSS:

```css
@source "../node_modules/@easyops-cn/a2ui-react";
```

Next, use the `A2UIRender` component to render A2UI messages:

```tsx
import {
  A2UIRender,
  type A2UIMessage,
  type A2UIAction,
} from '@easyops-cn/a2ui-react/0.8'

function App() {
  const messages: A2UIMessage[] = []

  const handleAction = (action: A2UIAction) => {
    console.log('Action received:', action)
  }

  return <A2UIRender messages={messages} onAction={handleAction} />
}
```

### Custom components

You can override default components or add new custom components via the `components` prop, which takes a `Map<string, React.ComponentType>`.

```tsx
import { A2UIRender, A2UIMessage, A2UIAction } from '@easyops-cn/a2ui-react/0.8'

const ComponentsMap = new Map<string, React.ComponentType<any>>([
  // Override default Button component with a custom one
  ['Button', CustomButtonComponent],

  // Add a new custom Switch component
  ['Switch', CustomSwitchComponent],
])

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

Custom button component with action dispatch:

```tsx
import {
  useDispatchAction,
  ComponentRenderer,
  type ButtonComponentProps,
} from '@easyops-cn/a2ui-react/0.8'

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
import { useDataBinding, useFormBinding } from '@easyops-cn/a2ui-react/0.8'

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
