# Data Model: A2UIRenderer Component Library

**Date**: 2026-01-10
**Feature**: 001-a2ui-renderer

## Overview

This document describes the data model for the A2UI React renderer. The types are already defined in `src/0.8/types/index.ts`.

## Core Entities

### A2UIMessage

The primary input to the renderer. Messages are processed to build surfaces and data models.

```
A2UIMessage
├── beginRendering?: BeginRenderingPayload
│   ├── surfaceId: string (required)
│   ├── root: string (required) - root component ID
│   ├── catalogId?: string
│   └── styles?: SurfaceStyles
├── surfaceUpdate?: SurfaceUpdatePayload
│   ├── surfaceId: string (required)
│   └── components: ComponentDefinition[] (required)
├── dataModelUpdate?: DataModelUpdatePayload
│   ├── surfaceId: string (required)
│   ├── path?: string (default: "/")
│   └── contents: DataEntry[] (required)
└── deleteSurface?: DeleteSurfacePayload
    └── surfaceId: string (required)
```

### Surface

Runtime representation of a renderable UI surface.

```
Surface
├── surfaceId: string (required) - unique identifier
├── root: string (required) - root component ID
├── components: Map<string, ComponentDefinition> (required)
└── styles?: SurfaceStyles
    ├── font?: string
    └── primaryColor?: string
```

### ComponentDefinition

Definition of a single UI component.

```
ComponentDefinition
├── id: string (required) - unique within surface
├── weight?: number - for ordering siblings
└── component: { [type: string]: ComponentProps }
    └── [type]: Record<string, unknown>
```

### DataModel

Hierarchical key-value store for dynamic data.

```
DataModel
└── [key: string]: DataModelValue
    where DataModelValue = string | number | boolean | DataModel | unknown[]
```

### Action / ActionPayload

User interaction events.

```
Action (input from component definition)
├── name: string (required)
└── context?: ActionContextItem[]
    ├── key: string
    └── value: ValueSource

ActionPayload (output to onAction callback)
├── surfaceId: string (required)
├── name: string (required)
├── context: Record<string, unknown> (resolved values)
└── sourceComponentId: string (required)
```

### ValueSource

Reference to data - either literal or path-based.

```
ValueSource (discriminated union)
├── { literalString: string }
├── { literalNumber: number }
├── { literalBoolean: boolean }
├── { literalArray: string[] }
└── { path: string } - reference to DataModel path
```

## Entity Relationships

```
┌─────────────────┐
│   A2UIMessage   │
└────────┬────────┘
         │ processes
         ▼
┌─────────────────┐     contains      ┌─────────────────────┐
│     Surface     │◄─────────────────►│ ComponentDefinition │
└────────┬────────┘                   └──────────┬──────────┘
         │                                       │
         │ references                            │ may contain
         ▼                                       ▼
┌─────────────────┐                   ┌─────────────────────┐
│    DataModel    │◄──────────────────│       Action        │
└─────────────────┘    resolves       └──────────┬──────────┘
                       context                   │
                                                 │ dispatches
                                                 ▼
                                      ┌─────────────────────┐
                                      │    ActionPayload    │
                                      └─────────────────────┘
```

## State Management

| State          | Provider          | Access Hook                                         |
| -------------- | ----------------- | --------------------------------------------------- |
| Surfaces       | SurfaceProvider   | useSurfaceContext, useSurface                       |
| Data Models    | DataModelProvider | useDataModelContext, useDataBinding, useFormBinding |
| Action Handler | ActionProvider    | useActionContext, useDispatchAction                 |

## Validation Rules

1. **surfaceId**: Must be unique across all surfaces
2. **componentId**: Must be unique within a surface
3. **root**: Must reference a valid componentId in the surface
4. **path**: Must start with "/" for DataModel references
5. **ValueSource**: Exactly one variant must be set
