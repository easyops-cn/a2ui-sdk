A2UI React Renderer Library

Usage:

```tsx
import { A2UIRender, A2UIMessage, A2UIAction } from '@easyops-cn/a2ui-react/0.8'

function App() {
  const messages: A2UIMessage[] = []

  const handleAction = (action: A2UIAction) => {
    console.log('Action received:', action)
  }

  return <A2UIRender messages={messages} onAction={handleAction} />
}
```

Customize components:

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

```tsx
import {
  useDispatchAction,
  ComponentRenderer,
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

```tsx
import {
  useDispatchAction,
  ComponentRenderer,
} from '@easyops-cn/a2ui-react/0.8'

export function CustomSwitchComponent({
  surfaceId,
  componentId,
  label,
  value,
}: ButtonComponentProps) {
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
