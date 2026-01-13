/**
 * useDataBinding - Hook for resolving data bindings in components.
 *
 * Supports the 0.9 simplified value format:
 * - Literal values: `"string"`, `42`, `true`
 * - Path bindings: `{"path": "/absolute"}` or `{"path": "relative"}`
 */

import { useMemo, useCallback } from 'react'
import type {
  DynamicValue,
  DynamicString,
  DataModel,
  FormBindableValue,
} from '@a2ui-sdk/types/0.9'
import { useSurfaceContext } from '../contexts/SurfaceContext'
import { useScope } from '../contexts/ScopeContext'
import {
  resolveValue,
  resolveString,
  isPathBinding,
} from '../utils/dataBinding'

/**
 * Resolves a DynamicValue to its actual value.
 *
 * @param surfaceId - The surface ID for data model lookup
 * @param source - The dynamic value (literal or path binding)
 * @param defaultValue - Default value if source is undefined or path not found
 * @returns The resolved value
 *
 * @example
 * ```tsx
 * function TextComponent({ surfaceId, component }) {
 *   const textValue = useDataBinding<string>(surfaceId, component.text, '');
 *   return <span>{textValue}</span>;
 * }
 * ```
 */
export function useDataBinding<T = unknown>(
  surfaceId: string,
  source: DynamicValue | undefined,
  defaultValue?: T
): T {
  const { getDataModel } = useSurfaceContext()
  const { basePath } = useScope()

  return useMemo(() => {
    const dataModel = getDataModel(surfaceId)
    return resolveValue<T>(source, dataModel, basePath, defaultValue)
  }, [getDataModel, surfaceId, source, basePath, defaultValue])
}

/**
 * Resolves a DynamicString to a string value.
 *
 * @param surfaceId - The surface ID for data model lookup
 * @param source - The dynamic string value
 * @param defaultValue - Default value if source is undefined or path not found
 * @returns The resolved string
 */
export function useStringBinding(
  surfaceId: string,
  source: DynamicString | undefined,
  defaultValue = ''
): string {
  const { getDataModel } = useSurfaceContext()
  const { basePath } = useScope()

  return useMemo(() => {
    const dataModel = getDataModel(surfaceId)
    return resolveString(source, dataModel, basePath, defaultValue)
  }, [getDataModel, surfaceId, source, basePath, defaultValue])
}

/**
 * Gets the full data model for a surface.
 * Useful for components that need access to multiple values.
 *
 * @param surfaceId - The surface ID
 * @returns The data model for this surface
 */
export function useDataModel(surfaceId: string): DataModel {
  const { getDataModel } = useSurfaceContext()

  return useMemo(() => {
    return getDataModel(surfaceId)
  }, [getDataModel, surfaceId])
}

/**
 * Hook for two-way data binding in form components.
 * Returns both the current value and a setter function.
 *
 * @param surfaceId - The surface ID
 * @param source - The dynamic value (must be a path binding for setting)
 * @param defaultValue - Default value if not found
 * @returns Tuple of [value, setValue]
 *
 * @example
 * ```tsx
 * function TextFieldComponent({ surfaceId, component }) {
 *   const [value, setValue] = useFormBinding<string>(surfaceId, component.value, '');
 *
 *   return (
 *     <input
 *       value={value}
 *       onChange={(e) => setValue(e.target.value)}
 *     />
 *   );
 * }
 * ```
 */
export function useFormBinding<T = unknown>(
  surfaceId: string,
  source: FormBindableValue | undefined,
  defaultValue?: T
): [T, (value: T) => void] {
  const { getDataModel, setDataValue } = useSurfaceContext()
  const { basePath } = useScope()

  const value = useMemo(() => {
    const dataModel = getDataModel(surfaceId)
    return resolveValue<T>(source, dataModel, basePath, defaultValue)
  }, [getDataModel, surfaceId, source, basePath, defaultValue])

  const setValue = useCallback(
    (newValue: T) => {
      // Only path bindings can be updated
      if (isPathBinding(source)) {
        // Resolve the path against the current scope
        const path = source.path.startsWith('/')
          ? source.path
          : basePath
            ? `${basePath}/${source.path}`
            : `/${source.path}`
        setDataValue(surfaceId, path, newValue)
      }
    },
    [setDataValue, surfaceId, source, basePath]
  )

  return [value, setValue]
}
