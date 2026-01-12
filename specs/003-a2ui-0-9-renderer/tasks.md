# Tasks: A2UI 0.9 Renderer Implementation

**Input**: Design documents from `/specs/003-a2ui-0-9-renderer/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Tests are included (following existing 0.8 pattern with co-located test files).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure:

- **Source**: `src/0.9/` at repository root
- **Tests**: Co-located with source files (`*.test.tsx`, `*.test.ts`)

---

## Phase 1: Setup

**Purpose**: Initialize 0.9 module structure and TypeScript types

- [x] T001 Create directory structure for `src/0.9/` matching plan.md layout
- [x] T002 [P] Define TypeScript types for 0.9 protocol messages in `src/0.9/types/index.ts`
- [x] T003 [P] Define TypeScript types for all 18 catalog components in `src/0.9/types/index.ts`
- [x] T004 [P] Create public API exports in `src/0.9/index.ts` (mirroring 0.8 pattern)
- [x] T005 Add `./0.9` export path to `package.json` exports field

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Implement JSON Pointer path utilities in `src/0.9/utils/pathUtils.ts` (parse, resolve, create paths)
- [x] T007 [P] Write tests for path utilities in `src/0.9/utils/pathUtils.test.ts`
- [x] T008 Implement data binding resolution utility in `src/0.9/utils/dataBinding.ts` (literal vs path detection)
- [x] T009 [P] Write tests for data binding utilities in `src/0.9/utils/dataBinding.test.ts`
- [x] T010 Create ScopeContext for collection scopes in `src/0.9/contexts/ScopeContext.tsx`
- [x] T011 [P] Write tests for ScopeContext in `src/0.9/contexts/ScopeContext.test.tsx`
- [x] T012 Create ComponentsMapContext for custom component registry in `src/0.9/contexts/ComponentsMapContext.tsx`
- [x] T013 Create UnknownComponent fallback in `src/0.9/components/UnknownComponent.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel ✅

---

## Phase 3: User Story 1 - Basic UI Rendering with New Message Format (Priority: P1) 🎯 MVP

**Goal**: Process 0.9 messages (`createSurface`, `updateComponents`, `deleteSurface`) and render basic components using flat discriminator format

**Independent Test**: Send `createSurface` + `updateComponents` messages, verify Text/Button/Row/Column render correctly

### Tests for User Story 1

- [ ] T014 [P] [US1] Write tests for SurfaceContext in `src/0.9/contexts/SurfaceContext.test.tsx`
- [ ] T015 [P] [US1] Write tests for useA2UIMessageHandler in `src/0.9/hooks/useA2UIMessageHandler.test.tsx`
- [ ] T016 [P] [US1] Write tests for ComponentRenderer in `src/0.9/components/ComponentRenderer.test.tsx`

### Implementation for User Story 1

- [x] T017 [US1] Create SurfaceContext with multi-surface state management in `src/0.9/contexts/SurfaceContext.tsx`
- [x] T018 [US1] Create ActionContext for onAction callback in `src/0.9/contexts/ActionContext.tsx`
- [x] T019 [US1] Implement useA2UIMessageHandler hook in `src/0.9/hooks/useA2UIMessageHandler.ts` (createSurface, updateComponents, deleteSurface, message buffering)
- [x] T020 [US1] Create A2UIProvider with multi-surface support in `src/0.9/contexts/A2UIProvider.tsx`
- [ ] T021 [P] [US1] Write tests for A2UIProvider in `src/0.9/contexts/A2UIProvider.test.tsx`
- [x] T022 [US1] Implement useComponent hook for adjacency list lookup in `src/0.9/hooks/useComponent.ts`
- [ ] T023 [P] [US1] Write tests for useComponent in `src/0.9/hooks/useComponent.test.tsx`
- [x] T024 [US1] Create ComponentRenderer with discriminator-based dispatch in `src/0.9/components/ComponentRenderer.tsx`
- [x] T025 [P] [US1] Implement TextComponent in `src/0.9/components/display/TextComponent.tsx` (basic, no interpolation yet)
- [x] T026 [P] [US1] Implement RowComponent in `src/0.9/components/layout/RowComponent.tsx` (justify/align props)
- [x] T027 [P] [US1] Implement ColumnComponent in `src/0.9/components/layout/ColumnComponent.tsx` (justify/align props)
- [x] T028 [P] [US1] Implement ButtonComponent (basic, no checks yet) in `src/0.9/components/interactive/ButtonComponent.tsx`
- [x] T029 [US1] Create display components index in `src/0.9/components/display/index.ts`
- [x] T030 [US1] Create layout components index in `src/0.9/components/layout/index.ts`
- [x] T031 [US1] Create interactive components index in `src/0.9/components/interactive/index.ts`
- [x] T032 [US1] Create main components index in `src/0.9/components/index.ts`
- [x] T033 [US1] Create A2UIRenderer component in `src/0.9/A2UIRenderer.tsx`
- [ ] T034 [P] [US1] Write tests for A2UIRenderer in `src/0.9/A2UIRenderer.test.tsx`

**Checkpoint**: Basic rendering works - can send messages and see Text, Button, Row, Column ✅

---

## Phase 4: User Story 2 - Data Model Binding with Simplified Value Format (Priority: P1)

**Goal**: Support `updateDataModel` messages and reactive data binding with simplified `{"path": "..."}` syntax

**Independent Test**: Send `updateDataModel` with JSON object, verify bound Text components update reactively

### Tests for User Story 2

- [ ] T035 [P] [US2] Write tests for DataModelContext in `src/0.9/contexts/DataModelContext.test.tsx`
- [ ] T036 [P] [US2] Write tests for useDataBinding hook in `src/0.9/hooks/useDataBinding.test.tsx`

### Implementation for User Story 2

- [x] T037 [US2] Create DataModelContext with path-based updates in `src/0.9/contexts/DataModelContext.tsx` (implemented in SurfaceContext)
- [x] T038 [US2] Add updateDataModel processing to useA2UIMessageHandler in `src/0.9/hooks/useA2UIMessageHandler.ts`
- [x] T039 [US2] Implement useDataBinding hook (resolve literals and paths) in `src/0.9/hooks/useDataBinding.ts`
- [x] T040 [US2] Update TextComponent to use useDataBinding for text prop in `src/0.9/components/display/TextComponent.tsx`
- [x] T041 [US2] Update ButtonComponent to use useDataBinding for action context in `src/0.9/components/interactive/ButtonComponent.tsx`

**Checkpoint**: Data binding works - components update reactively when data model changes ✅

---

## Phase 5: User Story 3 - Two-Way Binding for Input Components (Priority: P1)

**Goal**: Input components (TextField, CheckBox, ChoicePicker, Slider, DateTimeInput) update local data model on user interaction

**Independent Test**: Type in TextField, verify bound Text component updates in real-time

### Tests for User Story 3

- [ ] T042 [P] [US3] Write tests for useFormBinding hook in `src/0.9/hooks/useDataBinding.test.tsx`
- [ ] T043 [P] [US3] Write tests for TextFieldComponent in `src/0.9/components/interactive/interactive.test.tsx`

### Implementation for User Story 3

- [x] T044 [US3] Implement useFormBinding hook (two-way binding) in `src/0.9/hooks/useDataBinding.ts`
- [x] T045 [US3] Implement TextFieldComponent with value binding in `src/0.9/components/interactive/TextFieldComponent.tsx`
- [x] T046 [P] [US3] Implement CheckBoxComponent with value binding in `src/0.9/components/interactive/CheckBoxComponent.tsx`
- [x] T047 [P] [US3] Implement ChoicePickerComponent with value binding in `src/0.9/components/interactive/ChoicePickerComponent.tsx`
- [x] T048 [P] [US3] Implement SliderComponent with value binding in `src/0.9/components/interactive/SliderComponent.tsx`
- [x] T049 [P] [US3] Implement DateTimeInputComponent with value binding in `src/0.9/components/interactive/DateTimeInputComponent.tsx`
- [ ] T050 [US3] Write integration tests for two-way binding in `src/0.9/components/interactive/interactive.test.tsx`

**Checkpoint**: Two-way binding works - input changes immediately update data model and other bound components ✅

---

## Phase 6: User Story 4 - String Interpolation in Dynamic Strings (Priority: P2)

**Goal**: Support `${expression}` syntax in DynamicString properties for mixing static text with data model values

**Independent Test**: Text with `"Hello, ${/user/name}!"` displays correctly with resolved value

### Tests for User Story 4

- [x] T051 [P] [US4] Write tests for interpolation utility in `src/0.9/utils/interpolation.test.ts`
- [x] T052 [P] [US4] Write tests for useInterpolation hook in `src/0.9/hooks/useInterpolation.test.ts` (integrated into resolveString)

### Implementation for User Story 4

- [x] T053 [US4] Implement interpolation parser in `src/0.9/utils/interpolation.ts` (regex-based, escape handling)
- [x] T054 [US4] Implement useInterpolation hook in `src/0.9/hooks/useInterpolation.ts` (integrated into resolveString instead)
- [x] T055 [US4] Update useDataBinding to detect and delegate interpolated strings in `src/0.9/hooks/useDataBinding.ts`
- [x] T056 [US4] Update TextComponent to support interpolated text in `src/0.9/components/display/TextComponent.tsx` (already uses useStringBinding)

**Checkpoint**: String interpolation works - mixed static/dynamic strings resolve correctly ✅

---

## Phase 7: User Story 5 - Dynamic Children with Template Binding (Priority: P2)

**Goal**: Container components generate children dynamically from data arrays using template binding

**Independent Test**: List with template binding renders correct number of items with scoped paths

### Tests for User Story 5

- [ ] T057 [P] [US5] Write tests for template binding in layout components in `src/0.9/components/layout/layout.test.tsx`

### Implementation for User Story 5

- [x] T058 [US5] Update RowComponent to support ChildList template binding in `src/0.9/components/layout/RowComponent.tsx`
- [x] T059 [US5] Update ColumnComponent to support ChildList template binding in `src/0.9/components/layout/ColumnComponent.tsx`
- [x] T060 [US5] Implement ListComponent with template binding and ScopeContext in `src/0.9/components/layout/ListComponent.tsx`
- [x] T061 [US5] Update useDataBinding to resolve relative paths within ScopeContext in `src/0.9/hooks/useDataBinding.ts` (already implemented)
- [ ] T062 [US5] Write integration tests for relative/absolute path resolution in `src/0.9/components/layout/layout.test.tsx`

**Checkpoint**: Template binding works - dynamic lists render with correctly scoped data ✅

---

## Phase 8: User Story 6 - Action Dispatch with Simplified Context (Priority: P2)

**Goal**: Button clicks dispatch actions with resolved context values using standard JSON object format

**Independent Test**: Click Button, verify onAction receives resolved context with literal and bound values

### Tests for User Story 6

- [ ] T063 [P] [US6] Write tests for useDispatchAction hook in `src/0.9/hooks/useDispatchAction.test.tsx`
- [ ] T064 [P] [US6] Write tests for ActionContext in `src/0.9/contexts/ActionContext.test.tsx`

### Implementation for User Story 6

- [x] T065 [US6] Implement useDispatchAction hook with context resolution in `src/0.9/hooks/useDispatchAction.ts`
- [x] T066 [US6] Update ButtonComponent to use useDispatchAction in `src/0.9/components/interactive/ButtonComponent.tsx`
- [ ] T067 [US6] Write integration test for action dispatch with bound context in `src/0.9/hooks/useDispatchAction.test.tsx`

**Checkpoint**: Action dispatch works - buttons dispatch actions with correctly resolved context ✅

---

## Phase 9: User Story 7 - Client-Side Validation with Checks (Priority: P3)

**Goal**: Input components and Buttons support `checks` property for validation with error messages

**Independent Test**: TextField with required check shows error when empty, Button with failing checks is disabled

### Tests for User Story 7

- [x] T068 [P] [US7] Write tests for validation utility in `src/0.9/utils/validation.test.ts`
- [x] T069 [P] [US7] Write tests for useValidation hook in `src/0.9/hooks/useValidation.test.ts`

### Implementation for User Story 7

- [x] T070 [US7] Implement validation functions (required, email, regex, length, numeric) in `src/0.9/utils/validation.ts`
- [x] T071 [US7] Implement LogicExpression evaluator in `src/0.9/utils/validation.ts` (and, or, not)
- [x] T072 [US7] Implement useValidation hook in `src/0.9/hooks/useValidation.ts`
- [x] T073 [US7] Update TextFieldComponent with checks support in `src/0.9/components/interactive/TextFieldComponent.tsx`
- [x] T074 [US7] Update CheckBoxComponent with checks support in `src/0.9/components/interactive/CheckBoxComponent.tsx`
- [x] T075 [US7] Update ChoicePickerComponent with checks support in `src/0.9/components/interactive/ChoicePickerComponent.tsx`
- [x] T076 [US7] Update SliderComponent with checks support in `src/0.9/components/interactive/SliderComponent.tsx`
- [x] T077 [US7] Update DateTimeInputComponent with checks support in `src/0.9/components/interactive/DateTimeInputComponent.tsx`
- [x] T078 [US7] Update ButtonComponent with checks (disable on failure) in `src/0.9/components/interactive/ButtonComponent.tsx`
- [ ] T079 [US7] Write integration tests for validation in `src/0.9/components/interactive/interactive.test.tsx`

**Checkpoint**: Validation works - checks evaluate and display errors, buttons disable on failure ✅

---

## Phase 10: User Story 8 - All Standard Catalog Components (Priority: P3)

**Goal**: Complete implementation of all 18 standard catalog components

**Independent Test**: Each component type renders correctly with valid properties

### Tests for User Story 8

- [ ] T080 [P] [US8] Write tests for display components in `src/0.9/components/display/display.test.tsx`

### Implementation for User Story 8

- [x] T081 [P] [US8] Implement ImageComponent in `src/0.9/components/display/ImageComponent.tsx`
- [x] T082 [P] [US8] Implement IconComponent in `src/0.9/components/display/IconComponent.tsx`
- [x] T083 [P] [US8] Implement VideoComponent in `src/0.9/components/display/VideoComponent.tsx`
- [x] T084 [P] [US8] Implement AudioPlayerComponent in `src/0.9/components/display/AudioPlayerComponent.tsx`
- [x] T085 [P] [US8] Implement DividerComponent in `src/0.9/components/display/DividerComponent.tsx`
- [x] T086 [P] [US8] Implement CardComponent in `src/0.9/components/layout/CardComponent.tsx`
- [x] T087 [P] [US8] Implement TabsComponent (tabs array, renamed from tabItems) in `src/0.9/components/layout/TabsComponent.tsx`
- [x] T088 [P] [US8] Implement ModalComponent (trigger/content, renamed from entryPointChild/contentChild) in `src/0.9/components/layout/ModalComponent.tsx`
- [ ] T089 [US8] Write integration tests for all catalog components in `src/0.9/components/display/display.test.tsx` and `src/0.9/components/layout/layout.test.tsx`

**Checkpoint**: All 18 standard catalog components render correctly ✅

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T090 [P] Add console.warn logging for recoverable issues (missing child IDs, non-existent paths)
- [x] T091 [P] Add console.error logging for critical errors (duplicate surfaceId, malformed messages)
- [x] T092 [P] Add circular reference detection in component tree rendering
- [x] T093 [P] Verify all property renames from 0.8 are handled (justify/align, trigger/content, tabs, value, variant, min/max)
- [x] T094 Run all tests and ensure passing with `npm run test:run`
- [x] T095 Verify quickstart.md examples work correctly
- [x] T096 Run build and verify 0.9 exports correctly with `npm run build`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-10)**: All depend on Foundational phase completion
  - US1, US2, US3 are all P1 and should be done in sequence (core functionality)
  - US4, US5, US6 are P2 and can start after US1-3 (enhanced features)
  - US7, US8 are P3 and can start after US1-3 (polish features)
- **Polish (Phase 11)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Foundational → Basic rendering (no dependencies on other stories)
- **User Story 2 (P1)**: Foundational + US1 → Data binding (requires basic rendering)
- **User Story 3 (P1)**: Foundational + US2 → Two-way binding (requires data binding)
- **User Story 4 (P2)**: US2 → String interpolation (extends data binding)
- **User Story 5 (P2)**: US2 → Template binding (extends data binding, uses ScopeContext)
- **User Story 6 (P2)**: US2 → Action dispatch (uses data binding for context)
- **User Story 7 (P3)**: US3 → Validation (extends input components)
- **User Story 8 (P3)**: US1 → Remaining components (uses basic rendering infrastructure)

### Within Each User Story

- Tests SHOULD be written before implementation (TDD pattern)
- Foundation modules before components
- Hooks before components that use them
- Individual components before integration tests

### Parallel Opportunities

**Phase 1 (Setup)**:

- T002, T003, T004 can run in parallel (different files)

**Phase 2 (Foundational)**:

- T007, T009, T011 (tests) can run in parallel
- T010, T012, T013 (contexts/components) can run in parallel after their dependencies

**Phase 3 (US1)**:

- T014, T015, T016 (tests) can run in parallel
- T025, T026, T027, T028 (components) can run in parallel

**Phase 5 (US3)**:

- T046, T047, T048, T049 (input components) can run in parallel

**Phase 10 (US8)**:

- T081, T082, T083, T084, T085, T086, T087, T088 (remaining components) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Write tests for SurfaceContext in src/0.9/contexts/SurfaceContext.test.tsx"
Task: "Write tests for useA2UIMessageHandler in src/0.9/hooks/useA2UIMessageHandler.test.tsx"
Task: "Write tests for ComponentRenderer in src/0.9/components/ComponentRenderer.test.tsx"

# Launch basic components together (after ComponentRenderer is done):
Task: "Implement TextComponent in src/0.9/components/display/TextComponent.tsx"
Task: "Implement RowComponent in src/0.9/components/layout/RowComponent.tsx"
Task: "Implement ColumnComponent in src/0.9/components/layout/ColumnComponent.tsx"
Task: "Implement ButtonComponent in src/0.9/components/interactive/ButtonComponent.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Basic Rendering)
4. Complete Phase 4: User Story 2 (Data Binding)
5. Complete Phase 5: User Story 3 (Two-Way Binding)
6. **STOP and VALIDATE**: Test core functionality independently
7. Deploy/demo if ready - this is a functional 0.9 renderer!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Basic rendering works
3. Add User Story 2 → Test independently → Data binding works
4. Add User Story 3 → Test independently → Forms work (MVP Complete!)
5. Add User Stories 4-6 → Enhanced features (P2)
6. Add User Stories 7-8 → Polish features (P3)
7. Each story adds value without breaking previous stories

### Suggested MVP Scope

**MVP = User Stories 1, 2, 3** (all P1 priority)

This delivers:

- Basic message processing and rendering
- Data model binding with simplified format
- Two-way binding for input components
- Core components: Text, Button, TextField, CheckBox, Row, Column

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests follow existing 0.8 pattern (co-located with source files)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Existing 0.8 implementation provides reference patterns for most components
