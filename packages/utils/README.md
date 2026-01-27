# @a2ui-sdk/utils

Utility functions for working with A2UI protocol. This package provides helpers for data binding resolution, path manipulation, string interpolation, and validation.

## Installation

```bash
npm install @a2ui-sdk/utils
```

## Usage

### v0.9 (Latest)

```tsx
import {
  // String interpolation
  hasInterpolation,
  interpolate,

  // Data binding utilities
  resolveValue,
  resolveStringValue,
  resolveNumberValue,
  resolveBooleanValue,
  isPathBinding,

  // Path utilities
  parsePath,
  joinPath,
  getValueAtPath,
  setValueAtPath,

  // Validation utilities
  evaluateCheckRule,
  validateChecks,
} from '@a2ui-sdk/utils/0.9'
```

### v0.8

```tsx
import {
  // Data binding utilities
  resolveValue,
  resolveActionContext,
  resolveStringValue,
  resolveNumberValue,
  resolveBooleanValue,
  isPathBinding,

  // Path utilities
  normalizePath,
  isAbsolutePath,
  joinPaths,
  resolvePath,
  parsePath,
  joinPath,
  getValueAtPath,
  setValueAtPath,
} from '@a2ui-sdk/utils/0.8'
```

### Namespace Import

```tsx
import { v0_8, v0_9 } from '@a2ui-sdk/utils'

// Use v0.9 utilities
const { interpolate, hasInterpolation } = v0_9
```

## API

### Scope and Path Resolution (v0.8+)

Work with scoped data paths:

```tsx
import {
  normalizePath,
  isAbsolutePath,
  joinPaths,
  resolvePath,
} from '@a2ui-sdk/utils/0.8'

// Normalize path format
normalizePath('user/name') // '/user/name'
normalizePath('/items/') // '/items'

// Check if path is absolute
isAbsolutePath('/user/name') // true
isAbsolutePath('name') // false

// Join base path with relative path
joinPaths('/items/0', 'name') // '/items/0/name'
joinPaths('/items', '../users') // '/users'

// Resolve path with scope
resolvePath('/user/name', '/items/0') // '/user/name' (absolute, ignores basePath)
resolvePath('name', '/items/0') // '/items/0/name' (relative, uses basePath)
resolvePath('name', null) // '/name' (treats relative as absolute when no basePath)
```

### String Interpolation (v0.9)

Process strings with embedded expressions:

```tsx
import { hasInterpolation, interpolate } from '@a2ui-sdk/utils/0.9'

// Check if string contains interpolation
hasInterpolation('Hello {{name}}') // true
hasInterpolation('Hello world') // false

// Interpolate string with data
const data = { name: 'Alice', count: 5 }
interpolate('Hello {{name}}, you have {{count}} items', data)
// => 'Hello Alice, you have 5 items'
```

### Data Binding

Resolve dynamic values from the data model:

```tsx
import { resolveValue, isPathBinding } from '@a2ui-sdk/utils/0.9'

const dataModel = { user: { name: 'Alice' } }

// Check if value is a path binding
isPathBinding({ path: '/user/name' }) // true
isPathBinding('static value') // false

// Resolve value
resolveValue({ path: '/user/name' }, dataModel) // 'Alice'
resolveValue('static value', dataModel) // 'static value'
```

`resolveValue` also supports scoped path resolution:

```tsx
import { resolveValue } from '@a2ui-sdk/utils/0.9'

const dataModel = { items: [{ name: 'Item 1' }, { name: 'Item 2' }] }

// Resolve with basePath for scoped data access
resolveValue({ path: 'name' }, dataModel, '/items/0') // 'Item 1'
resolveValue({ path: '/items/1/name' }, dataModel, '/items/0') // 'Item 2' (absolute path ignores basePath)
```

### Path Utilities

Work with JSON Pointer paths (RFC 6901):

```tsx
import {
  parsePath,
  joinPath,
  getValueAtPath,
  setValueAtPath,
} from '@a2ui-sdk/utils/0.9'

// Parse path into segments
parsePath('/user/profile/name') // ['user', 'profile', 'name']

// Join segments into path
joinPath(['user', 'profile', 'name']) // '/user/profile/name'

// Get value at path
const data = { user: { profile: { name: 'Alice' } } }
getValueAtPath(data, '/user/profile/name') // 'Alice'

// Set value at path (immutable)
const newData = setValueAtPath(data, '/user/profile/name', 'Bob')
// data is unchanged, newData has the update
```

### Validation (v0.9)

Evaluate validation rules:

```tsx
import { evaluateCheckRule, validateChecks } from '@a2ui-sdk/utils/0.9'

const checks = [
  {
    message: 'Name is required',
    call: 'isNotEmpty',
    args: { value: { path: '/form/name' } },
  },
]

const dataModel = { form: { name: '' } }
const result = validateChecks(checks, dataModel)
// { valid: false, errors: ['Name is required'] }
```

## License

Apache-2.0
