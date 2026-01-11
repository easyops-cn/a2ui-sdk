# Feature Specification: A2UI Playground

**Feature Branch**: `002-playground`
**Created**: 2026-01-10
**Status**: Draft
**Input**: User description: "实现 playground，顶栏和 website 现在的 header 一致，包括标题和切换深/浅主题图标；内容区左侧为 json 编辑器，右侧为 A2UIRenderer 的实时预览；同时提供一些常见场景的示例作为 select 项"

## Clarifications

### Session 2026-01-10

- Q: What should users see when they first load the playground? → A: Load with first example pre-selected (editor populated, preview showing)

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Live JSON Editing with Preview (Priority: P1)

A developer wants to experiment with A2UI message structures by editing JSON and seeing the rendered result immediately. They open the playground, type or paste A2UI JSON messages in the left editor panel, and see the corresponding UI rendered in real-time on the right panel.

**Why this priority**: This is the core value proposition of the playground - enabling rapid prototyping and learning of A2UI message structures without setting up a full development environment.

**Independent Test**: Can be fully tested by entering valid A2UI JSON and verifying the preview updates. Delivers immediate value for developers learning the A2UI protocol.

**Acceptance Scenarios**:

1. **Given** the playground is loaded, **When** a user types valid A2UI JSON in the editor, **Then** the preview panel displays the rendered components in real-time
2. **Given** valid JSON is in the editor, **When** the user modifies the JSON, **Then** the preview updates automatically without requiring manual refresh
3. **Given** invalid JSON is in the editor, **When** the user views the preview, **Then** the preview shows an appropriate error state without crashing

---

### User Story 2 - Example Selection (Priority: P2)

A developer new to A2UI wants to learn by example. They select a pre-built example from a dropdown menu, which populates the JSON editor with a working A2UI message structure and displays the rendered result.

**Why this priority**: Examples accelerate learning and provide starting points for customization, but the core editing functionality must work first.

**Independent Test**: Can be tested by selecting each example from the dropdown and verifying both the JSON editor content and preview update correctly.

**Acceptance Scenarios**:

1. **Given** the playground is loaded, **When** a user selects an example from the dropdown, **Then** the JSON editor is populated with the example's A2UI messages
2. **Given** an example is selected, **When** the JSON editor is populated, **Then** the preview panel displays the rendered example
3. **Given** multiple examples exist, **When** a user switches between examples, **Then** both the editor and preview update to reflect the newly selected example

---

### User Story 3 - Theme Switching (Priority: P3)

A developer wants to test how their A2UI components look in both light and dark modes. They click the theme toggle icon in the header to switch between light and dark themes, and the entire playground (including the preview) updates accordingly.

**Why this priority**: Theme consistency with the website is important for brand coherence, but it's a secondary concern after core functionality.

**Independent Test**: Can be tested by clicking the theme toggle and verifying the visual appearance changes for both the playground chrome and the preview area.

**Acceptance Scenarios**:

1. **Given** the playground is in light mode, **When** a user clicks the theme toggle, **Then** the playground switches to dark mode
2. **Given** the playground is in dark mode, **When** a user clicks the theme toggle, **Then** the playground switches to light mode
3. **Given** a theme preference is set, **When** the user returns to the playground later, **Then** the previously selected theme is restored

---

### Edge Cases

- What happens when the JSON editor contains empty content? The preview should show an empty state.
- How does the system handle extremely large JSON payloads? The editor should remain responsive with reasonable-sized inputs (up to 100KB).
- What happens when the browser window is resized? The layout should adapt responsively, maintaining usability on different screen sizes.
- What happens when a user modifies an example after selecting it? The changes should be preserved until a new example is selected.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display a header with the title "A2UI React Renderer" matching the website header design
- **FR-002**: System MUST provide a theme toggle icon (sun/moon) in the header that switches between light and dark modes
- **FR-003**: System MUST persist theme preference across browser sessions using localStorage
- **FR-004**: System MUST display a split-panel layout with JSON editor on the left and preview on the right
- **FR-005**: System MUST render A2UI components in the preview panel based on the JSON editor content
- **FR-006**: System MUST update the preview automatically when the JSON editor content changes
- **FR-007**: System MUST provide a dropdown/select control to choose from pre-built examples
- **FR-008**: System MUST include examples covering common A2UI scenarios: basic text display, layout containers, interactive buttons, form inputs, and data binding
- **FR-009**: System MUST display a clear error state in the preview when JSON is invalid or cannot be rendered
- **FR-010**: System MUST maintain responsive layout that works on screens 1024px wide and above
- **FR-011**: System MUST load with the first example pre-selected, showing populated editor and rendered preview on initial page load

### Key Entities

- **A2UI Messages**: Array of message objects following the A2UI protocol (beginRendering, surfaceUpdate, dataModelUpdate)
- **Example**: A named preset containing a title, description, and pre-configured A2UI messages array
- **Theme**: User preference for light or dark color scheme, stored in localStorage

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can see preview updates within 500ms of making JSON edits
- **SC-002**: All provided examples render correctly without errors
- **SC-003**: Theme toggle persists preference and applies consistently across the entire interface
- **SC-004**: Playground loads and becomes interactive within 3 seconds on standard broadband connection
- **SC-005**: 90% of first-time users can successfully modify an example and see the result without external documentation

## Assumptions

- The playground targets desktop users with screens 1024px or wider; mobile optimization is out of scope
- Users have basic familiarity with JSON syntax
- The A2UIRenderer component from the main library is stable and can be used directly
- Examples will be hardcoded initially; dynamic example loading is out of scope
- The JSON editor will use a standard code editor component with syntax highlighting (specific library choice is an implementation detail)
