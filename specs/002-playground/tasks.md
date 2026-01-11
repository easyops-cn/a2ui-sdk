# Tasks: A2UI Playground

**Input**: Design documents from `/specs/002-playground/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Not explicitly requested in specification. Test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md, the playground is a workspace within the monorepo:

```text
playground/
├── src/
│   ├── components/    # React components
│   ├── data/          # Example data
│   ├── hooks/         # Custom hooks
│   ├── App.tsx        # Main application
│   └── ...
```

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [x] T001 Install CodeMirror dependencies: `npm install -w playground @uiw/react-codemirror @codemirror/lang-json`
- [x] T002 Install lucide-react for icons: `npm install -w playground lucide-react`
- [x] T003 Configure Vite to resolve @easyops-cn/a2ui-react workspace dependency in playground/vite.config.ts
- [x] T004 [P] Create components directory structure in playground/src/components/
- [x] T005 [P] Create data directory structure in playground/src/data/
- [x] T006 [P] Create hooks directory structure in playground/src/hooks/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create Example type definition in playground/src/data/examples.ts (interface only, no data yet)
- [x] T008 Create ErrorDisplay component for showing error messages in playground/src/components/ErrorDisplay.tsx
- [x] T009 Setup global CSS with theme variables (light/dark) matching website in playground/src/index.css
- [x] T010 Update playground/index.html with proper title and theme initialization script

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Live JSON Editing with Preview (Priority: P1) 🎯 MVP

**Goal**: Enable developers to edit A2UI JSON and see real-time rendered preview

**Independent Test**: Enter valid A2UI JSON in editor, verify preview updates within 500ms. Enter invalid JSON, verify error state displays without crash.

### Implementation for User Story 1

- [x] T011 [P] [US1] Create JsonEditor component with CodeMirror integration in playground/src/components/JsonEditor.tsx
- [x] T012 [P] [US1] Create Preview component wrapping A2UIRender with error boundary in playground/src/components/Preview.tsx
- [x] T013 [US1] Create split-panel layout in playground/src/App.tsx with editor (left) and preview (right)
- [x] T014 [US1] Add layout styles for split-panel (50/50) in playground/src/App.css
- [x] T015 [US1] Implement JSON parsing with error handling in App.tsx (parse on change, update preview or show error)
- [x] T016 [US1] Add action handler to log dispatched actions to console in App.tsx

**Checkpoint**: User Story 1 complete - can edit JSON and see live preview with error handling

---

## Phase 4: User Story 2 - Example Selection (Priority: P2)

**Goal**: Provide pre-built examples that populate the editor and preview

**Independent Test**: Select each example from dropdown, verify editor content and preview both update correctly.

### Implementation for User Story 2

- [x] T017 [P] [US2] Create "Hello World" example (basic Text component) in playground/src/data/examples.ts
- [x] T018 [P] [US2] Create "Layout Demo" example (Column/Row with children) in playground/src/data/examples.ts
- [x] T019 [P] [US2] Create "Button Actions" example (Button with action) in playground/src/data/examples.ts
- [x] T020 [P] [US2] Create "Form Inputs" example (TextField, Checkbox) in playground/src/data/examples.ts
- [x] T021 [P] [US2] Create "Data Binding" example (ValueSource path bindings) in playground/src/data/examples.ts
- [x] T022 [US2] Create ExampleSelector dropdown component in playground/src/components/ExampleSelector.tsx
- [x] T023 [US2] Integrate ExampleSelector into App.tsx (place above editor, wire up selection handler)
- [x] T024 [US2] Implement initial load with first example pre-selected in App.tsx

**Checkpoint**: User Story 2 complete - can select examples and see them populate editor/preview

---

## Phase 5: User Story 3 - Theme Switching (Priority: P3)

**Goal**: Allow switching between light and dark themes with persistence

**Independent Test**: Click theme toggle, verify entire UI switches theme. Refresh page, verify theme persists.

### Implementation for User Story 3

- [x] T025 [P] [US3] Create useTheme hook with localStorage persistence in playground/src/hooks/useTheme.ts
- [x] T026 [P] [US3] Create ThemeToggle component (sun/moon icons) in playground/src/components/ThemeToggle.tsx
- [x] T027 [US3] Create Header component with title and ThemeToggle in playground/src/components/Header.tsx
- [x] T028 [US3] Integrate Header into App.tsx layout
- [x] T029 [US3] Add CodeMirror theme switching (light/dark) based on current theme in JsonEditor.tsx
- [x] T030 [US3] Style Header to match website design (primary color, font) in playground/src/App.css

**Checkpoint**: User Story 3 complete - theme toggle works with persistence

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation

- [x] T031 Add responsive layout adjustments for 1024px+ screens in playground/src/App.css
- [ ] T032 Verify all examples render without errors (manual test each example)
- [ ] T033 Verify preview updates within 500ms of JSON edits (performance check)
- [x] T034 Run `npm run build -w playground` and verify production build succeeds

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P2 → P3)
  - Or in parallel if multiple developers available
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 editor/preview but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1 editor but independently testable

### Within Each User Story

- Components before integration
- Core implementation before styling
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**:

- T004, T005, T006 can run in parallel (directory creation)

**Phase 3 (US1)**:

- T011, T012 can run in parallel (JsonEditor and Preview are independent components)

**Phase 4 (US2)**:

- T017, T018, T019, T020, T021 can ALL run in parallel (each example is independent)

**Phase 5 (US3)**:

- T025, T026 can run in parallel (useTheme hook and ThemeToggle component are independent)

---

## Parallel Example: User Story 2

```bash
# Launch all example creation tasks together:
Task: "Create Hello World example in playground/src/data/examples.ts"
Task: "Create Layout Demo example in playground/src/data/examples.ts"
Task: "Create Button Actions example in playground/src/data/examples.ts"
Task: "Create Form Inputs example in playground/src/data/examples.ts"
Task: "Create Data Binding example in playground/src/data/examples.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T010)
3. Complete Phase 3: User Story 1 (T011-T016)
4. **STOP and VALIDATE**: Test JSON editing and preview independently
5. Deploy/demo if ready - core playground functionality works

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → **MVP Ready!**
3. Add User Story 2 → Test independently → Examples available
4. Add User Story 3 → Test independently → Theme switching works
5. Polish phase → Production ready

### Single Developer Strategy

Execute phases sequentially:

1. Phase 1: Setup (~10 min)
2. Phase 2: Foundational (~20 min)
3. Phase 3: User Story 1 (~45 min) → **MVP checkpoint**
4. Phase 4: User Story 2 (~30 min)
5. Phase 5: User Story 3 (~30 min)
6. Phase 6: Polish (~15 min)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- The playground workspace already exists with basic Vite setup; tasks build on existing structure
