# Implementation Plan: String Interpolation Parser Refactoring

**Branch**: `004-string-interpolation-parser` | **Date**: 2026-01-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-string-interpolation-parser/spec.md`

## Summary

Refactor the v0.9 string interpolation implementation from regex-based parsing to a proper lexer → parser → AST evaluator approach. The current regex implementation (`/(?<!\\)\$\{([^}]+)\}/g`) cannot handle function calls like `${now()}` or nested expressions like `${formatDate(${/timestamp}, 'yyyy-MM-dd')}`. The new implementation will use a hand-written recursive descent parser to build an AST, then evaluate it against the data model.

## Technical Context

**Language/Version**: TypeScript 5.9
**Primary Dependencies**: React 19, Vitest (testing)
**Storage**: N/A (client-side rendering library)
**Testing**: Vitest + React Testing Library
**Target Platform**: Browser (bundled via Vite)
**Project Type**: Single library package (npm workspaces monorepo)
**Performance Goals**: Comparable to current regex-based implementation; interpolation of simple paths should not regress
**Constraints**: No external parsing libraries; hand-written parser to keep bundle size minimal
**Scale/Scope**: Utility module within `src/0.9/utils/`

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

The project constitution is currently a template without project-specific principles. No gates to evaluate.

**Status**: PASS (no constraints defined)

## Project Structure

### Documentation (this feature)

```text
specs/004-string-interpolation-parser/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/0.9/utils/
├── interpolation.ts          # Current implementation (to be replaced)
├── interpolation.test.ts     # Current tests (to be updated)
├── interpolation/            # NEW: Parser module directory
│   ├── index.ts              # Public API exports
│   ├── lexer.ts              # Tokenizer
│   ├── lexer.test.ts         # Lexer tests
│   ├── parser.ts             # AST builder
│   ├── parser.test.ts        # Parser tests
│   ├── evaluator.ts          # AST evaluator
│   ├── evaluator.test.ts     # Evaluator tests
│   └── types.ts              # Token and AST type definitions
├── dataBinding.ts            # Consumer (imports from interpolation)
└── pathUtils.ts              # Path resolution utilities (reused)
```

**Structure Decision**: Create a new `interpolation/` subdirectory to organize lexer, parser, and evaluator as separate modules. The existing `interpolation.ts` will be replaced with an `index.ts` that re-exports the public API (`parseInterpolation`, `interpolate`).

## Complexity Tracking

No constitution violations to justify.
