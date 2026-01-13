/**
 * String Interpolation Parser - Public API
 *
 * This module provides the public interface for parsing and evaluating
 * interpolated strings with the A2UI 0.9 `${expression}` syntax.
 *
 * @example
 * import { parseInterpolation, interpolate } from '@easyops-cn/a2ui-react/0.9'
 *
 * // Parse to AST
 * const ast = parseInterpolation('Hello, ${/user/name}!')
 *
 * // Interpolate with data model
 * const result = interpolate('Hello, ${/user/name}!', { user: { name: 'John' } })
 * // result: "Hello, John!"
 */

export type {
  TokenType,
  Token,
  ASTNode,
  LiteralNode,
  PathNode,
  FunctionCallNode,
  InterpolatedStringNode,
  ParseError,
  DataModel,
  FunctionRegistry,
  InterpolationFunction,
  EvaluationContext,
} from './types'

export { tokenize } from './lexer'
export { parse } from './parser'
export { evaluate } from './evaluator'

import type {
  InterpolatedStringNode,
  DataModel,
  FunctionRegistry,
} from './types'
import { tokenize } from './lexer'
import { parse } from './parser'
import { evaluate } from './evaluator'

/**
 * Parses a template string and returns the AST.
 *
 * This function tokenizes and parses the input, returning an AST that
 * represents the structure of the interpolated string. Errors are handled
 * gracefully - malformed expressions become empty literals.
 *
 * @param template - The template string with ${...} expressions
 * @returns The parsed AST (InterpolatedStringNode)
 *
 * @example
 * const ast = parseInterpolation('Hello, ${/name}!')
 * // Returns:
 * // {
 * //   type: 'interpolatedString',
 * //   parts: [
 * //     { type: 'literal', value: 'Hello, ' },
 * //     { type: 'path', path: '/name', absolute: true },
 * //     { type: 'literal', value: '!' }
 * //   ]
 * // }
 */
export function parseInterpolation(template: string): InterpolatedStringNode {
  const tokens = tokenize(template)
  return parse(tokens)
}

/**
 * Parses and evaluates a template string, returning the interpolated result.
 *
 * This is the main entry point for string interpolation. It combines
 * parsing and evaluation in one call for convenience.
 *
 * @param template - The template string with ${...} expressions
 * @param dataModel - The data model for path lookups
 * @param basePath - Optional base path for relative path resolution
 * @param functions - Optional custom function registry
 * @returns The interpolated string result
 *
 * @example
 * const model = { user: { name: 'John' } }
 *
 * // Simple path
 * interpolate('Hello, ${/user/name}!', model)
 * // Returns: "Hello, John!"
 *
 * // Relative path with basePath
 * interpolate('Hello, ${name}!', model, '/user')
 * // Returns: "Hello, John!"
 *
 * // Function call
 * interpolate('${upper(${/user/name})}', model)
 * // Returns: "JOHN"
 */
export function interpolate(
  template: string,
  dataModel: DataModel,
  basePath: string | null = null,
  functions?: FunctionRegistry
): string {
  const ast = parseInterpolation(template)
  return evaluate(ast, { dataModel, basePath, functions })
}
