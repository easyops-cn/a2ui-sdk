# Tasks: A2UIRenderer Component Library

**Input**: Design documents from `/specs/001-a2ui-renderer/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Tests are included as the existing codebase has test coverage patterns established.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single library project**: `src/0.8/` at repository root
- Tests co-located with source files (e.g., `A2UIRenderer.test.tsx`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the public API entry point and foundational exports

- [x] T001 Create index.ts public API exports file in src/0.8/index.ts
- [x] T002 Export A2UIMessage type from src/0.8/index.ts
- [x] T003 Export ActionPayload as A2UIAction type alias from src/0.8/index.ts
- [x] T004 [P] Export useDispatchAction hook from src/0.8/index.ts
- [x] T005 [P] Export useDataBinding hook from src/0.8/index.ts
- [x] T006 [P] Export useFormBinding hook from src/0.8/index.ts
- [x] T007 [P] Export ComponentRenderer component from src/0.8/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create ComponentsMap context for custom component support

**⚠️ CRITICAL**: User stories 3-4 depend on this phase for custom component support

- [x] T008 Create ComponentsMapContext in src/0.8/contexts/ComponentsMapContext.tsx
- [x] T009 Add ComponentsMapProvider to wrap component rendering
- [x] T010 Update ComponentRenderer to use ComponentsMapContext for component lookup in src/0.8/components/ComponentRenderer.tsx
- [x] T011 Add dev-mode placeholder component for unknown types in src/0.8/components/UnknownComponent.tsx
- [x] T012 Update ComponentRenderer to render UnknownComponent in dev mode, skip in production

**Checkpoint**: Foundation ready - A2UIRenderer component can now be implemented

---

## Phase 3: User Story 1 - Basic Message Rendering (Priority: P1) 🎯 MVP

**Goal**: Render A2UI messages using the A2UIRenderer component

**Independent Test**: Pass an array of A2UIMessage objects to A2UIRenderer and verify the UI renders correctly

### Tests for User Story 1

- [x] T013 [P] [US1] Create test file src/0.8/A2UIRenderer.test.tsx with test setup
- [x] T014 [P] [US1] Add test: renders nothing for empty messages array
- [x] T015 [P] [US1] Add test: renders components from valid A2UIMessage objects
- [x] T016 [P] [US1] Add test: renders nested components correctly

### Implementation for User Story 1

- [x] T017 [US1] Create A2UIRenderer component in src/0.8/A2UIRenderer.tsx
- [x] T018 [US1] Implement messages prop handling with useA2UIMessageHandler
- [x] T019 [US1] Implement surface rendering loop (render all surfaces from context)
- [x] T020 [US1] Add null/undefined messages handling (graceful empty render)
- [x] T021 [US1] Export A2UIRenderer from src/0.8/index.ts

**Checkpoint**: User Story 1 complete - basic rendering works independently

---

## Phase 4: User Story 2 - Action Handling (Priority: P1)

**Goal**: Receive action callbacks when users interact with components

**Independent Test**: Click interactive components and verify onAction callback receives correct A2UIAction payload

### Tests for User Story 2

- [x] T022 [P] [US2] Add test: onAction callback invoked when button clicked
- [x] T023 [P] [US2] Add test: action payload contains surfaceId, componentId, and context
- [x] T024 [P] [US2] Add test: multiple components dispatch unique actions

### Implementation for User Story 2

- [x] T025 [US2] Add onAction prop to A2UIRenderer component in src/0.8/A2UIRenderer.tsx
- [x] T026 [US2] Pass onAction to A2UIProvider in A2UIRenderer
- [x] T027 [US2] Add test: no error when action dispatched without onAction callback

**Checkpoint**: User Stories 1 AND 2 complete - rendering and actions work

---

## Phase 5: User Story 3 - Custom Component Override (Priority: P2)

**Goal**: Override default components with custom implementations via ComponentsMap

**Independent Test**: Provide ComponentsMap with custom Button and verify it renders instead of default

### Tests for User Story 3

- [x] T028 [P] [US3] Add test: custom Button component renders instead of default
- [x] T029 [P] [US3] Add test: multiple custom components render correctly
- [x] T030 [P] [US3] Add test: non-overridden components use defaults

### Implementation for User Story 3

- [x] T031 [US3] Add components prop (ComponentsMap) to A2UIRenderer in src/0.8/A2UIRenderer.tsx
- [x] T032 [US3] Wrap rendering with ComponentsMapProvider passing custom components
- [x] T033 [US3] Merge custom components with defaults in ComponentsMapContext

**Checkpoint**: User Story 3 complete - custom component overrides work

---

## Phase 6: User Story 4 - Custom Component Creation (Priority: P2)

**Goal**: Add new custom component types that don't exist in defaults

**Independent Test**: Add new "Switch" component type to ComponentsMap and verify it renders

### Tests for User Story 4

- [x] T034 [P] [US4] Add test: new component type "Switch" renders from ComponentsMap
- [x] T035 [P] [US4] Add test: custom component can use useDispatchAction hook

### Implementation for User Story 4

- [x] T036 [US4] Ensure ComponentsMapContext supports adding new types (not just overrides)
- [x] T037 [US4] Verify useDispatchAction works in custom components (integration test)

**Checkpoint**: User Story 4 complete - extensibility works

---

## Phase 7: User Story 5 - Data Binding in Custom Components (Priority: P3)

**Goal**: Use useDataBinding hook in custom components to read dynamic values

**Independent Test**: Create custom component using useDataBinding and verify it displays bound value

### Tests for User Story 5

- [x] T038 [P] [US5] Add test: custom component with useDataBinding displays bound value
- [x] T039 [P] [US5] Add test: useDataBinding returns default when path not found

### Implementation for User Story 5

- [x] T040 [US5] Verify useDataBinding is exported from index.ts (already done in T005)
- [x] T041 [US5] Add integration test with custom component using useDataBinding

**Checkpoint**: User Story 5 complete - data binding works in custom components

---

## Phase 8: User Story 6 - Form Binding in Custom Components (Priority: P3)

**Goal**: Use useFormBinding hook for two-way data binding in form inputs

**Independent Test**: Create custom Switch component using useFormBinding and verify value changes

### Tests for User Story 6

- [x] T042 [P] [US6] Add test: custom component with useFormBinding displays current value
- [x] T043 [P] [US6] Add test: useFormBinding setValue updates the bound value
- [x] T044 [P] [US6] Add test: useFormBinding returns default when path not found

### Implementation for User Story 6

- [x] T045 [US6] Verify useFormBinding is exported from index.ts (already done in T006)
- [x] T046 [US6] Add integration test with custom Switch component using useFormBinding

**Checkpoint**: User Story 6 complete - form binding works in custom components

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation

- [x] T047 [P] Verify all exports match README.md usage examples
- [x] T048 [P] Run full test suite and ensure all tests pass
- [ ] T049 [P] Verify build succeeds with `npm run build`
- [ ] T050 Run quickstart.md validation - test all code examples work
- [ ] T051 Update README.md if any API changes needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS user stories 3-4
- **User Story 1 (Phase 3)**: Depends on Setup (Phase 1) only
- **User Story 2 (Phase 4)**: Depends on User Story 1 (needs A2UIRenderer component)
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) for ComponentsMapContext
- **User Story 4 (Phase 6)**: Depends on User Story 3 (extends ComponentsMap support)
- **User Story 5 (Phase 7)**: Depends on Setup (Phase 1) - hooks already exist
- **User Story 6 (Phase 8)**: Depends on Setup (Phase 1) - hooks already exist
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 1 (Setup)
    │
    ├──────────────────────────────────┐
    │                                  │
    ▼                                  ▼
Phase 2 (Foundational)          Phase 3 (US1: Basic Rendering)
    │                                  │
    │                                  ▼
    │                           Phase 4 (US2: Action Handling)
    │                                  │
    ▼                                  │
Phase 5 (US3: Custom Override) ◄───────┘
    │
    ▼
Phase 6 (US4: Custom Creation)
    │
    ├──────────────────────────────────┐
    │                                  │
    ▼                                  ▼
Phase 7 (US5: Data Binding)     Phase 8 (US6: Form Binding)
    │                                  │
    └──────────────────────────────────┘
                    │
                    ▼
            Phase 9 (Polish)
```

### Parallel Opportunities

**Within Phase 1 (Setup)**:

- T004, T005, T006, T007 can run in parallel (different exports)

**Within Phase 3 (US1)**:

- T013, T014, T015, T016 can run in parallel (different test cases)

**Within Phase 4 (US2)**:

- T022, T023, T024 can run in parallel (different test cases)

**Within Phase 5 (US3)**:

- T028, T029, T030 can run in parallel (different test cases)

**Within Phase 7 & 8 (US5 & US6)**:

- These phases can run in parallel with each other (independent hooks)

---

## Parallel Example: Phase 1 Setup

```bash
# Launch all export tasks together:
Task: "Export useDispatchAction hook from src/0.8/index.ts"
Task: "Export useDataBinding hook from src/0.8/index.ts"
Task: "Export useFormBinding hook from src/0.8/index.ts"
Task: "Export ComponentRenderer component from src/0.8/index.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (index.ts exports)
2. Complete Phase 3: User Story 1 (basic rendering)
3. Complete Phase 4: User Story 2 (action handling)
4. **STOP and VALIDATE**: Test basic rendering with actions
5. Deploy/demo if ready - this covers the primary README.md example

### Incremental Delivery

1. Setup → US1 → US2 → **MVP Ready** (basic usage works)
2. Add Foundational → US3 → US4 → **Customization Ready** (ComponentsMap works)
3. Add US5 → US6 → **Full Feature Set** (all hooks work in custom components)
4. Polish → **Production Ready**

### Parallel Team Strategy

With multiple developers:

1. Developer A: Phase 1 + Phase 3 + Phase 4 (core rendering path)
2. Developer B: Phase 2 + Phase 5 + Phase 6 (customization path)
3. Developer C: Phase 7 + Phase 8 (hook integration tests)
4. All: Phase 9 (polish)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Most infrastructure already exists - tasks focus on integration and public API
- Existing tests provide patterns to follow
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
