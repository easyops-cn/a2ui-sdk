# Research: String Interpolation Parser

**Feature**: 004-string-interpolation-parser
**Date**: 2026-01-13

## Research Questions

1. What is the grammar for the interpolation expression language?
2. What parser pattern best fits this grammar?
3. How should AST nodes be structured for efficient evaluation?
4. How to handle error recovery gracefully?

---

## 1. Grammar Definition

### Decision: EBNF Grammar for Interpolation Expressions

Based on the A2UI 0.9 protocol specification and RFC 6901 (JSON Pointer), the grammar is:

```ebnf
interpolated_string  = { text_segment | expression }
text_segment         = ( CHAR - "${" | "\${" )+
expression           = "${" expr "}"

expr                 = function_call | json_pointer

function_call        = IDENTIFIER "(" [ arg_list ] ")"
arg_list             = argument { "," argument }
argument             = string_literal | number_literal | boolean_literal | expression

(* JSON Pointer per RFC 6901 *)
json_pointer         = absolute_pointer | relative_pointer
absolute_pointer     = "/" reference_token { "/" reference_token }
relative_pointer     = reference_token { "/" reference_token }

(* Reference token with escape sequences: ~0 → ~, ~1 → / *)
reference_token      = { unescaped | escaped }
unescaped            = CHAR - ( "/" | "~" | "}" | "(" | ")" | "," | "'" | WHITESPACE )
escaped              = "~" ( "0" | "1" )
                       (* ~0 decodes to ~, ~1 decodes to / *)

string_literal       = "'" { CHAR - "'" | "\\'" } "'"
number_literal       = [ "-" ] DIGIT+ [ "." DIGIT+ ]
boolean_literal      = "true" | "false"

IDENTIFIER           = LETTER { LETTER | DIGIT | "_" }
```

### JSON Pointer Escape Sequences (RFC 6901)

Per RFC 6901, JSON Pointer uses `~` as the escape character:

- `~0` → `~` (tilde)
- `~1` → `/` (forward slash)

**Examples**:
| JSON Pointer | Decoded Path | Description |
|--------------|--------------|-------------|
| `/foo/bar` | `["foo", "bar"]` | Simple path |
| `/a~1b` | `["a/b"]` | Escaped forward slash |
| `/m~0n` | `["m~n"]` | Escaped tilde |
| `/a~1b~0c` | `["a/b~c"]` | Multiple escapes |
| `name` | `["name"]` | Relative path (no leading `/`) |

**Implementation Note**: The lexer will tokenize the raw path string including escape sequences. The evaluator will decode `~0` → `~` and `~1` → `/` when resolving paths against the data model.

### Rationale

- The grammar is LL(1) parseable - each production can be determined by looking at one token ahead
- Function calls are distinguished by `(` after identifier
- Paths are distinguished by starting with `/` (absolute) or being an identifier without `(`
- Nesting is handled naturally through the recursive `expression` production in `argument`
- JSON Pointer escape sequences allow referencing keys containing `/` or `~` characters

### Alternatives Considered

1. **Parser generators (PEG.js, nearley)**: Rejected - adds bundle size, overkill for this simple grammar
2. **Regex with capture groups**: Current approach - cannot handle nesting or function calls
3. **State machine**: More complex than recursive descent for this grammar
4. **Custom escape syntax**: Rejected - RFC 6901 is the standard for JSON Pointer

---

## 2. Parser Pattern

### Decision: Hand-written Recursive Descent Parser

A recursive descent parser is the best fit because:

1. **Grammar is LL(1)**: No backtracking needed
2. **Simple implementation**: Each grammar rule becomes a function
3. **Good error messages**: Can report position and expected tokens
4. **No dependencies**: Zero bundle size impact
5. **Easy to extend**: Adding new expression types is straightforward

### Implementation Structure

```typescript
// Lexer: string → Token[]
function tokenize(input: string): Token[]

// Parser: Token[] → AST
function parse(tokens: Token[]): ASTNode

// Evaluator: AST × Context → string
function evaluate(ast: ASTNode, context: EvaluationContext): string
```

### Rationale

- Separation of concerns makes testing easier
- Each phase can be independently optimized
- Lexer can handle escape sequences at the character level
- Parser focuses purely on structure
- Evaluator handles runtime resolution

### Alternatives Considered

1. **Single-pass parser+evaluator**: Harder to test, can't extract dependencies without re-parsing
2. **Pratt parser**: Overkill - no operator precedence needed in this grammar
3. **Parser combinator library**: Adds dependency, harder to debug

---

## 3. AST Node Structure

### Decision: Discriminated Union Types

```typescript
type ASTNode =
  | { type: 'literal'; value: string }
  | { type: 'path'; path: string; absolute: boolean }
  | { type: 'functionCall'; name: string; args: ASTNode[] }
  | { type: 'interpolatedString'; parts: ASTNode[] }
```

### Rationale

- TypeScript discriminated unions provide exhaustive checking
- Simple to serialize if needed for debugging
- Each node type is self-contained
- `interpolatedString` as root allows mixed literal/expression content

### Alternatives Considered

1. **Class hierarchy**: More verbose, no real benefit for this use case
2. **Generic node with kind field**: Less type-safe
3. **Visitor pattern**: Overkill for single evaluation use case

---

## 4. Error Handling Strategy

### Decision: Graceful Degradation with Warnings

Per spec requirement FR-008:

- Syntax errors return empty string for the affected expression
- A warning is logged to console
- Parsing continues for remaining expressions in the string

### Implementation

```typescript
interface ParseResult {
  ast: ASTNode | null
  errors: ParseError[]
}

interface ParseError {
  message: string
  position: number
  length: number
}
```

### Rationale

- UI should not break due to malformed expressions
- Warnings help developers debug issues
- Partial success is better than complete failure
- Position info enables helpful error messages

### Alternatives Considered

1. **Throw exceptions**: Would break rendering - rejected
2. **Silent failure**: Too hard to debug - rejected
3. **Return error placeholder text**: Confusing for users - rejected

---

## 5. Token Types

### Decision: Minimal Token Set

```typescript
enum TokenType {
  TEXT = 'TEXT', // Literal text outside expressions
  EXPR_START = 'EXPR_START', // ${
  EXPR_END = 'EXPR_END', // }
  PATH = 'PATH', // /foo/bar or foo/bar
  IDENTIFIER = 'IDENTIFIER', // function names
  LPAREN = 'LPAREN', // (
  RPAREN = 'RPAREN', // )
  COMMA = 'COMMA', // ,
  STRING = 'STRING', // 'quoted string'
  NUMBER = 'NUMBER', // 42, 3.14, -5
  BOOLEAN = 'BOOLEAN', // true, false
  EOF = 'EOF',
}
```

### Rationale

- Minimal set that covers all grammar productions
- PATH token combines absolute/relative - parser distinguishes by leading `/`
- IDENTIFIER used for function names only (paths are separate token)

---

## 6. Performance Considerations

### Decision: Parse Once, Evaluate Many

For reactive updates where the same template is evaluated with different data:

1. Parse the template once to get AST
2. Cache the AST keyed by template string
3. Re-evaluate AST with new data model

### Implementation Note

The `parseInterpolation` function returns the AST, allowing callers to cache if needed. The `interpolate` function handles the common case of parse+evaluate in one call.

### Rationale

- Most templates are static (don't change at runtime)
- Data model changes frequently (user input, server updates)
- Caching reduces CPU usage for reactive scenarios

---

## 7. Integration with Existing Code

### Decision: Replace interpolation.ts with interpolation/ module

Current consumers:

- `dataBinding.ts`: imports `hasInterpolation`, `interpolate` from `./interpolation`
- `dataBinding.ts`: re-exports `hasInterpolation`

Changes needed:

1. Create `src/0.9/utils/interpolation/` directory
2. Move logic into lexer.ts, parser.ts, evaluator.ts, types.ts
3. Create index.ts exporting `parseInterpolation` and `interpolate`
4. Update `dataBinding.ts` to import from `./interpolation` (path stays same)
5. Remove `hasInterpolation` and `getInterpolationDependencies` from public API
6. Delete old `interpolation.ts` file

### Rationale

- Import paths remain unchanged for consumers
- Internal refactoring is transparent
- API simplification per spec FR-009

---

## Summary

| Topic       | Decision                        | Key Rationale              |
| ----------- | ------------------------------- | -------------------------- |
| Grammar     | EBNF with LL(1) properties      | Simple, no ambiguity       |
| Parser      | Recursive descent               | Matches grammar, zero deps |
| AST         | Discriminated union types       | Type-safe, simple          |
| Errors      | Graceful degradation + warnings | UI stability               |
| Tokens      | 11 token types                  | Minimal coverage           |
| Performance | Parse once, evaluate many       | Reactive optimization      |
| Integration | Replace file with module        | Transparent refactor       |
