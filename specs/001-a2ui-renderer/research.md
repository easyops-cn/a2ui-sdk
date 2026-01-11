# Research: A2UIRenderer Component Library

**Date**: 2026-01-10
**Feature**: 001-a2ui-renderer

## Overview

This document captures research findings for implementing the A2UIRender component and public API exports.

## Decision 1: A2UIRender Component Architecture

**Decision**: Compose A2UIRender as a thin wrapper around existing infrastructure

**Rationale**:

- The existing `A2UIProvider` already combines all necessary context providers
- The existing `useA2UIMessageHandler` hook handles message processing
- The existing `ComponentRenderer` handles component routing
- A2UIRender only needs to:
  1. Accept `messages`, `onAction`, and optional `components` props
  2. Wrap children in A2UIProvider
  3. Process messages and render surfaces

**Alternatives considered**:

- Rewrite from scratch: Rejected - would duplicate existing tested code
- Extend A2UIProvider: Rejected - A2UIProvider is a context provider, not a renderer

## Decision 2: ComponentsMap Implementation

**Decision**: Use React Context to pass custom components to ComponentRenderer

**Rationale**:

- The README.md shows `components` prop as `Map<string, React.ComponentType<any>>`
- ComponentRenderer already has a `componentRegistry` object
- Need to merge custom components with defaults at render time
- Context allows deep component tree access without prop drilling

**Alternatives considered**:

- Global registry mutation: Rejected - not React-friendly, causes side effects
- Prop drilling: Rejected - would require changes to all container components
- Module-level configuration: Rejected - not compatible with multiple A2UIRender instances

## Decision 3: Unknown Component Handling

**Decision**: Use `process.env.NODE_ENV` to switch between dev placeholder and production skip

**Rationale**:

- Spec requires: "Render placeholder in development, skip in production"
- Standard React pattern for dev-only features
- Vite/bundlers automatically replace `process.env.NODE_ENV`
- No runtime overhead in production builds

**Alternatives considered**:

- Runtime configuration prop: Rejected - adds API complexity
- Always show placeholder: Rejected - spec requires production skip
- Always skip: Rejected - spec requires dev visibility

## Decision 4: Export Structure for Versioned Path

**Decision**: Create `src/0.8/index.ts` as the entry point for `@easyops-cn/a2ui-react/0.8`

**Rationale**:

- package.json already defines: `"./0.8": { "default": "./dist/src/0.8/index.js" }`
- Single file makes it clear what's public API
- Re-exports from internal modules maintain encapsulation
- Matches README.md import pattern

**Alternatives considered**:

- index.ts in 0.8 folder: Rejected - index.ts is already configured in package.json
- Barrel exports from each module: Rejected - harder to control public surface

## Decision 5: Surface Rendering Strategy

**Decision**: Render all surfaces from the surfaces Map, each with its root component

**Rationale**:

- Messages can create multiple surfaces
- Each surface has its own `root` component ID
- SurfaceContext already maintains `Map<string, Surface>`
- A2UIRender should render all active surfaces

**Alternatives considered**:

- Single surface only: Rejected - A2UI protocol supports multiple surfaces
- Surface selection prop: Could be added later if needed

## Technical Findings

### Existing Hook Signatures (from codebase)

```typescript
// useDataBinding - matches spec FR-012
function useDataBinding<T>(
  surfaceId: string,
  source: ValueSource | undefined,
  defaultValue?: T
): T

// useFormBinding - matches spec FR-013
function useFormBinding<T>(
  surfaceId: string,
  source: ValueSource | undefined,
  defaultValue?: T
): [T, (value: T) => void]

// useDispatchAction - matches spec FR-011
function useDispatchAction(): (
  surfaceId: string,
  componentId: string,
  action: Action
) => void
```

### Type Exports Required (from spec)

- `A2UIMessage` - ✅ exists in types/index.ts
- `A2UIAction` - ❌ needs alias (currently `ActionPayload`)
- `A2UIRender` - ❌ needs implementation
- `ComponentRenderer` - ✅ exists
- `useDispatchAction` - ✅ exists
- `useDataBinding` - ✅ exists
- `useFormBinding` - ✅ exists

### API Alignment with README.md

The README.md shows:

```tsx
import { A2UIRender, A2UIMessage, A2UIAction } from '@easyops-cn/a2ui-react/0.8'
```

Current types use `ActionPayload` instead of `A2UIAction`. The index.ts should export `ActionPayload as A2UIAction` for API consistency.
