# Feature Specification: A2UIRenderer Component Library

**Feature Branch**: `001-a2ui-renderer`
**Created**: 2026-01-10
**Status**: Draft
**Input**: User description: "按 README.md 的下游用户使用示例实现 A2UIRenderer"

## Clarifications

### Session 2026-01-10

- Q: How should unknown component types be handled? → A: Render placeholder in development, skip in production
- Q: Where does the A2UIMessage schema come from? → A: Define schema internally (this library owns the type definitions)

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Basic Message Rendering (Priority: P1)

As a developer, I want to render A2UI messages using the A2UIRender component so that I can display dynamic UI content from A2UI protocol messages.

**Why this priority**: This is the core functionality - without basic rendering, no other features can work. It enables the fundamental use case of displaying A2UI messages.

**Independent Test**: Can be fully tested by passing an array of A2UIMessage objects to A2UIRender and verifying the UI renders correctly. Delivers immediate value by enabling basic A2UI integration.

**Acceptance Scenarios**:

1. **Given** an empty messages array, **When** A2UIRender is rendered, **Then** no UI components are displayed
2. **Given** a messages array with valid A2UIMessage objects, **When** A2UIRender is rendered, **Then** all message components are displayed in order
3. **Given** a messages array with nested components, **When** A2UIRender is rendered, **Then** nested components are rendered correctly within their parent containers

---

### User Story 2 - Action Handling (Priority: P1)

As a developer, I want to receive action callbacks when users interact with components so that I can respond to user interactions and update application state.

**Why this priority**: Actions are essential for interactive UIs. Without action handling, the rendered UI would be static and non-functional.

**Independent Test**: Can be fully tested by clicking interactive components and verifying the onAction callback receives the correct A2UIAction payload.

**Acceptance Scenarios**:

1. **Given** a component with an action defined, **When** the user triggers the action (e.g., clicks a button), **Then** the onAction callback is invoked with the correct A2UIAction object
2. **Given** the onAction callback, **When** an action is dispatched, **Then** the callback receives surfaceId, componentId, and action payload
3. **Given** multiple interactive components, **When** different components are clicked, **Then** each dispatches its own unique action correctly

---

### User Story 3 - Custom Component Override (Priority: P2)

As a developer, I want to override default components with custom implementations so that I can customize the look and behavior of rendered UI elements.

**Why this priority**: Customization is important for branding and specific UX requirements, but the library should work with defaults first.

**Independent Test**: Can be fully tested by providing a ComponentsMap with a custom Button component and verifying the custom component renders instead of the default.

**Acceptance Scenarios**:

1. **Given** a ComponentsMap with a custom Button component, **When** A2UIRender renders a Button, **Then** the custom Button component is used instead of the default
2. **Given** a ComponentsMap with multiple custom components, **When** A2UIRender renders those component types, **Then** each custom component is used appropriately
3. **Given** a ComponentsMap that does not override a component type, **When** A2UIRender renders that component type, **Then** the default component is used

---

### User Story 4 - Custom Component Creation (Priority: P2)

As a developer, I want to add new custom component types that don't exist in the default set so that I can extend the UI capabilities beyond the built-in components.

**Why this priority**: Extensibility allows the library to support domain-specific components, but basic functionality must work first.

**Independent Test**: Can be fully tested by adding a new component type (e.g., Switch) to ComponentsMap and verifying it renders when that component type appears in messages.

**Acceptance Scenarios**:

1. **Given** a ComponentsMap with a new component type "Switch", **When** A2UIRender encounters a Switch component in messages, **Then** the custom Switch component is rendered
2. **Given** a custom component using useDispatchAction hook, **When** the component dispatches an action, **Then** the action flows through the onAction callback correctly

---

### User Story 5 - Data Binding in Custom Components (Priority: P3)

As a developer, I want to use data binding hooks in custom components so that I can read dynamic values from the A2UI data context.

**Why this priority**: Data binding enables dynamic content, but basic rendering and actions are more fundamental.

**Independent Test**: Can be fully tested by creating a custom component that uses useDataBinding and verifying it displays the bound value.

**Acceptance Scenarios**:

1. **Given** a custom component using useDataBinding hook, **When** the component renders, **Then** it displays the bound data value
2. **Given** a data binding with a default value, **When** the bound path has no data, **Then** the default value is used

---

### User Story 6 - Form Binding in Custom Components (Priority: P3)

As a developer, I want to use form binding hooks in custom components so that I can create two-way data binding for form inputs.

**Why this priority**: Form binding enables interactive forms, building on top of basic data binding.

**Independent Test**: Can be fully tested by creating a custom Switch component that uses useFormBinding and verifying value changes are reflected.

**Acceptance Scenarios**:

1. **Given** a custom component using useFormBinding hook, **When** the component renders, **Then** it displays the current bound value
2. **Given** a custom component using useFormBinding hook, **When** the user changes the value, **Then** the bound value is updated
3. **Given** a form binding with a default value, **When** the bound path has no data, **Then** the default value is used

---

### Edge Cases

- What happens when messages array is null or undefined? System should handle gracefully without crashing
- What happens when a component type in messages has no matching renderer? System renders a visible placeholder in development mode to aid debugging, and silently skips the component in production mode
- What happens when an action is dispatched but no onAction callback is provided? System should handle gracefully
- What happens when useDataBinding references a non-existent path? System should return the default value
- What happens when ComponentsMap contains invalid component references? System should fall back to defaults or skip

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST export A2UIRender component that accepts messages and onAction props
- **FR-002**: System MUST export A2UIMessage type for defining message structures
- **FR-003**: System MUST export A2UIAction type for defining action payloads
- **FR-004**: A2UIRender MUST render all components defined in the messages array
- **FR-005**: A2UIRender MUST invoke onAction callback when user interactions trigger actions
- **FR-006**: A2UIRender MUST accept an optional components prop (ComponentsMap) for custom component overrides
- **FR-007**: System MUST export useDispatchAction hook for custom components to dispatch actions
- **FR-008**: System MUST export ComponentRenderer component for rendering child components within custom components
- **FR-009**: System MUST export useDataBinding hook for reading data from the A2UI context
- **FR-010**: System MUST export useFormBinding hook for two-way data binding in form components
- **FR-011**: useDispatchAction hook MUST accept surfaceId, componentId, and action parameters
- **FR-012**: useDataBinding hook MUST accept surfaceId, binding path, and default value parameters
- **FR-013**: useFormBinding hook MUST return a tuple of [currentValue, setValue] for two-way binding
- **FR-014**: ComponentRenderer MUST accept surfaceId and componentId props to render specific components
- **FR-015**: Custom components MUST receive surfaceId and componentId as props for context identification

### Key Entities

- **A2UIMessage**: Represents a message containing UI component definitions to be rendered. Contains component tree structure and associated data.
- **A2UIAction**: Represents an action payload triggered by user interaction. Contains action type and associated data for the callback.
- **ComponentsMap**: A Map structure mapping component type names (strings) to React component implementations. Used for overriding defaults and adding custom components.
- **Surface**: A rendering context identified by surfaceId that contains components and their associated data bindings.
- **Component**: An individual UI element within a surface, identified by componentId, with properties specific to its type.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Developers can render A2UI messages with a single component import and minimal configuration (under 10 lines of code for basic usage)
- **SC-002**: All user interactions on rendered components trigger the onAction callback within 100ms of user input
- **SC-003**: Custom component overrides work without modifying library source code
- **SC-004**: Custom components can access all necessary hooks (useDispatchAction, useDataBinding, useFormBinding) from the library exports
- **SC-005**: The library exports are accessible via the versioned path '@easyops-cn/a2ui-react/0.8'
- **SC-006**: Nested component rendering works to at least 10 levels deep without performance degradation
- **SC-007**: Form bindings reflect value changes immediately (within one render cycle)

## Assumptions

- This library defines and owns the A2UI protocol message format types (A2UIMessage, A2UIAction, Surface, Component schemas)
- React 18+ is the target runtime environment
- TypeScript types are required for all public exports
- Default components will be provided for common UI elements (Button, Text, etc.)
- The versioned export path pattern (@easyops-cn/a2ui-react/0.8) follows npm package subpath exports convention
