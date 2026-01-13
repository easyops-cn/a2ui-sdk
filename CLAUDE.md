# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A2UI SDK - SDK for integrating with A2UI protocol. This is a set of library packages (not applications) that downstream developers consume.

## Monorepo Structure

This is an npm workspaces monorepo:

- `packages/react` - `@a2ui-sdk/react` - React implementation for rendering A2UI protocol
- `packages/types` - `@a2ui-sdk/types` - TypeScript type definitions for A2UI protocol
- `packages/utils` - `@a2ui-sdk/utils` - Utility functions for A2UI
- `website/` - Documentation site using plain-blog
- `playground/` - Live demo workspace for real-time A2UI rendering development

## Commands

### Root (linting & formatting)

```bash
npm run lint         # Run ESLint across all packages
npm run lint:fix     # ESLint with auto-fix
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Packages

**Build order:** `types` → `utils` → `react` (each package depends on the previous)

```bash
# Types package (build first)
npm run build -w @a2ui-sdk/types    # TypeScript compile

# Utils package (depends on types)
npm run build -w @a2ui-sdk/utils    # TypeScript compile
npm test -w @a2ui-sdk/utils         # Run Vitest in watch mode

# React package (depends on types and utils)
npm run build -w @a2ui-sdk/react    # TypeScript compile + Vite build
npm run dev -w @a2ui-sdk/react      # Start Vite dev server
npm test -w @a2ui-sdk/react         # Run Vitest in watch mode
npm run test:run -w @a2ui-sdk/react # Run tests once
```

### Website

```bash
npm run build -w website     # Build website (outputs to website/dist/)
npm run serve -w website     # Serve built website locally
```

### Playground

```bash
npm run dev -w playground    # Start playground dev server for live A2UI demos
npm run build -w playground  # Build playground
```

## Library Usage (Downstream API)

The primary entry points are `A2UIProvider` and `A2UIRenderer`:

```tsx
import {
  A2UIProvider,
  A2UIRenderer,
  type A2UIMessage,
  type A2UIAction,
} from '@a2ui-sdk/react/0.8'
;<A2UIProvider messages={messages}>
  <A2UIRenderer onAction={handleAction} />
</A2UIProvider>
```

Custom components can override defaults or add new ones via `components` prop on `A2UIProvider` (Map<string, React.ComponentType>).

Custom components use hooks: `useDispatchAction`, `useDataBinding`, `useFormBinding`, and `ComponentRenderer` for rendering children.

## Package Exports

```javascript
// React package
import { v0_8 } from '@a2ui-sdk/react'       // Main namespace export
import { ... } from '@a2ui-sdk/react/0.8'    // v0.8 module
import { ... } from '@a2ui-sdk/react/0.9'    // v0.9 module

// Types package
import { ... } from '@a2ui-sdk/types/0.8'    // v0.8 types
import { ... } from '@a2ui-sdk/types/0.9'    // v0.9 types

// Utils package
import { ... } from '@a2ui-sdk/utils'        // Utilities
import { ... } from '@a2ui-sdk/utils/0.9'    // v0.9 utilities
```

## Architecture

### Message Flow

A2UI messages processed in order:

1. `beginRendering` - Initialize Surface with ID, root component, styles
2. `surfaceUpdate` - Add/update components in Surface's component tree
3. `dataModelUpdate` - Update hierarchical data model at paths
4. `deleteSurface` - Remove Surface

### Core Concepts

- **Surface**: Top-level container with `surfaceId`, `root` component ID, component tree, and styles
- **Data Model**: Hierarchical key-value store. Components reference via paths like `/user/name`
- **ValueSource**: `{ literalString: "..." }` for static, `{ path: "/data/path" }` for data binding
- **Actions**: User interactions dispatch actions with resolved context values

### Key Directories

- `packages/react/src/0.8/` - A2UI v0.8 React implementation
  - `contexts/` - React context providers (Surface, DataModel, Action)
  - `hooks/` - Custom hooks for data binding and actions
  - `components/` - Component implementations (display/, layout/, interactive/)
  - `schemas/` - JSON schemas for A2UI protocol
- `packages/react/src/0.9/` - A2UI v0.9 React implementation
- `packages/react/src/components/ui/` - shadcn/ui primitives
- `packages/types/src/` - TypeScript type definitions for A2UI protocol
- `packages/utils/src/` - Utility functions (interpolation, path utils, etc.)

## Testing

Tests co-located with source (`*.test.tsx`). Uses Vitest + React Testing Library + jsdom.

## Technologies

TypeScript 5.9, React 19, Radix UI (for UI primitives), Tailwind CSS (via class-variance-authority)

## Active Technologies

- TypeScript 5.9 + React 19, Vitest (testing) (004-string-interpolation-parser)

- TypeScript 5.9 + React 19, Radix UI (for UI primitives), Tailwind CSS (via class-variance-authority), lucide-react (icons) (003-a2ui-0-9-renderer)
- N/A (client-side rendering library) (003-a2ui-0-9-renderer)

- TypeScript 5.9, React 19 + @uiw/react-codemirror (CodeMirror 6), @codemirror/lang-json, Tailwind CSS 4 (002-playground)
- localStorage (theme preference only) (002-playground)

## Recent Changes

- 002-playground: Added TypeScript 5.9, React 19 + @uiw/react-codemirror (CodeMirror 6), @codemirror/lang-json, Tailwind CSS 4
