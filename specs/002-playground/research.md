# Research: A2UI Playground

**Feature**: 002-playground
**Date**: 2026-01-10

## JSON Editor Library Selection

### Decision

**CodeMirror 6** via `@uiw/react-codemirror` wrapper

### Rationale

- **Bundle size**: ~40-150KB gzipped (vs Monaco's 500KB+)
- **Performance**: Designed for real-time editing, used by Replit in production
- **React integration**: Clean wrapper with `@uiw/react-codemirror`
- **JSON support**: Official `@codemirror/lang-json` package with syntax highlighting
- **Modular**: Only include needed features

### Alternatives Considered

| Option                   | Bundle Size | Verdict                              |
| ------------------------ | ----------- | ------------------------------------ |
| Monaco Editor            | 500KB+      | Too heavy for playground use case    |
| Prism.js                 | 10-50KB     | Read-only, no editing capability     |
| react-simple-code-editor | ~5KB        | Limited features, no JSON validation |

### Required Packages

```
@uiw/react-codemirror
@codemirror/lang-json
@codemirror/theme-one-dark (for dark mode)
```

## Theme Implementation

### Decision

Reuse website's theme approach with `data-theme` attribute on `<html>` element

### Rationale

- Consistent with existing website implementation
- Uses CSS custom properties for theming
- localStorage persistence already proven pattern
- Sun/moon icons from lucide-react (already in main library dependencies)

### Implementation Pattern

```typescript
// Theme stored in localStorage as 'theme' key
// Values: 'light' | 'dark'
// Applied via: document.documentElement.dataset.theme = theme
```

## A2UI Library Integration

### Decision

Import from workspace dependency `@easyops-cn/a2ui-react/0.8`

### Rationale

- Playground is in same monorepo as library
- Vite workspace alias already configured
- Direct import ensures latest library version during development

### Integration Pattern

```typescript
import { A2UIRender, type A2UIMessage } from '@easyops-cn/a2ui-react/0.8'

// Parse JSON string to A2UIMessage[]
// Pass to A2UIRender component
// Handle parse errors gracefully
```

## Example Categories

### Decision

Include 5 examples covering core A2UI capabilities

### Examples

1. **Hello World** - Basic Text component
2. **Layout Demo** - Column/Row with multiple children
3. **Button Actions** - Interactive Button with action handling
4. **Form Inputs** - TextField, Checkbox, Select components
5. **Data Binding** - Components with ValueSource path bindings

### Rationale

- Covers all component categories (display, layout, interactive)
- Progressive complexity for learning
- Demonstrates key A2UI concepts (actions, data binding)

## Error Handling

### Decision

Use React Error Boundary for preview panel with graceful fallback

### Rationale

- Prevents entire app crash on render errors
- Shows user-friendly error message
- Allows continued editing after errors

### Implementation Pattern

```typescript
// ErrorBoundary wraps A2UIRender
// Catches render errors, displays ErrorDisplay component
// JSON parse errors handled separately before render
```
