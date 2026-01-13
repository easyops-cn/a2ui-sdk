# Quickstart: String Interpolation Parser

**Feature**: 004-string-interpolation-parser
**Date**: 2026-01-13

## Overview

This guide provides a quick reference for using the refactored string interpolation module in A2UI 0.9.

---

## Installation

The interpolation module is part of `@easyops-cn/a2ui-react`. No additional installation required.

---

## Basic Usage

### Simple Path Interpolation

```typescript
import { interpolate } from '@easyops-cn/a2ui-react/0.9'

const dataModel = {
  user: { name: 'John', age: 30 },
}

// Absolute path
interpolate('Hello, ${/user/name}!', dataModel)
// → "Hello, John!"

// Multiple expressions
interpolate('${/user/name} is ${/user/age} years old', dataModel)
// → "John is 30 years old"
```

### Relative Paths (Collection Scope)

```typescript
const dataModel = {
  users: [{ name: 'Alice' }, { name: 'Bob' }],
}

// With base path for collection iteration
interpolate('Name: ${name}', dataModel, '/users/0')
// → "Name: Alice"

interpolate('Name: ${name}', dataModel, '/users/1')
// → "Name: Bob"
```

### JSON Pointer Escape Sequences (RFC 6901)

When data model keys contain `/` or `~`, use JSON Pointer escape sequences:

- `~1` → `/` (forward slash)
- `~0` → `~` (tilde)

```typescript
const dataModel = {
  'a/b': 'slash-key', // Key contains /
  'm~n': 'tilde-key', // Key contains ~
  'x/y~z': 'mixed-key', // Key contains both
}

// Reference key containing /
interpolate('${/a~1b}', dataModel)
// → "slash-key"

// Reference key containing ~
interpolate('${/m~0n}', dataModel)
// → "tilde-key"

// Reference key containing both
interpolate('${/x~1y~0z}', dataModel)
// → "mixed-key"
```

### Function Calls

```typescript
// No-argument function
interpolate('Current time: ${now()}', {})
// → "Current time: 2026-01-13T10:30:00.000Z"

// Function with literal arguments
interpolate('Sum: ${add(5, 3)}', {})
// → "Sum: 8"

// Function with path arguments (nested expression)
const dataModel = { timestamp: '2026-01-13T00:00:00Z' }
interpolate("Date: ${formatDate(${/timestamp}, 'yyyy-MM-dd')}", dataModel)
// → "Date: 2026-01-13"
```

### Nested Expressions

```typescript
const dataModel = { name: 'john', price: 100, tax: 15 }

// Function with path argument
interpolate('${upper(${/name})}', dataModel)
// → "JOHN"

// Chained functions
interpolate('Total: ${formatCurrency(${add(${/price}, ${/tax})})}', dataModel)
// → "Total: $115.00"
```

### Escaped Expressions

```typescript
// Use \${ to output literal ${
interpolate('Template: \\${variable}', {})
// → "Template: ${variable}"

// Mixed escaped and evaluated
interpolate('\\${escaped} and ${/actual}', { actual: 'evaluated' })
// → "${escaped} and evaluated"
```

---

## Parsing Without Evaluation

Use `parseInterpolation` to get the AST without evaluating:

```typescript
import { parseInterpolation } from '@easyops-cn/a2ui-react/0.9'

const ast = parseInterpolation('Hello, ${/name}!')
// Returns:
// {
//   type: 'interpolatedString',
//   parts: [
//     { type: 'literal', value: 'Hello, ' },
//     { type: 'path', path: '/name', absolute: true },
//     { type: 'literal', value: '!' }
//   ]
// }
```

### Extracting Dependencies

To get all data model paths referenced in a template:

```typescript
function getDependencies(ast: InterpolatedStringNode): string[] {
  const paths: string[] = []

  function visit(node: ASTNode) {
    if (node.type === 'path') {
      paths.push(node.path)
    } else if (node.type === 'functionCall') {
      node.args.forEach(visit)
    } else if (node.type === 'interpolatedString') {
      node.parts.forEach(visit)
    }
  }

  ast.parts.forEach(visit)
  return paths
}

const ast = parseInterpolation('${/user/name} - ${/user/email}')
getDependencies(ast)
// → ['/user/name', '/user/email']
```

---

## Custom Functions

Register custom functions by passing a function registry:

```typescript
const customFunctions = {
  greet: (name: string) => `Hello, ${name}!`,
  multiply: (a: number, b: number) => a * b,
}

interpolate(
  '${greet(${/name})} Result: ${multiply(${/x}, ${/y})}',
  { name: 'World', x: 6, y: 7 },
  null,
  customFunctions
)
// → "Hello, World! Result: 42"
```

---

## Error Handling

Malformed expressions return empty string and log warnings:

```typescript
// Unclosed expression
interpolate('Hello ${/name', { name: 'John' })
// Console: [A2UI] Parse error: Expected '}' at position 12
// → "Hello "

// Unknown function
interpolate('${unknownFunc()}', {})
// Console: [A2UI] Unknown function: unknownFunc
// → ""

// Missing path
interpolate('Value: ${/nonexistent}', {})
// → "Value: "  (no warning, this is normal)
```

---

## Type Coercion

Non-string values are converted automatically:

| Value Type  | Conversion                                    |
| ----------- | --------------------------------------------- |
| `number`    | `String(value)` → `"42"`                      |
| `boolean`   | `String(value)` → `"true"` or `"false"`       |
| `null`      | Empty string `""`                             |
| `undefined` | Empty string `""`                             |
| `object`    | `JSON.stringify(value)` → `'{"key":"value"}'` |
| `array`     | `JSON.stringify(value)` → `'["a","b"]'`       |

---

## Migration from Previous API

### Removed Functions

The following functions have been removed from the public API:

| Old Function                                  | Migration                                                                  |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| `hasInterpolation(str)`                       | Use `parseInterpolation(str).parts.length > 1` or check for `${` in string |
| `getInterpolationDependencies(str, basePath)` | Use `parseInterpolation(str)` and traverse AST to collect paths            |

### API Changes

```typescript
// Before (0.8 style)
import {
  hasInterpolation,
  interpolate,
  getInterpolationDependencies,
} from '...'

if (hasInterpolation(template)) {
  const deps = getInterpolationDependencies(template, basePath)
  const result = interpolate(template, dataModel, basePath)
}

// After (0.9 refactored)
import { parseInterpolation, interpolate } from '...'

const ast = parseInterpolation(template)
const deps = extractPathsFromAST(ast, basePath) // custom helper
const result = interpolate(template, dataModel, basePath)
```

---

## Performance Tips

1. **Cache parsed ASTs** for templates that are evaluated multiple times with different data
2. **Avoid deep nesting** - keep expression depth under 5 levels for best performance
3. **Use absolute paths** when possible - relative path resolution adds overhead

---

## Troubleshooting

### Expression not evaluating

- Check for typos in path (case-sensitive)
- Verify the path exists in the data model
- Check console for parse warnings

### Unexpected output

- Use `parseInterpolation` to inspect the AST
- Check if special characters need escaping

### Keys containing `/` or `~` not resolving

- Use JSON Pointer escape sequences: `~1` for `/`, `~0` for `~`
- Example: key `"a/b"` → path `/a~1b`
- Example: key `"m~n"` → path `/m~0n`
- Decoding order matters: `~1` is decoded before `~0`

### Performance issues

- Profile with `parseInterpolation` to separate parse vs evaluate time
- Consider caching ASTs for repeated evaluations
