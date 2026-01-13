/**
 * String Interpolation Parser - Public API
 *
 * This module provides the public interface for parsing and evaluating
 * interpolated strings with the A2UI 0.9 `${expression}` syntax.
 *
 * @example
 * import { interpolate } from '@a2ui-sdk/utils/0.9'
 *
 * // Interpolate with data model
 * const result = interpolate('Hello, ${/user/name}!', { user: { name: 'John' } })
 * // result: "Hello, John!"
 */

import type {
  InterpolatedStringNode,
  DataModel,
  FunctionRegistry,
} from './types.js'
import { tokenize } from './lexer.js'
import { parse } from './parser.js'
import { evaluate } from './evaluator.js'

// Check for interpolation using simple string check
export function hasInterpolation(value: string): boolean {
  // Check for ${...} no matter if it is escaped or not
  return value.includes('${')
}

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
  if (!hasInterpolation(template)) {
    return template
  }
  const ast = parseInterpolation(template)
  return evaluate(ast, { dataModel, basePath, functions })
}
