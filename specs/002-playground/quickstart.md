# Quickstart: A2UI Playground Development

**Feature**: 002-playground
**Date**: 2026-01-10

## Prerequisites

- Node.js 18+
- npm 9+
- Repository cloned with dependencies installed (`npm install` at root)

## Development Setup

### 1. Install Playground Dependencies

```bash
# From repository root
npm install -w playground @uiw/react-codemirror @codemirror/lang-json
```

### 2. Link Main Library

The playground uses the main `@easyops-cn/a2ui-react` library as a workspace dependency. Ensure the library is built:

```bash
# Build the main library
npm run build
```

### 3. Start Development Server

```bash
# Start playground dev server
npm run dev -w playground
```

The playground will be available at `http://localhost:5173` (or next available port).

## Project Structure

```
playground/src/
├── components/          # React components
│   ├── Header.tsx       # App header with title and theme toggle
│   ├── ThemeToggle.tsx  # Sun/moon theme switch
│   ├── JsonEditor.tsx   # CodeMirror JSON editor
│   ├── Preview.tsx      # A2UIRender wrapper
│   ├── ExampleSelector.tsx  # Example dropdown
│   └── ErrorDisplay.tsx # Error state component
├── data/
│   └── examples.ts      # Pre-built A2UI examples
├── hooks/
│   └── useTheme.ts      # Theme state hook
├── App.tsx              # Main application
├── App.css              # Layout styles
├── main.tsx             # Entry point
└── index.css            # Global/Tailwind styles
```

## Key Implementation Notes

### Theme System

The playground uses the same theme approach as the website:

```typescript
// Set theme via data attribute
document.documentElement.dataset.theme = 'dark' // or 'light'

// CSS variables respond to theme
html[data-theme='dark'] {
  --background-color: hsl(230, 25%, 18%);
  --text-color: hsl(210, 50%, 96%);
}
```

### JSON Editor Integration

```typescript
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'

<CodeMirror
  value={jsonContent}
  extensions={[json()]}
  onChange={(value) => setJsonContent(value)}
/>
```

### A2UIRender Integration

```typescript
import { A2UIRender, type A2UIMessage } from '@easyops-cn/a2ui-react/0.8'

// Parse JSON and render
const messages: A2UIMessage[] = JSON.parse(jsonContent)
<A2UIRender messages={messages} onAction={handleAction} />
```

### Error Boundary Pattern

```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} />
    }
    return this.props.children
  }
}
```

## Testing

```bash
# Run tests (from root)
npm test -w playground

# Run specific test file
npm test -w playground -- JsonEditor.test.tsx
```

## Building for Production

```bash
# Build playground
npm run build -w playground

# Preview production build
npm run preview -w playground
```

Output will be in `playground/dist/`.

## Common Tasks

### Adding a New Example

1. Edit `playground/src/data/examples.ts`
2. Add new example object with `id`, `title`, `description`, and `messages`
3. The example will automatically appear in the dropdown

### Modifying Theme Colors

1. Edit `playground/src/App.css` or `playground/src/index.css`
2. Update CSS custom properties for light/dark themes
3. Match website colors from `website/src/global.css`

### Updating CodeMirror Theme

1. Import desired theme: `import { oneDark } from '@codemirror/theme-one-dark'`
2. Add to extensions array: `extensions={[json(), oneDark]}`
