/**
 * Evaluator for interpolation AST nodes.
 *
 * Traverses the AST and resolves values from the data model,
 * producing the final interpolated string.
 */

import type {
  ASTNode,
  InterpolatedStringNode,
  EvaluationContext,
} from './types'
import { getValueByPath, resolvePath } from '../pathUtils'

/**
 * Evaluates an AST node and returns the result as a string.
 *
 * @param ast - The AST node to evaluate
 * @param context - The evaluation context with data model and functions
 * @returns The evaluated string result
 */
export function evaluate(ast: ASTNode, context: EvaluationContext): string {
  const value = evaluateNode(ast, context)
  return stringifyValue(value)
}

/**
 * Evaluates an AST node and returns the raw value.
 */
function evaluateNode(node: ASTNode, context: EvaluationContext): unknown {
  switch (node.type) {
    case 'literal':
      return node.value

    case 'path':
      return evaluatePath(node.path, node.absolute, context)

    case 'functionCall':
      return evaluateFunctionCall(node.name, node.args, context)

    case 'interpolatedString':
      return evaluateInterpolatedString(node, context)

    default:
      return ''
  }
}

/**
 * Evaluates a path and resolves it against the data model.
 * Note: JSON Pointer escape sequences (~0, ~1) are decoded by getValueByPath
 * via parseJsonPointer in pathUtils.ts.
 */
function evaluatePath(
  path: string,
  absolute: boolean,
  context: EvaluationContext
): unknown {
  // Resolve relative paths
  let resolvedPath: string
  if (absolute) {
    resolvedPath = path
  } else {
    resolvedPath = resolvePath(path, context.basePath)
  }

  return getValueByPath(context.dataModel, resolvedPath)
}

/**
 * Evaluates a function call with its arguments.
 */
function evaluateFunctionCall(
  name: string,
  args: ASTNode[],
  context: EvaluationContext
): unknown {
  // Look up function in custom registry
  const fn = context.functions?.[name]

  if (!fn) {
    console.warn(`[A2UI] Unknown function: ${name}`)
    return ''
  }

  // Evaluate all arguments
  const evaluatedArgs = args.map((arg) => evaluateNode(arg, context))

  // Call the function
  try {
    return fn(...evaluatedArgs)
  } catch (error) {
    console.warn(`[A2UI] Function error in ${name}:`, error)
    return ''
  }
}

/**
 * Evaluates an interpolated string by concatenating all parts.
 */
function evaluateInterpolatedString(
  node: InterpolatedStringNode,
  context: EvaluationContext
): string {
  return node.parts
    .map((part) => stringifyValue(evaluateNode(part, context)))
    .join('')
}

/**
 * Converts a value to string for output.
 */
function stringifyValue(value: unknown): string {
  if (value === undefined || value === null) {
    return ''
  }
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}
