# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A2UI React Renderer Library - A React implementation for rendering A2UI (Agent-to-User Interface) specifications. The library processes server-to-client A2UI messages to render dynamic UI components with data binding and action handling.

## Commands

```bash
# Development
npm run dev          # Start Vite dev server
npm run build        # TypeScript compile + Vite build
npm run preview      # Preview production build

# Testing
npm test             # Run Vitest in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier format all files
npm run format:check # Check formatting
```

## Architecture

### Message Flow

The library processes A2UI messages from a server in this order:

1. `beginRendering` - Initializes a Surface with ID, root component, and styles
2. `surfaceUpdate` - Adds/updates components in the Surface's component tree
3. `dataModelUpdate` - Updates the hierarchical data model at specified paths
4. `deleteSurface` - Removes a Surface

### Core Concepts

**Surface**: Top-level container holding a component tree and styles. Each Surface has a unique `surfaceId` and a `root` component ID.

**Data Model**: Hierarchical key-value store. Components reference data via paths like `/user/name`. Supports two-way binding for form components.

**ValueSource**: Components bind to data using `{ literalString: "..." }` for static values or `{ path: "/data/path" }` for data model references.

**Actions**: User interactions dispatch actions with resolved context values from the data model.

### Context Providers (src/0.8/contexts/)

All contexts must be wrapped in `A2UIProvider`:

- `SurfaceProvider` - Manages component trees per Surface
- `DataModelProvider` - Manages data models per Surface
- `ActionProvider` - Dispatches actions with resolved context

### Hooks (src/0.8/hooks/)

- `useA2UIMessageHandler` - Processes incoming A2UI messages
- `useComponent` - Gets a component definition from a Surface
- `useDataBinding` - Resolves ValueSource to actual value (read-only)
- `useFormBinding` - Two-way data binding for form components
- `useDispatchAction` - Dispatches actions from interactive components
- `useSurface` - Gets a Surface by ID

### Package Exports

```javascript
import { v0_8 } from '@elevo-cn/a2ui-react'       // Main export
import { ... } from '@elevo-cn/a2ui-react/0.8'    // Core module
import { ... } from '@elevo-cn/a2ui-react/ui'     // UI components
```

## Schemas

JSON schemas defining the A2UI protocol:

- `src/0.8/schemas/client_to_server.json` - Message format from client
- `src/0.8/schemas/server_to_client.json` - Message format from server
- `src/0.8/schemas/standard_catalog_definition.json` - Component catalog

## Testing

Tests are co-located with source files (`*.test.tsx`). Uses Vitest with React Testing Library and jsdom environment.
