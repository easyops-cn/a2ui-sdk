# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A2UI React Renderer Library (`@easyops-cn/a2ui-react`) - A React implementation for rendering A2UI protocol. This is a library package (not an application) that downstream developers consume.

## Monorepo Structure

This is an npm workspaces monorepo:

- Root package: `@easyops-cn/a2ui-react` - The main library
- `website/` - Documentation site using plain-blog
- `playground/` - Live demo workspace for real-time A2UI rendering development

## Commands

### Library (root)

```bash
npm run build        # TypeScript compile + Vite build (outputs to dist/)
npm run dev          # Start Vite dev server for local development
npm test             # Run Vitest in watch mode
npm run test:run     # Run tests once
npm run lint         # Run ESLint
npm run lint:fix     # ESLint with auto-fix
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

The primary entry point is `A2UIRender` component:

```tsx
import { A2UIRender, A2UIMessage, A2UIAction } from '@easyops-cn/a2ui-react/0.8'
;<A2UIRender messages={messages} onAction={handleAction} />
```

Custom components can override defaults or add new ones via `components` prop (Map<string, React.ComponentType>).

Custom components use hooks: `useDispatchAction`, `useDataBinding`, `useFormBinding`, and `ComponentRenderer` for rendering children.

## Package Exports

```javascript
import { v0_8 } from '@easyops-cn/a2ui-react'       // Main namespace export
import { ... } from '@easyops-cn/a2ui-react/0.8'    // Core module (A2UIRender, hooks, types)
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

- `src/0.8/contexts/` - React context providers (Surface, DataModel, Action)
- `src/0.8/hooks/` - Custom hooks for data binding and actions
- `src/0.8/components/` - Component implementations (display/, layout/, interactive/)
- `src/0.8/schemas/` - JSON schemas for A2UI protocol
- `src/components/ui/` - shadcn/ui primitives

## Testing

Tests co-located with source (`*.test.tsx`). Uses Vitest + React Testing Library + jsdom.

## Technologies

TypeScript 5.9, React 19, Radix UI (for UI primitives), Tailwind CSS (via class-variance-authority)

## Active Technologies

- TypeScript 5.9, React 19 + @uiw/react-codemirror (CodeMirror 6), @codemirror/lang-json, @easyops-cn/a2ui-react, Tailwind CSS 4 (002-playground)
- localStorage (theme preference only) (002-playground)

## Recent Changes

- 002-playground: Added TypeScript 5.9, React 19 + @uiw/react-codemirror (CodeMirror 6), @codemirror/lang-json, @easyops-cn/a2ui-react, Tailwind CSS 4
