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
  resolveStringValue,
  resolveNumberValue,
  resolveBooleanValue,
  isPathBinding,

  // Path utilities
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
