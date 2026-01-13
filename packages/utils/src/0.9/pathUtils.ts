/**
 * Path utility functions for A2UI 0.9 data model operations.
 *
 * Implements JSON Pointer (RFC 6901) parsing and resolution with
 * support for relative paths within collection scopes.
 */

import type { DataModel } from '@a2ui-sdk/types/0.9'

/**
 * Parses a JSON Pointer path into segments.
 *
 * @param path - The JSON Pointer path (e.g., "/user/name")
 * @returns Array of path segments
 *
 * @example
 * parseJsonPointer("/user/name");        // ["user", "name"]
 * parseJsonPointer("/items/0");          // ["items", "0"]
 * parseJsonPointer("/");                 // []
 * parseJsonPointer("/a~1b");             // ["a/b"] (escaped slash)
 * parseJsonPointer("/m~0n");             // ["m~n"] (escaped tilde)
 */
export function parseJsonPointer(path: string): string[] {
  if (!path || path === '/') {
    return []
  }

  // Remove leading slash and split
  const segments = path.startsWith('/')
    ? path.slice(1).split('/')
    : path.split('/')

  // Unescape JSON Pointer special characters (~1 -> /, ~0 -> ~)
  return segments
    .filter((s) => s !== '')
    .map((segment) => segment.replace(/~1/g, '/').replace(/~0/g, '~'))
}

/**
 * Gets a value from the data model by JSON Pointer path.
 *
 * @param dataModel - The data model to read from
 * @param path - The JSON Pointer path (e.g., "/user/name")
 * @returns The value at the path, or undefined if not found
 *
 * @example
 * const model = { user: { name: "John" }, items: ["a", "b"] };
 * getValueByPath(model, "/user/name");   // "John"
 * getValueByPath(model, "/items/0");     // "a"
 * getValueByPath(model, "/nonexistent"); // undefined
 */
export function getValueByPath(dataModel: DataModel, path: string): unknown {
  if (!path || path === '/') {
    return dataModel
  }

  const segments = parseJsonPointer(path)
  let current: unknown = dataModel

  for (const segment of segments) {
    if (current === null || current === undefined) {
      return undefined
    }

    if (Array.isArray(current)) {
      const index = parseInt(segment, 10)
      if (isNaN(index)) {
        return undefined
      }
      current = current[index]
    } else if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[segment]
    } else {
      return undefined
    }
  }

  return current
}

/**
 * Sets a value in the data model by JSON Pointer path, returning a new data model.
 * This function is immutable - it does not modify the original data model.
 *
 * @param dataModel - The data model to update
 * @param path - The JSON Pointer path (e.g., "/user/name")
 * @param value - The value to set (undefined to delete)
 * @returns A new data model with the value set
 *
 * @example
 * const model = { user: { name: "John" } };
 * setValueByPath(model, "/user/name", "Jane");   // { user: { name: "Jane" } }
 * setValueByPath(model, "/user/age", 30);        // { user: { name: "John", age: 30 } }
 * setValueByPath(model, "/user/name", undefined); // { user: {} }
 */
export function setValueByPath(
  dataModel: DataModel,
  path: string,
  value: unknown
): DataModel {
  // Replace entire data model
  if (!path || path === '/') {
    if (value === undefined) {
      return {}
    }
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return value as DataModel
    }
    return dataModel
  }

  const segments = parseJsonPointer(path)

  // Deep clone to ensure immutability
  const result = structuredClone(dataModel)

  // Navigate to parent
  let current: unknown = result
  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i]

    if (Array.isArray(current)) {
      const index = parseInt(segment, 10)
      if (isNaN(index)) {
        return result
      }
      // Ensure array element exists as object
      if (current[index] === null || current[index] === undefined) {
        current[index] = {}
      }
      current = current[index]
    } else if (typeof current === 'object' && current !== null) {
      const obj = current as Record<string, unknown>
      // Create intermediate object if needed
      if (obj[segment] === null || obj[segment] === undefined) {
        obj[segment] = {}
      } else if (typeof obj[segment] !== 'object') {
        obj[segment] = {}
      }
      current = obj[segment]
    } else {
      return result
    }
  }

  // Set or delete at final segment
  const lastSegment = segments[segments.length - 1]
  if (Array.isArray(current)) {
    const index = parseInt(lastSegment, 10)
    if (!isNaN(index)) {
      if (value === undefined) {
        current.splice(index, 1)
      } else {
        current[index] = value
      }
    }
  } else if (typeof current === 'object' && current !== null) {
    const obj = current as Record<string, unknown>
    if (value === undefined) {
      delete obj[lastSegment]
    } else {
      obj[lastSegment] = value
    }
  }

  return result
}

/**
 * Normalizes a path to ensure it starts with "/" and has no trailing "/".
 *
 * @param path - The path to normalize
 * @returns The normalized path
 *
 * @example
 * normalizePath("user/name");   // "/user/name"
 * normalizePath("/user/name/"); // "/user/name"
 */
export function normalizePath(path: string): string {
  let normalized = path.trim()

  // Ensure starts with /
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized
  }

  // Remove trailing / (except for root path)
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }

  return normalized
}

/**
 * Checks if a path is absolute (starts with "/").
 *
 * @param path - The path to check
 * @returns True if the path is absolute
 *
 * @example
 * isAbsolutePath("/user/name");  // true
 * isAbsolutePath("name");        // false
 * isAbsolutePath("");            // false
 */
export function isAbsolutePath(path: string): boolean {
  return path.startsWith('/')
}

/**
 * Resolves a path against a base path (scope).
 *
 * Absolute paths (starting with "/") are returned as-is.
 * Relative paths are resolved against the base path.
 *
 * @param path - The path to resolve
 * @param basePath - The base path (scope), or null for root scope
 * @returns The resolved absolute path
 *
 * @example
 * resolvePath("/user/name", "/items/0");   // "/user/name" (absolute)
 * resolvePath("name", "/items/0");         // "/items/0/name" (relative)
 * resolvePath("name", null);               // "/name" (root scope)
 */
export function resolvePath(path: string, basePath: string | null): string {
  if (isAbsolutePath(path)) {
    return normalizePath(path)
  }

  if (basePath === null || basePath === '/') {
    return normalizePath(path)
  }

  return joinPaths(basePath, path)
}

/**
 * Joins two paths together.
 *
 * @param basePath - The base path
 * @param relativePath - The relative path to join
 * @returns The joined path
 *
 * @example
 * joinPaths("/user", "name");     // "/user/name"
 * joinPaths("/user", "/name");    // "/user/name"
 * joinPaths("/user/", "/name/");  // "/user/name"
 */
export function joinPaths(basePath: string, relativePath: string): string {
  const base = normalizePath(basePath)
  const relative = relativePath.trim().replace(/^\/+/, '').replace(/\/+$/, '')

  if (!relative) {
    return base
  }

  if (base === '/') {
    return '/' + relative
  }

  return base + '/' + relative
}
