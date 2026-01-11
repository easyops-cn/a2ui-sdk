# Implementation Plan: A2UIRenderer Component Library

**Branch**: `001-a2ui-renderer` | **Date**: 2026-01-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-a2ui-renderer/spec.md`

## Summary

Implement the A2UIRender component and public API exports for the A2UI React renderer library. The library already has substantial infrastructure implemented (contexts, hooks, component registry, default components). The remaining work focuses on:

1. Creating the main `A2UIRender` component that matches the README.md API
2. Setting up the versioned export path (`@easyops-cn/a2ui-react/0.8`)
3. Adding development-mode placeholder for unknown components
4. Ensuring all public types and hooks are properly exported

## Technical Context

**Language/Version**: TypeScript 5.9, React 19
**Primary Dependencies**: React 19, Radix UI (for UI primitives), Tailwind CSS (via class-variance-authority)
**Storage**: N/A (client-side rendering library)
**Testing**: Vitest with @testing-library/react
**Target Platform**: Browser (ES2020+)
**Project Type**: Single library project
**Performance Goals**: <100ms action callback latency, 10+ levels nested rendering
**Constraints**: Must work with React 18+ (peer dependency allows ^19.0.0)
**Scale/Scope**: ~20 component types, single entry point

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

The constitution template is not yet customized for this project. Proceeding with standard library development practices:

- [x] Library-first: Self-contained, independently testable
- [x] Test coverage: Vitest tests exist for contexts, hooks, and components
- [x] Type safety: Full TypeScript with strict mode
- [x] Documentation: JSDoc comments on all public APIs

## Existing Implementation Analysis

### Already Implemented

| Component/Module        | Status      | Location                                                           |
| ----------------------- | ----------- | ------------------------------------------------------------------ |
| **Contexts**            | ✅ Complete | `src/0.8/contexts/`                                                |
| - A2UIProvider          | ✅          | Combines Surface, DataModel, Action providers                      |
| - SurfaceContext        | ✅          | Surface state management                                           |
| - DataModelContext      | ✅          | Data model state management                                        |
| - ActionContext         | ✅          | Action dispatching                                                 |
| **Hooks**               | ✅ Complete | `src/0.8/hooks/`                                                   |
| - useDataBinding        | ✅          | Read-only data binding                                             |
| - useFormBinding        | ✅          | Two-way form binding                                               |
| - useDispatchAction     | ✅          | Action dispatching                                                 |
| - useComponent          | ✅          | Component lookup                                                   |
| - useSurface            | ✅          | Surface lookup                                                     |
| - useA2UIMessageHandler | ✅          | Message processing                                                 |
| **Components**          | ✅ Complete | `src/0.8/components/`                                              |
| - ComponentRenderer     | ✅          | Component routing with registry                                    |
| - Display (6 types)     | ✅          | Text, Image, Icon, Video, AudioPlayer, Divider                     |
| - Layout (6 types)      | ✅          | Row, Column, List, Card, Tabs, Modal                               |
| - Interactive (6 types) | ✅          | Button, CheckBox, TextField, DateTimeInput, MultipleChoice, Slider |
| **Types**               | ✅ Complete | `src/0.8/types/index.ts`                                           |
| **Utilities**           | ✅ Complete | `src/0.8/utils/`                                                   |

### Not Yet Implemented

| Component/Module          | Status     | Required For                                |
| ------------------------- | ---------- | ------------------------------------------- |
| **A2UIRender**            | ❌ Missing | Main entry component per README.md          |
| **index.ts exports**      | ❌ Missing | Versioned path `@easyops-cn/a2ui-react/0.8` |
| **Dev-mode placeholder**  | ❌ Missing | Unknown component handling per spec         |
| **ComponentsMap support** | ❌ Missing | Custom component override per README.md     |

## Project Structure

### Documentation (this feature)

```text
specs/001-a2ui-renderer/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API contracts)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── index.ts                    # Root export (existing)
└── 0.8/
    ├── index.ts                 # NEW: Versioned public API exports
    ├── A2UIRender.tsx          # NEW: Main render component
    ├── A2UIRender.test.tsx     # NEW: Tests for A2UIRender
    ├── contexts/               # Existing: Context providers
    │   ├── A2UIProvider.tsx
    │   ├── ActionContext.tsx
    │   ├── DataModelContext.tsx
    │   └── SurfaceContext.tsx
    ├── hooks/                  # Existing: React hooks
    │   ├── useDataBinding.ts
    │   ├── useDispatchAction.ts
    │   ├── useComponent.ts
    │   ├── useSurface.ts
    │   └── useA2UIMessageHandler.ts
    ├── components/             # Existing: Component implementations
    │   ├── ComponentRenderer.tsx
    │   ├── display/
    │   ├── layout/
    │   └── interactive/
    ├── types/                  # Existing: Type definitions
    │   └── index.ts
    └── utils/                  # Existing: Utility functions
        ├── dataBinding.ts
        └── pathUtils.ts
```

**Structure Decision**: Single library project structure. The existing codebase follows a well-organized module structure under `src/0.8/`. New files will be added at the same level.

## Complexity Tracking

No constitution violations. The implementation follows the existing patterns and adds minimal new code.
