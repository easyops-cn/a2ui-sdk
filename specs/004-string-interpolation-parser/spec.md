# Feature Specification: String Interpolation Parser Refactoring

**Feature Branch**: `004-string-interpolation-parser`
**Created**: 2026-01-13
**Status**: Draft
**Input**: User description: "重构 v0.9 的 string interpolation 实现方式，因为其语法虽然复杂度不高、但包含函数调用和嵌套使用，使用正则解析有困难，改为词法分析->语法分析->执行语法树来实现"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Simple Path Interpolation (Priority: P1)

A downstream developer uses the A2UI renderer to display dynamic text with data model values. They bind a Text component's text property to a string containing simple path references like `"Hello, ${/user/name}!"`.

**Why this priority**: This is the most basic and common use case. Simple path interpolation must work correctly as it is the foundation of the data binding system. This functionality already exists and must continue to work after the refactoring.

**Independent Test**: Can be fully tested by rendering a Text component with a simple interpolation string and verifying the output displays the resolved data model value.

**Acceptance Scenarios**:

1. **Given** a data model with `/user/name` set to "John", **When** a Text component renders with text `"Hello, ${/user/name}!"`, **Then** the displayed text is "Hello, John!"
2. **Given** a data model with `/count` set to 42, **When** a Text component renders with text `"Count: ${/count}"`, **Then** the displayed text is "Count: 42"
3. **Given** a data model with `/items` set to `["a", "b", "c"]`, **When** a Text component renders with text `"Items: ${/items}"`, **Then** the displayed text is `"Items: [\"a\",\"b\",\"c\"]"` (JSON stringified)
4. **Given** a data model without the referenced path, **When** a Text component renders with text `"Missing: ${/nonexistent}"`, **Then** the displayed text is "Missing: " (empty string for undefined)

---

### User Story 2 - Function Call Interpolation (Priority: P1)

A downstream developer needs to display transformed or computed values using client-side functions. They use function call syntax within interpolation expressions, such as `"Current time: ${now()}"` or `"Formatted: ${formatDate(${/date}, 'yyyy-MM-dd')}"`.

**Why this priority**: Function calls are essential for data transformation and dynamic value computation. This is a core feature of v0.9 that cannot be achieved with simple path interpolation alone.

**Independent Test**: Can be fully tested by rendering a component with function call interpolation and verifying the function is invoked and result is displayed.

**Acceptance Scenarios**:

1. **Given** a registered function `now()` that returns the current timestamp, **When** a Text component renders with text `"Time: ${now()}"`, **Then** the displayed text contains the function's return value
2. **Given** a data model with `/timestamp` and a registered `formatDate` function, **When** a Text component renders with text `"Date: ${formatDate(${/timestamp}, 'yyyy-MM-dd')}"`, **Then** the displayed text shows the formatted date
3. **Given** literal arguments like `"Result: ${multiply(5, 3)}"`, **When** the component renders, **Then** the displayed text is "Result: 15"
4. **Given** an unknown function name, **When** interpolation attempts to resolve `"${unknownFunc()}"`, **Then** the expression evaluates to empty string and a warning is logged

---

### User Story 3 - Nested Expression Interpolation (Priority: P2)

A downstream developer needs to chain function calls or use data model values as function arguments. They use nested `${...}` syntax to compose expressions, such as `"${upper(${/name})}"` or `"${formatCurrency(${add(${/price}, ${/tax})})})"`.

**Why this priority**: Nested expressions enable advanced composition patterns. While less common than simple interpolation, they are necessary for complex UI requirements where computed values depend on multiple data sources.

**Independent Test**: Can be fully tested by rendering a component with nested interpolation and verifying the correct evaluation order and final result.

**Acceptance Scenarios**:

1. **Given** a data model with `/name` set to "john", **When** a Text component renders with text `"${upper(${/name})}"`, **Then** the displayed text is "JOHN"
2. **Given** `/a` set to 10 and `/b` set to 5, **When** rendering `"${add(${/a}, ${/b})}"`, **Then** the displayed text is "15"
3. **Given** deeply nested expressions `"${format(${transform(${/value})})}"`, **When** rendering, **Then** expressions are evaluated from innermost to outermost
4. **Given** a mix of nested and non-nested expressions in one string, **When** rendering `"${upper(${/name})} has ${/count} items"`, **Then** both expressions resolve correctly

---

### User Story 4 - Escaped Interpolation (Priority: P2)

A downstream developer needs to display literal `${...}` text without it being interpreted as an interpolation expression. They use the escape syntax `\${...}` to prevent interpolation.

**Why this priority**: Escape syntax is necessary for displaying code examples, templates, or any content that legitimately contains `${` characters. This is important for documentation and technical content display.

**Independent Test**: Can be fully tested by rendering a component with escaped syntax and verifying the literal characters are displayed.

**Acceptance Scenarios**:

1. **Given** text `"Escaped \\${/path}"`, **When** rendered, **Then** the displayed text is "Escaped ${/path}" (literal)
2. **Given** mixed escaped and unescaped `"\\${literal} and ${/actual}"` with `/actual` set to "value", **When** rendered, **Then** the displayed text is "${literal} and value"
3. **Given** multiple consecutive escapes `"\\${a} \\${b} \\${c}"`, **When** rendered, **Then** the displayed text is "${a} ${b} ${c}"

---

### User Story 5 - Relative Path Resolution (Priority: P2)

A downstream developer uses template components within a collection (List, Row with children template). Inside these templates, they use relative paths like `"${name}"` instead of absolute paths, which resolve relative to the current iteration's data scope.

**Why this priority**: Relative path resolution is essential for the template/iteration feature of ChildList. Without it, dynamic lists cannot properly bind to item-specific data.

**Independent Test**: Can be fully tested by rendering a List component with a template that uses relative path interpolation.

**Acceptance Scenarios**:

1. **Given** a base path of `/users/0` and data model with `/users/0/name` set to "Alice", **When** rendering `"${name}"` in that scope, **Then** the displayed text is "Alice"
2. **Given** a relative path and absolute path mixed `"${name} works at ${/company}"`, **When** rendered in scope `/users/0`, **Then** relative path resolves against base, absolute path resolves from root
3. **Given** a relative path with nested structure `"${profile/displayName}"` in scope `/users/0`, **When** rendered, **Then** resolves to `/users/0/profile/displayName`

---

### Edge Cases

- What happens when interpolation syntax is malformed (e.g., unclosed `${`, missing function arguments)?
  - The parser should gracefully handle errors, return empty string for the malformed expression, and log a warning
- What happens when function argument types don't match expected types?
  - Type coercion should be attempted where reasonable; if not possible, return empty string and log warning
- What happens with empty interpolation `"${}"` or whitespace-only `"${ }"`?
  - Should be treated as invalid, return empty string
- What happens with very deeply nested expressions (e.g., 10+ levels)?
  - Should be supported up to a reasonable depth; configurable maximum to prevent infinite recursion
- What happens when a function call has too many or too few arguments?
  - Log warning and either use defaults or return empty string based on function implementation

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST parse interpolation expressions using a lexer/tokenizer that identifies tokens: `LITERAL_TEXT`, `EXPR_START` (`${`), `EXPR_END` (`}`), `PATH` (JSON Pointer), `FUNCTION_NAME`, `OPEN_PAREN`, `CLOSE_PAREN`, `COMMA`, `STRING_LITERAL`, `NUMBER_LITERAL`, `BOOLEAN_LITERAL`, `ESCAPE_SEQUENCE` (`\${`)
- **FR-002**: System MUST build an Abstract Syntax Tree (AST) from the token stream that represents: literal text nodes, path expression nodes, function call nodes (with name and arguments), and nested expression nodes
- **FR-003**: System MUST evaluate the AST by traversing nodes and resolving: path expressions against the data model, function calls by invoking registered functions with resolved arguments, literal values as-is
- **FR-004**: System MUST support function calls with positional arguments, where arguments can be: string literals (single-quoted), number literals, boolean literals (`true`/`false`), path expressions, or nested function calls
- **FR-005**: System MUST resolve relative paths (not starting with `/`) against a provided base path when in a collection scope
- **FR-006**: System MUST convert non-string values to strings according to the specification: numbers/booleans as string representation, null/undefined as empty string, objects/arrays as JSON
- **FR-007**: System MUST handle escape sequences by converting `\${` to literal `${` in the output
- **FR-008**: System MUST provide meaningful error handling: syntax errors should result in empty string output for the affected expression and a warning logged to console
- **FR-009**: System MUST export a simplified public API with only two functions: `parseInterpolation` (returns AST) and `interpolate` (evaluates and returns string result)

### Key Entities _(include if feature involves data)_

- **Token**: Represents a lexical unit with type, value, and position information. Used by the lexer to break input into meaningful pieces.
- **AST Node**: Represents a parsed expression in tree form. Types include: `Literal` (plain text), `PathExpression` (data binding), `FunctionCall` (function with arguments), `InterpolatedString` (container for mixed content).
- **EvaluationContext**: Provides the data model, base path for relative resolution, and registered function catalog for AST evaluation.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Existing interpolation behavior continues to work correctly (simple path interpolation produces the same output as before)
- **SC-002**: Function call interpolation tests pass with correct output for registered functions
- **SC-003**: Nested expression tests pass with correct evaluation order (innermost to outermost)
- **SC-004**: Malformed input does not cause runtime errors; instead returns empty string and logs warning
- **SC-005**: Performance remains comparable: interpolation of 1000 strings with simple paths completes within reasonable time, and parser does not introduce significant overhead
- **SC-006**: New functionality is covered by comprehensive unit tests (target: 90%+ code coverage for new parser code)

## Assumptions

- The set of registered functions is provided externally via the function catalog mechanism already in place
- Function names follow identifier naming conventions (alphanumeric plus underscore, starting with letter)
- Maximum nesting depth of 10 levels is sufficient for all practical use cases
- String literals in function arguments use single quotes (e.g., `'yyyy-MM-dd'`) to avoid ambiguity with JSON double quotes
- The parser will be implemented in TypeScript and will not require external parsing libraries (hand-written recursive descent parser is sufficient for this grammar complexity)
