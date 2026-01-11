# Implementation Plan: A2UI Playground

**Branch**: `002-playground` | **Date**: 2026-01-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-playground/spec.md`

## Summary

Implement an interactive playground for the A2UI React library that allows developers to edit A2UI JSON messages in a code editor and see real-time rendered previews. The playground includes a header matching the website design (with theme toggle), a split-panel layout (editor left, preview right), and pre-built examples selectable via dropdown.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19
**Primary Dependencies**: @uiw/react-codemirror (CodeMirror 6), @codemirror/lang-json, @easyops-cn/a2ui-react, Tailwind CSS 4
**Storage**: localStorage (theme preference only)
**Testing**: Vitest + React Testing Library (inherited from root)
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge), desktop 1024px+
**Project Type**: Web application (playground workspace within monorepo)
**Performance Goals**: Preview updates within 500ms, initial load under 3 seconds
**Constraints**: Desktop-only (1024px minimum width), client-side only
**Scale/Scope**: Single-page application, 5-6 pre-built examples

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

The project constitution is a template without specific rules defined. No gates to enforce.

**Status**: PASS (no violations)

## Project Structure

### Documentation (this feature)

```text
specs/002-playground/
├── plan.md              # This file
├── research.md          # Phase 0 output - technology decisions
├── data-model.md        # Phase 1 output - data structures
├── quickstart.md        # Phase 1 output - development guide
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
playground/
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Header with title and theme toggle
│   │   ├── ThemeToggle.tsx      # Sun/moon theme switch component
│   │   ├── JsonEditor.tsx       # CodeMirror-based JSON editor
│   │   ├── Preview.tsx          # A2UIRender wrapper with error boundary
│   │   ├── ExampleSelector.tsx  # Dropdown for example selection
│   │   └── ErrorDisplay.tsx     # Error state display component
│   ├── data/
│   │   └── examples.ts          # Pre-built A2UI message examples
│   ├── hooks/
│   │   └── useTheme.ts          # Theme state management with localStorage
│   ├── App.tsx                  # Main app with split-panel layout
│   ├── App.css                  # Layout and theme styles
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles (Tailwind)
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.app.json
```

**Structure Decision**: Single workspace application within the existing monorepo. The playground is a standalone Vite React app that imports the main library as a workspace dependency.

## Complexity Tracking

No constitution violations to justify.
