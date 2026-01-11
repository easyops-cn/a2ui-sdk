# Component Contracts: A2UI Playground

**Feature**: 002-playground
**Date**: 2026-01-10

This is a client-side only application with no external API contracts. This document defines the internal component interfaces.

## Component Props Interfaces

### Header

```typescript
interface HeaderProps {
  title: string
  children?: React.ReactNode // For theme toggle slot
}
```

### ThemeToggle

```typescript
interface ThemeToggleProps {
  theme: 'light' | 'dark'
  onToggle: () => void
}
```

### JsonEditor

```typescript
interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
  theme?: 'light' | 'dark'
}
```

### Preview

```typescript
interface PreviewProps {
  messages: A2UIMessage[] | null
  error: string | null
  onAction?: (action: A2UIAction) => void
}
```

### ExampleSelector

```typescript
interface ExampleSelectorProps {
  examples: Example[]
  selectedId: string
  onSelect: (id: string) => void
}
```

### ErrorDisplay

```typescript
interface ErrorDisplayProps {
  title?: string
  message: string
}
```

## Hook Interfaces

### useTheme

```typescript
function useTheme(): {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
}
```

## Data Interfaces

### Example

```typescript
interface Example {
  id: string
  title: string
  description: string
  messages: A2UIMessage[]
}
```

## Event Contracts

### Editor Change Event

```typescript
// Triggered when user edits JSON in editor
type EditorChangeHandler = (newValue: string) => void
```

### Example Select Event

```typescript
// Triggered when user selects an example from dropdown
type ExampleSelectHandler = (exampleId: string) => void
```

### Theme Toggle Event

```typescript
// Triggered when user clicks theme toggle
type ThemeToggleHandler = () => void
```

### Action Dispatch Event

```typescript
// Triggered when A2UIRender dispatches an action
type ActionHandler = (action: A2UIAction) => void
```
