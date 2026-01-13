/**
 * Type definitions for the string interpolation parser.
 *
 * This module defines tokens, AST nodes, and evaluation context types
 * used throughout the lexer, parser, and evaluator.
 */

/**
 * Token types produced by the lexer.
 */
export enum TokenType {
  /** Literal text outside ${...} expressions */
  TEXT = 'TEXT',

  /** Expression start delimiter: ${ */
  EXPR_START = 'EXPR_START',

  /** Expression end delimiter: } */
  EXPR_END = 'EXPR_END',

  /** JSON Pointer path: /foo/bar or foo/bar */
  PATH = 'PATH',

  /** Function name identifier */
  IDENTIFIER = 'IDENTIFIER',

  /** Left parenthesis: ( */
  LPAREN = 'LPAREN',

  /** Right parenthesis: ) */
  RPAREN = 'RPAREN',

  /** Comma separator: , */
  COMMA = 'COMMA',

  /** Single-quoted string literal: 'value' */
  STRING = 'STRING',

  /** Numeric literal: 42, -3.14 */
  NUMBER = 'NUMBER',

  /** Boolean literal: true, false */
  BOOLEAN = 'BOOLEAN',

  /** End of input */
  EOF = 'EOF',
}

/**
 * A token produced by the lexer.
 */
export interface Token {
  /** The type of token */
  type: TokenType
  /** The raw text value of the token */
  value: string
  /** Start position in the input string */
  start: number
  /** End position in the input string (exclusive) */
  end: number
}

/**
 * Literal node - represents static text outside expressions.
 */
export interface LiteralNode {
  type: 'literal'
  value: string
}

/**
 * Path node - represents a JSON Pointer (RFC 6901) path reference.
 *
 * The path string may contain escape sequences (~0 for ~, ~1 for /)
 * that are decoded at evaluation time.
 */
export interface PathNode {
  type: 'path'
  /** The raw path string (may contain ~0, ~1 escape sequences) */
  path: string
  /** True if path starts with '/' (absolute path) */
  absolute: boolean
}

/**
 * Function call node - represents a client-side function invocation.
 */
export interface FunctionCallNode {
  type: 'functionCall'
  /** Function name (identifier) */
  name: string
  /** Arguments (can be literals, paths, or nested function calls) */
  args: ASTNode[]
}

/**
 * Interpolated string node - root node representing mixed content.
 */
export interface InterpolatedStringNode {
  type: 'interpolatedString'
  /** Sequence of literals and expressions */
  parts: ASTNode[]
}

/**
 * Discriminated union of all AST node types.
 */
export type ASTNode =
  | LiteralNode
  | PathNode
  | FunctionCallNode
  | InterpolatedStringNode

/**
 * Parse error information.
 */
export interface ParseError {
  /** Human-readable error description */
  message: string
  /** Character position in input where error occurred */
  position: number
  /** Length of the problematic text */
  length: number
}

/**
 * Data model type - hierarchical key-value store.
 */
export type DataModel = Record<string, unknown>

/**
 * Interpolation function signature.
 */
export type InterpolationFunction = (...args: unknown[]) => unknown

/**
 * Registry of available interpolation functions.
 */
export type FunctionRegistry = Record<string, InterpolationFunction>

/**
 * Context provided to the evaluator for resolving paths and function calls.
 */
export interface EvaluationContext {
  /** The data model for path resolution */
  dataModel: DataModel
  /** Base path for relative path resolution (null for root scope) */
  basePath: string | null
  /** Optional custom function registry */
  functions?: FunctionRegistry
}
