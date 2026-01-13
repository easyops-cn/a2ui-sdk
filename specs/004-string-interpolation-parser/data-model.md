# Data Model: String Interpolation Parser

**Feature**: 004-string-interpolation-parser
**Date**: 2026-01-13

## Overview

This document defines the data structures used by the string interpolation parser, including tokens, AST nodes, and evaluation context.

---

## 1. Token Types

Tokens are the output of the lexer (tokenizer). Each token represents a meaningful unit in the input string.

### TokenType Enum

```typescript
enum TokenType {
  // Literal text outside ${...}
  TEXT = 'TEXT',

  // Expression delimiters
  EXPR_START = 'EXPR_START', // ${
  EXPR_END = 'EXPR_END', // }

  // Path expressions
  PATH = 'PATH', // /foo/bar or foo/bar

  // Function call components
  IDENTIFIER = 'IDENTIFIER', // function name
  LPAREN = 'LPAREN', // (
  RPAREN = 'RPAREN', // )
  COMMA = 'COMMA', // ,

  // Literals (function arguments)
  STRING = 'STRING', // 'single quoted'
  NUMBER = 'NUMBER', // 42, -3.14
  BOOLEAN = 'BOOLEAN', // true, false

  // End of input
  EOF = 'EOF',
}
```

### Token Structure

```typescript
interface Token {
  type: TokenType
  value: string // Raw text value
  start: number // Start position in input
  end: number // End position in input
}
```

### Token Examples

| Input                   | Tokens                                                                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `Hello`                 | `[{TEXT, "Hello"}]`                                                                                                                      |
| `${/name}`              | `[{EXPR_START, "${"}, {PATH, "/name"}, {EXPR_END, "}"}]`                                                                                 |
| `${now()}`              | `[{EXPR_START, "${"}, {IDENTIFIER, "now"}, {LPAREN, "("}, {RPAREN, ")"}, {EXPR_END, "}"}]`                                               |
| `${format(${/x}, 'y')}` | `[{EXPR_START}, {IDENTIFIER, "format"}, {LPAREN}, {EXPR_START}, {PATH, "/x"}, {EXPR_END}, {COMMA}, {STRING, "y"}, {RPAREN}, {EXPR_END}]` |

---

## 2. AST Node Types

The Abstract Syntax Tree represents the parsed structure of an interpolated string.

### Node Type Discriminated Union

```typescript
type ASTNode =
  | LiteralNode
  | PathNode
  | FunctionCallNode
  | InterpolatedStringNode
```

### LiteralNode

Represents static text that appears outside `${...}` expressions.

```typescript
interface LiteralNode {
  type: 'literal'
  value: string
}
```

**Examples**:

- `"Hello, "` → `{ type: 'literal', value: 'Hello, ' }`
- `"!"` → `{ type: 'literal', value: '!' }`

### PathNode

Represents a JSON Pointer (RFC 6901) path reference to the data model.

```typescript
interface PathNode {
  type: 'path'
  path: string // The raw path string (may contain ~0, ~1 escape sequences)
  absolute: boolean // true if starts with '/'
}
```

**JSON Pointer Escape Sequences (RFC 6901)**:

- `~0` decodes to `~` (tilde)
- `~1` decodes to `/` (forward slash)

**Examples**:

- `${/user/name}` → `{ type: 'path', path: '/user/name', absolute: true }`
- `${name}` → `{ type: 'path', path: 'name', absolute: false }`
- `${/a~1b}` → `{ type: 'path', path: '/a~1b', absolute: true }` (references key `"a/b"`)
- `${/m~0n}` → `{ type: 'path', path: '/m~0n', absolute: true }` (references key `"m~n"`)

### FunctionCallNode

Represents a client-side function invocation with arguments.

```typescript
interface FunctionCallNode {
  type: 'functionCall'
  name: string // Function name (identifier)
  args: ASTNode[] // Arguments (can be literals, paths, or nested function calls)
}
```

**Examples**:

- `${now()}` → `{ type: 'functionCall', name: 'now', args: [] }`
- `${add(1, 2)}` → `{ type: 'functionCall', name: 'add', args: [{type:'literal',value:'1'}, {type:'literal',value:'2'}] }`
- `${upper(${/name})}` → `{ type: 'functionCall', name: 'upper', args: [{type:'path',path:'/name',absolute:true}] }`

### InterpolatedStringNode

Root node representing a complete interpolated string with mixed content.

```typescript
interface InterpolatedStringNode {
  type: 'interpolatedString'
  parts: ASTNode[] // Sequence of literals and expressions
}
```

**Examples**:

- `"Hello, ${/name}!"` →
  ```typescript
  {
    type: 'interpolatedString',
    parts: [
      { type: 'literal', value: 'Hello, ' },
      { type: 'path', path: '/name', absolute: true },
      { type: 'literal', value: '!' }
    ]
  }
  ```

---

## 3. Parse Result

The parser returns a result object that includes both the AST and any errors encountered.

```typescript
interface ParseResult {
  ast: InterpolatedStringNode
  errors: ParseError[]
}

interface ParseError {
  message: string // Human-readable error description
  position: number // Character position in input
  length: number // Length of problematic text
}
```

**Error Examples**:

- `"${unclosed"` → `{ message: "Expected '}' to close expression", position: 2, length: 8 }`
- `"${func(}"` → `{ message: "Expected argument or ')'", position: 7, length: 1 }`

---

## 4. Evaluation Context

The context provided to the evaluator for resolving paths and function calls.

```typescript
interface EvaluationContext {
  dataModel: DataModel // The data model for path resolution
  basePath: string | null // Base path for relative path resolution
  functions?: FunctionRegistry // Optional custom function registry
}

type DataModel = Record<string, unknown>

type FunctionRegistry = Record<string, InterpolationFunction>

type InterpolationFunction = (...args: unknown[]) => unknown
```

**Built-in Functions** (examples):

- `now()` → Returns current ISO timestamp
- `upper(str)` → Converts string to uppercase
- `lower(str)` → Converts string to lowercase
- `formatDate(date, format)` → Formats date string

---

## 5. Public API Types

### parseInterpolation

```typescript
function parseInterpolation(template: string): InterpolatedStringNode
```

Parses a template string and returns the AST. Errors are handled gracefully - malformed expressions become empty literals.

### interpolate

```typescript
function interpolate(
  template: string,
  dataModel: DataModel,
  basePath?: string | null,
  functions?: FunctionRegistry
): string
```

Parses and evaluates a template string, returning the interpolated result.

---

## 6. State Transitions

The lexer operates as a state machine with these states:

```
┌─────────┐     ${      ┌────────────┐
│  TEXT   │────────────▶│ EXPRESSION │
└─────────┘             └────────────┘
     ▲                        │
     │          }             │
     └────────────────────────┘
```

Within EXPRESSION state:

- See `/` → PATH mode
- See identifier + `(` → FUNCTION_CALL mode
- See `'` → STRING mode
- See digit/`-` → NUMBER mode
- See `true`/`false` → BOOLEAN

---

## 7. Entity Relationships

```
InterpolatedStringNode
        │
        │ parts[]
        ▼
   ┌────┴────┐
   │ ASTNode │ (discriminated union)
   └────┬────┘
        │
   ┌────┼────────────┬─────────────┐
   ▼    ▼            ▼             ▼
Literal Path    FunctionCall    (recursive)
                     │
                     │ args[]
                     ▼
                  ASTNode
```

---

## 8. Validation Rules

### Token-level

- `STRING`: Must have matching quotes, escapes must be valid
- `NUMBER`: Must be valid numeric format
- `PATH`: Must be valid JSON Pointer syntax per RFC 6901
  - `~` must be followed by `0` or `1` (invalid: `~2`, `~a`, trailing `~`)
  - Empty segments are allowed (`//` is valid)
- `IDENTIFIER`: Must start with letter, contain only alphanumeric + underscore

### AST-level

- `FunctionCallNode.args`: Each argument must be a valid expression
- Nesting depth: Maximum 10 levels to prevent stack overflow
- `InterpolatedStringNode.parts`: Must not be empty (at minimum contains one literal)

### Evaluation-level

- Path resolution:
  - Decode `~1` → `/` and `~0` → `~` before resolving against data model
  - Missing paths return `undefined` → empty string
- Function calls: Unknown functions return `undefined` → empty string with warning
- Type coercion: Non-string results converted via `String()` or `JSON.stringify()`

### JSON Pointer Decoding (RFC 6901)

The evaluator must decode escape sequences in this order:

1. Replace all `~1` with `/`
2. Replace all `~0` with `~`

**Important**: The order matters! Decoding `~0` first would incorrectly transform `~01` → `~1` → `/`.
