/**
 * Data binding utility functions for A2UI 0.9.
 *
 * Handles resolving dynamic values with the simplified 0.9 format:
 * - Literal values: `"string"`, `42`, `true`
 * - Path bindings: `{"path": "/user/name"}` or `{"path": "relative"}`
 * - Function calls: `{"call": "functionName", "args": {...}}`
 */

import type {
  DynamicValue,
  DynamicString,
  DataModel,
  FormBindableValue,
} from '@a2ui-sdk/types/0.9'
import { getValueByPath, resolvePath } from './pathUtils'
import { interpolate } from '@a2ui-sdk/utils/0.9'

/**
 * Type guard to check if a value is a path binding.
 *
 * @param value - The value to check
 * @returns True if the value is a path binding object
 *
 * @example
 * isPathBinding({ path: "/user/name" });  // true
 * isPathBinding("literal");               // false
 * isPathBinding({ call: "required" });    // false
 */
export function isPathBinding(
  value: FormBindableValue | undefined | null
): value is { path: string } {
  return (
    value !== undefined &&
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    'path' in value &&
    typeof (value as { path: unknown }).path === 'string'
  )
}

/**
 * Type guard to check if a value is a function call.
 *
 * @param value - The value to check
 * @returns True if the value is a function call object
 */
export function isFunctionCall(
  value: FormBindableValue | undefined | null
): value is { call: string; args?: Record<string, DynamicValue> } {
  return (
    value !== undefined &&
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    'call' in value &&
    typeof (value as { call: unknown }).call === 'string'
  )
}

/**
 * Gets the path from a dynamic value, or undefined if it's not a path binding.
 *
 * @param value - The dynamic value
 * @returns The path string or undefined
 */
export function getBindingPath(
  value: FormBindableValue | undefined | null
): string | undefined {
  if (isPathBinding(value)) {
    return value.path
  }
  return undefined
}

/**
 * Resolves a dynamic value to its actual value.
 *
 * Resolution order:
 * 1. If value is a path binding object → resolve from data model
 * 2. If value is a function call → return undefined (function calls not evaluated here)
 * 3. Otherwise → return literal value
 *
 * @param value - The dynamic value (literal, path binding, or function call)
 * @param dataModel - The data model for path lookups
 * @param basePath - Optional base path for relative path resolution
 * @param defaultValue - Default value if undefined or path not found
 * @returns The resolved value
 *
 * @example
 * // Literal values
 * resolveValue("Hello", {});        // "Hello"
 * resolveValue(42, {});             // 42
 * resolveValue(true, {});           // true
 *
 * // Path bindings
 * const model = { user: { name: "John" } };
 * resolveValue({ path: "/user/name" }, model);           // "John"
 * resolveValue({ path: "name" }, model, "/user");        // "John" (relative)
 * resolveValue({ path: "/nonexistent" }, model, null, "default"); // "default"
 */
export function resolveValue<T = unknown>(
  value: FormBindableValue | undefined | null,
  dataModel: DataModel,
  basePath: string | null = null,
  defaultValue?: T
): T {
  if (value === undefined || value === null) {
    return defaultValue as T
  }

  // Path binding
  if (isPathBinding(value)) {
    const resolvedPath = resolvePath(value.path, basePath)
    const result = getValueByPath(dataModel, resolvedPath)
    if (result === undefined) {
      return defaultValue as T
    }
    return result as T
  }

  // Function call - not evaluated here, return default
  if (isFunctionCall(value)) {
    return defaultValue as T
  }

  // Literal value
  return value as T
}

/**
 * Resolves a DynamicString value to a string.
 * This is a convenience wrapper for string values.
 *
 * Supports interpolation: if the string contains `${...}` expressions,
 * they will be replaced with values from the data model.
 *
 * @param value - The dynamic string value
 * @param dataModel - The data model for path lookups
 * @param basePath - Optional base path for relative path resolution
 * @param defaultValue - Default value if undefined or path not found
 * @returns The resolved string
 *
 * @example
 * // Simple string
 * resolveString("Hello", {});  // "Hello"
 *
 * // Path binding
 * resolveString({ path: "/user/name" }, { user: { name: "John" } });  // "John"
 *
 * // Interpolation
 * resolveString("Hello, ${/user/name}!", { user: { name: "John" } });  // "Hello, John!"
 */
export function resolveString(
  value: DynamicString | undefined | null,
  dataModel: DataModel,
  basePath: string | null = null,
  defaultValue = ''
): string {
  // Handle undefined/null
  if (value === undefined || value === null) {
    return defaultValue
  }

  // Handle path binding
  if (isPathBinding(value)) {
    const resolvedPath = resolvePath(value.path, basePath)
    const result = getValueByPath(dataModel, resolvedPath)
    if (result === undefined || result === null) {
      return defaultValue
    }
    return String(result)
  }

  // Handle function call (not evaluated here)
  if (isFunctionCall(value)) {
    return defaultValue
  }

  // Handle string literal - perform interpolation
  if (typeof value === 'string') {
    return interpolate(value, dataModel, basePath)
  }

  // Other types (number, boolean) - convert to string
  return String(value)
}

/**
 * Resolves a dynamic number value.
 *
 * @param value - The dynamic number value
 * @param dataModel - The data model for path lookups
 * @param basePath - Optional base path for relative path resolution
 * @param defaultValue - Default value if undefined or path not found
 * @returns The resolved number
 */
export function resolveNumber(
  value: number | { path: string } | undefined | null,
  dataModel: DataModel,
  basePath: string | null = null,
  defaultValue = 0
): number {
  const resolved = resolveValue(value, dataModel, basePath, defaultValue)
  if (typeof resolved === 'number') {
    return resolved
  }
  if (resolved === null || resolved === undefined) {
    return defaultValue
  }
  const parsed = Number(resolved)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Resolves a dynamic boolean value.
 *
 * @param value - The dynamic boolean value
 * @param dataModel - The data model for path lookups
 * @param basePath - Optional base path for relative path resolution
 * @param defaultValue - Default value if undefined or path not found
 * @returns The resolved boolean
 */
export function resolveBoolean(
  value: boolean | { path: string } | undefined | null,
  dataModel: DataModel,
  basePath: string | null = null,
  defaultValue = false
): boolean {
  const resolved = resolveValue(value, dataModel, basePath, defaultValue)
  if (typeof resolved === 'boolean') {
    return resolved
  }
  if (resolved === null || resolved === undefined) {
    return defaultValue
  }
  return Boolean(resolved)
}

/**
 * Resolves action context values to a plain object.
 * All path bindings are resolved to their actual values.
 *
 * @param context - Object with dynamic values
 * @param dataModel - The data model for path lookups
 * @param basePath - Optional base path for relative path resolution
 * @returns A plain object with resolved context values
 *
 * @example
 * const context = {
 *   name: { path: "/user/name" },
 *   action: "submit",
 *   count: 42
 * };
 * resolveContext(context, { user: { name: "John" } });
 * // Returns: { name: "John", action: "submit", count: 42 }
 */
export function resolveContext(
  context: Record<string, DynamicValue> | undefined,
  dataModel: DataModel,
  basePath: string | null = null
): Record<string, unknown> {
  if (!context) {
    return {}
  }

  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(context)) {
    result[key] = resolveValue(value, dataModel, basePath)
  }

  return result
}
