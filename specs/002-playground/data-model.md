# Data Model: A2UI Playground

**Feature**: 002-playground
**Date**: 2026-01-10

## Entities

### Example

Represents a pre-built A2UI message configuration that users can select.

```typescript
interface Example {
  id: string // Unique identifier (e.g., "hello-world")
  title: string // Display name (e.g., "Hello World")
  description: string // Brief explanation of what the example demonstrates
  messages: A2UIMessage[] // The A2UI messages to render
}
```

**Validation Rules**:

- `id` must be unique across all examples
- `title` must be non-empty
- `messages` must be a valid A2UIMessage array

### Theme

User's color scheme preference.

```typescript
type Theme = 'light' | 'dark'
```

**Storage**: localStorage key `'theme'`

**Default**: System preference via `prefers-color-scheme` media query

### EditorState

Current state of the playground editor.

```typescript
interface EditorState {
  jsonContent: string // Raw JSON string in editor
  parsedMessages: A2UIMessage[] | null // Parsed messages (null if invalid JSON)
  parseError: string | null // Error message if JSON is invalid
  selectedExampleId: string // Currently selected example ID
}
```

**Validation Rules**:

- `jsonContent` can be any string (including invalid JSON)
- `parsedMessages` is null when JSON parsing fails
- `parseError` contains the error message when parsing fails

## State Transitions

### Editor Content Flow

```
User types in editor
    ↓
jsonContent updated
    ↓
JSON.parse() attempted
    ↓
┌─────────────────────────────────────┐
│ Success                             │ Failure
│   ↓                                 │   ↓
│ parsedMessages = result             │ parsedMessages = null
│ parseError = null                   │ parseError = error.message
│   ↓                                 │   ↓
│ A2UIRender receives messages        │ ErrorDisplay shown
└─────────────────────────────────────┘
```

### Example Selection Flow

```
User selects example from dropdown
    ↓
selectedExampleId updated
    ↓
jsonContent = JSON.stringify(example.messages, null, 2)
    ↓
parsedMessages = example.messages
parseError = null
    ↓
Editor and Preview both update
```

### Theme Toggle Flow

```
User clicks theme toggle
    ↓
Current theme read from state
    ↓
New theme = (current === 'dark') ? 'light' : 'dark'
    ↓
document.documentElement.dataset.theme = newTheme
localStorage.setItem('theme', newTheme)
    ↓
UI re-renders with new theme
```

## Relationships

```
┌─────────────┐     selects      ┌─────────────┐
│   Example   │◄─────────────────│ EditorState │
└─────────────┘                  └─────────────┘
       │                               │
       │ provides                      │ contains
       ▼                               ▼
┌─────────────┐                  ┌─────────────┐
│ A2UIMessage │                  │ jsonContent │
│    Array    │                  │   (string)  │
└─────────────┘                  └─────────────┘
       │                               │
       └───────────┬───────────────────┘
                   │ renders
                   ▼
            ┌─────────────┐
            │  A2UIRender │
            └─────────────┘
```

## A2UIMessage Structure (Reference)

From the main library, A2UIMessage is a union type:

```typescript
type A2UIMessage =
  | { beginRendering: { surfaceId: string; root: string; styles?: string } }
  | { surfaceUpdate: { surfaceId: string; components: ComponentUpdate[] } }
  | {
      dataModelUpdate: {
        surfaceId: string
        path: string
        contents: DataContent[]
      }
    }
  | { deleteSurface: { surfaceId: string } }
```

Examples must conform to this structure to render correctly.
