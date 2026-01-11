# Contributing to A2UI React

Thank you for your interest in contributing to `@easyops-cn/a2ui-react`!

## Project Overview

A2UI React Renderer Library - A React implementation for rendering A2UI protocol. This is a library package that downstream developers consume.

## Monorepo Structure

This is an npm workspaces monorepo:

- Root package: `@easyops-cn/a2ui-react` - The main library
- `website/` - Documentation site using plain-blog
- `playground/` - Live demo workspace for real-time A2UI rendering development

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

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

## Key Directories

- `src/0.8/contexts/` - React context providers (Surface, DataModel, Action)
- `src/0.8/hooks/` - Custom hooks for data binding and actions
- `src/0.8/components/` - Component implementations (display/, layout/, interactive/)
- `src/0.8/schemas/` - JSON schemas for A2UI protocol
- `src/components/ui/` - shadcn/ui primitives

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
