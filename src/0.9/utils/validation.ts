/**
 * Validation utilities for A2UI 0.9 Renderer.
 *
 * Implements validation functions and LogicExpression evaluation
 * for the `checks` property on input components and Buttons.
 */

import type {
  CheckRule,
  DynamicValue,
  DataModel,
  ValidationResult,
} from '../types'
import { resolveValue, isPathBinding } from './dataBinding'

// ============ Validation Functions ============

/**
 * Type for a validation function.
 * Takes resolved arguments and returns a boolean.
 */
export type ValidationFunction = (args: Record<string, unknown>) => boolean

/**
 * Built-in validation functions.
 */
export const validationFunctions: Record<string, ValidationFunction> = {
  /**
   * Checks if a value is present (not null, undefined, or empty string).
   */
  required: ({ value }) => {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return true
  },

  /**
   * Validates email format.
   */
  email: ({ value }) => {
    if (typeof value !== 'string') return false
    // Simple email validation - matches most valid emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },

  /**
   * Tests value against a regular expression pattern.
   */
  regex: ({ value, pattern }) => {
    if (typeof value !== 'string') return false
    if (typeof pattern !== 'string') return false
    try {
      return new RegExp(pattern).test(value)
    } catch {
      // Invalid regex pattern
      return false
    }
  },

  /**
   * Validates string length within min/max bounds.
   */
  length: ({ value, min, max }) => {
    const str = String(value ?? '')
    const len = str.length
    if (min !== undefined && min !== null && len < Number(min)) return false
    if (max !== undefined && max !== null && len > Number(max)) return false
    return true
  },

  /**
   * Validates numeric value within min/max bounds.
   */
  numeric: ({ value, min, max }) => {
    const num = Number(value)
    if (isNaN(num)) return false
    if (min !== undefined && min !== null && num < Number(min)) return false
    if (max !== undefined && max !== null && num > Number(max)) return false
    return true
  },
}

// ============ Logic Expression Evaluation ============

/**
 * Context for evaluating expressions.
 */
export interface EvaluationContext {
  dataModel: DataModel
  basePath: string | null
  functions?: Record<string, ValidationFunction>
}

/**
 * Resolves function arguments from DynamicValue to actual values.
 */
export function resolveArgs(
  args: Record<string, DynamicValue> | undefined,
  dataModel: DataModel,
  basePath: string | null
): Record<string, unknown> {
  if (!args) return {}

  const resolved: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(args)) {
    resolved[key] = resolveValue(value, dataModel, basePath, undefined)
  }
  return resolved
}

/**
 * Evaluates a function call.
 */
export function evaluateFunctionCall(
  call: string,
  args: Record<string, DynamicValue> | undefined,
  context: EvaluationContext
): boolean {
  const { dataModel, basePath, functions = validationFunctions } = context

  const fn = functions[call]
  if (!fn) {
    console.warn(`[A2UI] Unknown validation function: ${call}`)
    return true // Unknown functions pass by default
  }

  const resolvedArgs = resolveArgs(args, dataModel, basePath)
  return fn(resolvedArgs)
}

/**
 * Evaluates a CheckRule (which is also a LogicExpression).
 *
 * @param rule - The check rule to evaluate
 * @param context - Evaluation context with data model and scope
 * @returns true if the check passes, false if it fails
 */
export function evaluateCheckRule(
  rule: CheckRule,
  context: EvaluationContext
): boolean {
  // Handle logical operators
  if ('and' in rule && rule.and) {
    return rule.and.every((r) => evaluateCheckRule(r, context))
  }

  if ('or' in rule && rule.or) {
    return rule.or.some((r) => evaluateCheckRule(r, context))
  }

  if ('not' in rule && rule.not) {
    return !evaluateCheckRule(rule.not, context)
  }

  // Handle boolean constants
  if ('true' in rule && rule.true === true) {
    return true
  }

  if ('false' in rule && rule.false === false) {
    return false
  }

  // Handle function call
  if ('call' in rule && rule.call) {
    return evaluateFunctionCall(rule.call, rule.args, context)
  }

  // No valid expression found - default to pass
  return true
}

/**
 * Evaluates all checks for a component and returns validation result.
 *
 * @param checks - Array of check rules
 * @param dataModel - The data model for value resolution
 * @param basePath - The current scope base path (for relative paths)
 * @param functions - Optional custom validation functions
 * @returns ValidationResult with valid flag and error messages
 */
export function evaluateChecks(
  checks: CheckRule[] | undefined,
  dataModel: DataModel,
  basePath: string | null,
  functions?: Record<string, ValidationFunction>
): ValidationResult {
  if (!checks || checks.length === 0) {
    return { valid: true, errors: [] }
  }

  const context: EvaluationContext = {
    dataModel,
    basePath,
    functions: functions ?? validationFunctions,
  }

  const errors: string[] = []

  for (const check of checks) {
    const passes = evaluateCheckRule(check, context)
    if (!passes && check.message) {
      errors.push(check.message)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Extracts all paths referenced in a CheckRule for dependency tracking.
 * This is useful for knowing which data model paths affect validation.
 */
export function extractCheckDependencies(checks: CheckRule[]): string[] {
  const paths = new Set<string>()

  function extractFromArgs(args: Record<string, DynamicValue> | undefined) {
    if (!args) return
    for (const value of Object.values(args)) {
      if (isPathBinding(value)) {
        paths.add(value.path)
      }
    }
  }

  function extractFromRule(rule: CheckRule) {
    if (rule.args) {
      extractFromArgs(rule.args)
    }
    if (rule.and) {
      for (const r of rule.and) {
        extractFromRule(r)
      }
    }
    if (rule.or) {
      for (const r of rule.or) {
        extractFromRule(r)
      }
    }
    if (rule.not) {
      extractFromRule(rule.not)
    }
  }

  for (const check of checks) {
    extractFromRule(check)
  }

  return Array.from(paths)
}
