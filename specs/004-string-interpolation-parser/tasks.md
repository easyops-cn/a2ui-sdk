# Tasks: String Interpolation Parser Refactoring

**Input**: Design documents from `/specs/004-string-interpolation-parser/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Comprehensive unit tests are required per SC-006 (90%+ code coverage target).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md, all source code is in `src/0.9/utils/interpolation/`:

```text
src/0.9/utils/
├── interpolation/            # NEW: Parser module directory
│   ├── index.ts              # Public API exports
│   ├── types.ts              # Token and AST type definitions
│   ├── lexer.ts              # Tokenizer
│   ├── lexer.test.ts         # Lexer tests
│   ├── parser.ts             # AST builder
│   ├── parser.test.ts        # Parser tests
│   ├── evaluator.ts          # AST evaluator
│   └── evaluator.test.ts     # Evaluator tests
├── interpolation.ts          # DEPRECATED: Will be replaced
├── interpolation.test.ts     # EXISTING: Update with new tests
└── dataBinding.ts            # Consumer: Update imports
```

---

## Phase 1: Setup

**Purpose**: Create module structure and type definitions

- [x] T001 Create interpolation module directory at src/0.9/utils/interpolation/
- [x] T002 Define TokenType enum and Token interface in src/0.9/utils/interpolation/types.ts
- [x] T003 Define AST node types (LiteralNode, PathNode, FunctionCallNode, InterpolatedStringNode) in src/0.9/utils/interpolation/types.ts
- [x] T004 Define ParseError and EvaluationContext types in src/0.9/utils/interpolation/types.ts
- [x] T005 Create public API stub exports (parseInterpolation, interpolate) in src/0.9/utils/interpolation/index.ts

---

## Phase 2: Foundational - Lexer Implementation

**Purpose**: Implement tokenizer that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until the lexer is complete and tested

### Lexer Tests

- [x] T006 [P] Write lexer tests for TEXT tokens (literal text) in src/0.9/utils/interpolation/lexer.test.ts
- [x] T007 [P] Write lexer tests for EXPR_START and EXPR_END tokens in src/0.9/utils/interpolation/lexer.test.ts
- [x] T008 [P] Write lexer tests for PATH tokens (absolute and relative) in src/0.9/utils/interpolation/lexer.test.ts
- [x] T009 [P] Write lexer tests for IDENTIFIER, LPAREN, RPAREN, COMMA tokens in src/0.9/utils/interpolation/lexer.test.ts
- [x] T010 [P] Write lexer tests for STRING, NUMBER, BOOLEAN literal tokens in src/0.9/utils/interpolation/lexer.test.ts
- [x] T011 [P] Write lexer tests for escape sequence handling (\\${) in src/0.9/utils/interpolation/lexer.test.ts
- [x] T012 [P] Write lexer tests for JSON Pointer escapes (~0, ~1) in PATH tokens in src/0.9/utils/interpolation/lexer.test.ts

### Lexer Implementation

- [x] T013 Implement lexer state machine (TEXT vs EXPRESSION mode) in src/0.9/utils/interpolation/lexer.ts
- [x] T014 Implement TEXT token extraction with escape sequence detection in src/0.9/utils/interpolation/lexer.ts
- [x] T015 Implement PATH token extraction (absolute/relative, JSON Pointer syntax) in src/0.9/utils/interpolation/lexer.ts
- [x] T016 Implement IDENTIFIER token extraction in src/0.9/utils/interpolation/lexer.ts
- [x] T017 Implement literal token extraction (STRING, NUMBER, BOOLEAN) in src/0.9/utils/interpolation/lexer.ts
- [x] T018 Implement tokenize() function that returns Token[] in src/0.9/utils/interpolation/lexer.ts
- [x] T019 Verify all lexer tests pass

**Checkpoint**: Lexer complete - parser implementation can now begin

---

## Phase 3: User Story 1 - Simple Path Interpolation (Priority: P1) 🎯 MVP

**Goal**: Enable `${/path}` expressions to resolve values from data model

**Independent Test**: Render Text component with `"Hello, ${/user/name}!"` and verify output

### Parser Tests for US1

- [x] T020 [P] [US1] Write parser tests for simple path expressions in src/0.9/utils/interpolation/parser.test.ts
- [x] T021 [P] [US1] Write parser tests for mixed literal and path content in src/0.9/utils/interpolation/parser.test.ts
- [x] T022 [P] [US1] Write parser tests for multiple path expressions in src/0.9/utils/interpolation/parser.test.ts

### Parser Implementation for US1

- [x] T023 [US1] Implement recursive descent parser skeleton in src/0.9/utils/interpolation/parser.ts
- [x] T024 [US1] Implement parseInterpolatedString() for root node in src/0.9/utils/interpolation/parser.ts
- [x] T025 [US1] Implement parsePath() for PathNode construction in src/0.9/utils/interpolation/parser.ts
- [x] T026 [US1] Implement error recovery (return empty literal on parse error) in src/0.9/utils/interpolation/parser.ts
- [x] T027 [US1] Export parse() function in src/0.9/utils/interpolation/parser.ts

### Evaluator Tests for US1

- [x] T028 [P] [US1] Write evaluator tests for path resolution in src/0.9/utils/interpolation/evaluator.test.ts
- [x] T029 [P] [US1] Write evaluator tests for missing path (returns empty string) in src/0.9/utils/interpolation/evaluator.test.ts
- [x] T030 [P] [US1] Write evaluator tests for type coercion (number, boolean, object, array) in src/0.9/utils/interpolation/evaluator.test.ts
- [x] T031 [P] [US1] Write evaluator tests for JSON Pointer escape decoding (~0, ~1) in src/0.9/utils/interpolation/evaluator.test.ts

### Evaluator Implementation for US1

- [x] T032 [US1] Implement evaluate() function with AST traversal in src/0.9/utils/interpolation/evaluator.ts
- [x] T033 [US1] Implement evaluatePath() with JSON Pointer decoding in src/0.9/utils/interpolation/evaluator.ts
- [x] T034 [US1] Implement stringifyValue() for type coercion in src/0.9/utils/interpolation/evaluator.ts

### Integration for US1

- [x] T035 [US1] Wire parseInterpolation() in index.ts to call lexer → parser in src/0.9/utils/interpolation/index.ts
- [x] T036 [US1] Wire interpolate() in index.ts to call parse → evaluate in src/0.9/utils/interpolation/index.ts
- [x] T037 [US1] Verify all US1 tests pass (parser + evaluator)

**Checkpoint**: Simple path interpolation works - ${/path} expressions resolve correctly

---

## Phase 4: User Story 2 - Function Call Interpolation (Priority: P1)

**Goal**: Enable `${func()}` and `${func(arg1, arg2)}` syntax

**Independent Test**: Render with `"${upper('hello')}"` and verify output is "HELLO"

### Parser Tests for US2

- [x] T038 [P] [US2] Write parser tests for no-argument function calls in src/0.9/utils/interpolation/parser.test.ts
- [x] T039 [P] [US2] Write parser tests for function calls with literal arguments in src/0.9/utils/interpolation/parser.test.ts
- [x] T040 [P] [US2] Write parser tests for function calls with path arguments in src/0.9/utils/interpolation/parser.test.ts

### Parser Implementation for US2

- [x] T041 [US2] Implement parseFunctionCall() for FunctionCallNode construction in src/0.9/utils/interpolation/parser.ts
- [x] T042 [US2] Implement parseArgument() for literal values (string, number, boolean) in src/0.9/utils/interpolation/parser.ts
- [x] T043 [US2] Update parseExpression() to distinguish path vs function call in src/0.9/utils/interpolation/parser.ts

### Evaluator Tests for US2

- [x] T044 [P] [US2] Write evaluator tests for function invocation in src/0.9/utils/interpolation/evaluator.test.ts
- [x] T045 [P] [US2] Write evaluator tests for unknown function (returns empty, logs warning) in src/0.9/utils/interpolation/evaluator.test.ts
- [x] T046 [P] [US2] Write evaluator tests for function with resolved path arguments in src/0.9/utils/interpolation/evaluator.test.ts

### Evaluator Implementation for US2

- [x] T047 [US2] Implement evaluateFunctionCall() with argument resolution in src/0.9/utils/interpolation/evaluator.ts
- [x] T048 [US2] Implement function registry lookup and invocation in src/0.9/utils/interpolation/evaluator.ts
- [x] T049 [US2] Add console.warn for unknown functions in src/0.9/utils/interpolation/evaluator.ts
- [x] T050 [US2] Verify all US2 tests pass

**Checkpoint**: Function calls work - ${func(args)} expressions invoke functions

---

## Phase 5: User Story 3 - Nested Expression Interpolation (Priority: P2)

**Goal**: Enable `${outer(${inner})}` and deeply nested expressions

**Independent Test**: Render with `"${upper(${/name})}"` where /name="john" and verify output is "JOHN"

### Parser Tests for US3

- [x] T051 [P] [US3] Write parser tests for nested path in function argument in src/0.9/utils/interpolation/parser.test.ts
- [x] T052 [P] [US3] Write parser tests for nested function call in argument in src/0.9/utils/interpolation/parser.test.ts
- [x] T053 [P] [US3] Write parser tests for deeply nested expressions (3+ levels) in src/0.9/utils/interpolation/parser.test.ts
- [x] T054 [P] [US3] Write parser tests for max nesting depth (10 levels) in src/0.9/utils/interpolation/parser.test.ts

### Parser Implementation for US3

- [x] T055 [US3] Update parseArgument() to handle nested expressions recursively in src/0.9/utils/interpolation/parser.ts
- [x] T056 [US3] Add nesting depth tracking and MAX_DEPTH constant in src/0.9/utils/interpolation/parser.ts
- [x] T057 [US3] Add error handling for exceeded nesting depth in src/0.9/utils/interpolation/parser.ts

### Evaluator Tests for US3

- [x] T058 [P] [US3] Write evaluator tests for nested path evaluation in src/0.9/utils/interpolation/evaluator.test.ts
- [x] T059 [P] [US3] Write evaluator tests for nested function evaluation order in src/0.9/utils/interpolation/evaluator.test.ts

### Evaluator Implementation for US3

- [x] T060 [US3] Ensure recursive evaluation handles nested expressions in src/0.9/utils/interpolation/evaluator.ts
- [x] T061 [US3] Verify all US3 tests pass

**Checkpoint**: Nested expressions work - innermost expressions evaluate first

---

## Phase 6: User Story 4 - Escaped Interpolation (Priority: P2)

**Goal**: Enable `\${literal}` to output literal `${literal}` text

**Independent Test**: Render with `"\\${escaped}"` and verify output is "${escaped}"

### Lexer Tests for US4 (already covered in T011)

### Evaluator Tests for US4

- [x] T062 [P] [US4] Write evaluator tests for escaped expression output in src/0.9/utils/interpolation/evaluator.test.ts
- [x] T063 [P] [US4] Write evaluator tests for mixed escaped and unescaped in src/0.9/utils/interpolation/evaluator.test.ts

### Implementation for US4

- [x] T064 [US4] Ensure lexer produces correct TEXT token for escaped sequences in src/0.9/utils/interpolation/lexer.ts
- [x] T065 [US4] Ensure evaluator preserves escaped text as literal in src/0.9/utils/interpolation/evaluator.ts
- [x] T066 [US4] Verify all US4 tests pass

**Checkpoint**: Escape sequences work - \${ outputs literal ${

---

## Phase 7: User Story 5 - Relative Path Resolution (Priority: P2)

**Goal**: Enable `${name}` to resolve relative to basePath context

**Independent Test**: Render with `"${name}"` in scope `/users/0` and verify it resolves `/users/0/name`

### Evaluator Tests for US5

- [x] T067 [P] [US5] Write evaluator tests for relative path resolution with basePath in src/0.9/utils/interpolation/evaluator.test.ts
- [x] T068 [P] [US5] Write evaluator tests for mixed absolute and relative paths in src/0.9/utils/interpolation/evaluator.test.ts
- [x] T069 [P] [US5] Write evaluator tests for nested relative paths (e.g., profile/name) in src/0.9/utils/interpolation/evaluator.test.ts

### Evaluator Implementation for US5

- [x] T070 [US5] Update evaluatePath() to use basePath for relative path resolution in src/0.9/utils/interpolation/evaluator.ts
- [x] T071 [US5] Reuse resolvePath() from pathUtils.ts for path joining in src/0.9/utils/interpolation/evaluator.ts
- [x] T072 [US5] Verify all US5 tests pass

**Checkpoint**: Relative paths work - ${name} resolves against basePath

---

## Phase 8: Integration & Migration

**Purpose**: Replace old implementation and update consumers

- [x] T073 Update dataBinding.ts to import from ./interpolation instead of ./interpolation.ts in src/0.9/utils/dataBinding.ts
- [x] T074 Remove hasInterpolation re-export from dataBinding.ts (no longer public) in src/0.9/utils/dataBinding.ts
- [x] T075 Update existing interpolation.test.ts to test new public API in src/0.9/utils/interpolation.test.ts
- [x] T076 Delete old interpolation.ts file (replaced by interpolation/index.ts) in src/0.9/utils/
- [x] T077 Run full test suite and verify no regressions
- [x] T078 Verify npm run build succeeds

**Checkpoint**: Migration complete - old implementation replaced

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation

- [x] T079 [P] Add JSDoc comments to all public types in src/0.9/utils/interpolation/types.ts
- [x] T080 [P] Add JSDoc comments to parseInterpolation and interpolate in src/0.9/utils/interpolation/index.ts
- [x] T081 Review error messages for clarity and consistency across lexer/parser/evaluator
- [x] T082 Run quickstart.md examples manually to validate documentation accuracy
- [x] T083 Verify code coverage meets 90% target for new parser code
- [x] T084 Run npm run lint and fix any issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Lexer)**: Depends on Phase 1 - BLOCKS all user stories
- **Phase 3-7 (User Stories)**: All depend on Phase 2 (Lexer) completion
  - US1 (Simple Path) must complete before US3 (Nested) since nesting builds on parsing
  - US2 (Function Call) must complete before US3 (Nested) since nesting uses functions
  - US4 (Escaped) can run in parallel with US3
  - US5 (Relative Path) can run in parallel with US3/US4
- **Phase 8 (Migration)**: Depends on US1-US5 completion
- **Phase 9 (Polish)**: Depends on Phase 8

### User Story Dependencies

```
Phase 2 (Lexer) ─┬─▶ US1 (Path) ─┬─▶ US3 (Nested) ─┬─▶ Phase 8 (Migration)
                 │               │                  │
                 │               │                  │
                 └─▶ US2 (Func) ─┘                  │
                                                    │
                 ├─▶ US4 (Escape) ─────────────────┤
                 │                                  │
                 └─▶ US5 (Relative) ───────────────┘
```

### Parallel Opportunities

**Within Phase 2 (Lexer Tests)**:

- T006, T007, T008, T009, T010, T011, T012 can all run in parallel

**Within Each User Story**:

- Parser tests (T020-T022, T038-T040, etc.) can run in parallel
- Evaluator tests (T028-T031, T044-T046, etc.) can run in parallel

**Across User Stories** (after US1 and US2 complete):

- US4 and US5 can run in parallel with US3

---

## Parallel Example: Phase 2 Lexer Tests

```bash
# Launch all lexer tests in parallel:
Task: "Write lexer tests for TEXT tokens in src/0.9/utils/interpolation/lexer.test.ts"
Task: "Write lexer tests for EXPR_START and EXPR_END tokens in src/0.9/utils/interpolation/lexer.test.ts"
Task: "Write lexer tests for PATH tokens in src/0.9/utils/interpolation/lexer.test.ts"
Task: "Write lexer tests for IDENTIFIER, LPAREN, RPAREN, COMMA tokens in src/0.9/utils/interpolation/lexer.test.ts"
Task: "Write lexer tests for STRING, NUMBER, BOOLEAN literal tokens in src/0.9/utils/interpolation/lexer.test.ts"
Task: "Write lexer tests for escape sequence handling in src/0.9/utils/interpolation/lexer.test.ts"
Task: "Write lexer tests for JSON Pointer escapes in src/0.9/utils/interpolation/lexer.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (type definitions)
2. Complete Phase 2: Lexer (tokenization)
3. Complete Phase 3: User Story 1 (simple path interpolation)
4. **STOP and VALIDATE**: Test `${/path}` expressions work
5. Continue to US2 (function calls) - essential for v0.9

### Incremental Delivery

1. Setup + Lexer → Tokenization works
2. Add US1 → Simple paths work → Backward compatible with v0.8 behavior
3. Add US2 → Function calls work → New v0.9 feature enabled
4. Add US3 → Nested expressions work → Advanced patterns enabled
5. Add US4 + US5 → Escaping and relative paths → Full feature set
6. Migration → Old code removed → Clean codebase

### Recommended Order

For a single developer working sequentially:

1. T001-T005 (Setup) - 30 min
2. T006-T019 (Lexer) - 2 hours
3. T020-T037 (US1) - 2 hours
4. T038-T050 (US2) - 2 hours
5. T051-T061 (US3) - 1.5 hours
6. T062-T066 (US4) - 30 min
7. T067-T072 (US5) - 1 hour
8. T073-T078 (Migration) - 1 hour
9. T079-T084 (Polish) - 1 hour

**Total estimated time**: ~11 hours

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD approach)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- JSON Pointer escapes (~0, ~1) must be decoded at evaluation time, not parse time
