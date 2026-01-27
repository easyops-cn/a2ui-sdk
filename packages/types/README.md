# @a2ui-sdk/types

TypeScript type definitions for the A2UI protocol. This package provides all the type definitions needed to work with A2UI messages, components, and data models.

## Installation

```bash
npm install @a2ui-sdk/types
```

## Usage

### v0.9 (Latest)

```tsx
import type {
  // Message types
  A2UIMessage,
  CreateSurfacePayload,
  UpdateComponentsPayload,
  UpdateDataModelPayload,
  DeleteSurfacePayload,

  // Component types
  Component,
  TextComponent,
  ImageComponent,
  IconComponent,
  VideoComponent,
  AudioPlayerComponent,
  DividerComponent,
  RowComponent,
  ColumnComponent,
  ListComponent,
  CardComponent,
  TabsComponent,
  ModalComponent,
  ButtonComponent,
  TextFieldComponent,
  CheckBoxComponent,
  ChoicePickerComponent,
  SliderComponent,
  DateTimeInputComponent,

  // Value types
  DynamicValue,
  DynamicString,
  DynamicNumber,
  DynamicBoolean,
  DynamicStringList,
  ChildList,
  TemplateBinding,

  // Action types
  Action,
  ActionPayload,
  ActionHandler,

  // Validation types
  CheckRule,
  Checkable,
  ValidationResult,

  // State types
  ScopeValue,
  DataModel,
} from '@a2ui-sdk/types/0.9'
```

### v0.8

```tsx
import type {
  // Message types
  A2UIMessage,
  BeginRenderingPayload,
  SurfaceUpdatePayload,
  DataModelUpdatePayload,
  DeleteSurfacePayload,

  // Core types
  Surface,
  SurfaceStyles,
  ComponentDefinition,
  ComponentProps,
  ValueSource,
  DataModel,
  DataModelValue,
  DataEntry,

  // Children types
  ChildrenDefinition,
  TemplateBinding,

  // Action types
  Action,
  ActionPayload,
  ActionHandler,
  ActionContextItem,

  // Component props
  BaseComponentProps,
  TextComponentProps,
  ImageComponentProps,
  IconComponentProps,
  VideoComponentProps,
  AudioPlayerComponentProps,
  DividerComponentProps,
  RowComponentProps,
  ColumnComponentProps,
  ListComponentProps,
  CardComponentProps,
  TabsComponentProps,
  ModalComponentProps,
  ButtonComponentProps,
  CheckBoxComponentProps,
  TextFieldComponentProps,
  DateTimeInputComponentProps,
  MultipleChoiceComponentProps,
  SliderComponentProps,

  // Layout types
  Distribution,
  Alignment,

  // State types
  ScopeValue,
} from '@a2ui-sdk/types/0.8'
```

### Namespace Import

```tsx
import { v0_8, v0_9 } from '@a2ui-sdk/types'

// Use v0.9 types
type Message = v0_9.A2UIMessage
```

## Key Types

### A2UIMessage (v0.9)

Messages sent from server to client:

```tsx
type A2UIMessage =
  | { createSurface: CreateSurfacePayload }
  | { updateComponents: UpdateComponentsPayload }
  | { updateDataModel: UpdateDataModelPayload }
  | { deleteSurface: DeleteSurfacePayload }
```

### Dynamic Values (v0.9)

Values that can be static or data-bound:

```tsx
// Static string or path reference
type DynamicString = string | { path: string } | FunctionCall

// Static number or path reference
type DynamicNumber = number | { path: string } | FunctionCall

// Static boolean or logic expression
type DynamicBoolean = boolean | { path: string } | LogicExpression
```

### ValueSource (v0.8)

Legacy value binding:

```tsx
type ValueSource =
  | { literalString: string }
  | { literalNumber: number }
  | { literalBoolean: boolean }
  | { literalArray: string[] }
  | { path: string }
```

### ActionPayload

Action dispatched from client to server:

```tsx
interface ActionPayload {
  name: string
  surfaceId: string
  sourceComponentId: string
  timestamp: string // ISO 8601
  context: Record<string, unknown>
}
```

### ScopeValue (v0.8+)

Scope context for collection item rendering:

```tsx
interface ScopeValue {
  /**
   * Base path for relative path resolution.
   * null = root scope (no scoping)
   * string = scoped to a specific data path (e.g., "/items/0")
   */
  basePath: string | null
}
```

Used internally to support relative paths in template-rendered children (List, Row, Column with template binding).

## License

Apache-2.0
