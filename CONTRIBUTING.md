# Contributing to A2UI SDK

Thank you for your interest in contributing to A2UI SDK!

## Project Overview

A2UI SDK - SDK for integrating with A2UI protocol. This is a set of library packages that downstream developers consume.

## Monorepo Structure

This is an npm workspaces monorepo:

- `packages/react` - `@a2ui-sdk/react` - React implementation for rendering A2UI protocol
- `packages/types` - `@a2ui-sdk/types` - TypeScript type definitions for A2UI protocol
- `packages/utils` - `@a2ui-sdk/utils` - Utility functions for A2UI
- `website/` - Documentation site using plain-blog
- `playground/` - Live demo workspace for real-time A2UI rendering development

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

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

## Key Directories

- `packages/react/src/0.8/` - A2UI v0.8 React implementation
- `packages/react/src/0.9/` - A2UI v0.9 React implementation
- `packages/react/src/components/ui/` - shadcn/ui primitives
- `packages/types/src/` - TypeScript type definitions
- `packages/utils/src/` - Utility functions (interpolation, etc.)

## Testing

Tests are co-located with source files (`*.test.tsx`). Uses Vitest + React Testing Library + jsdom.

Run tests before submitting:

```bash
npm run test:run
```

## Code Style

Run linting before submitting:

```bash
npm run lint
```

To auto-fix issues:

```bash
npm run lint:fix
```

## Technologies

- TypeScript 5.9
- React 19
- Radix UI (for UI primitives)
- Tailwind CSS (via class-variance-authority)

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request
