/**
 * useDataBinding - Hook for resolving data bindings in components.
 */

import { useMemo } from 'react'
import type { ValueSource, DataModel } from '@a2ui-sdk/types/0.8'
import { useDataModelContext } from '../contexts/DataModelContext'
import { useScope } from '../contexts/ScopeContext'
import { resolveValue, resolvePath } from '@a2ui-sdk/utils/0.8'

/**
 * Resolves a ValueSource to its actual value.
 *
 * @param surfaceId - The surface ID for data model lookup
 * @param source - The value source (literal or path reference)
 * @param defaultValue - Default value if source is undefined or path not found
 * @returns The resolved value
 *
 * @example
 * ```tsx
 * function TextComponent({ surfaceId, text }) {
 *   const textValue = useDataBinding<string>(surfaceId, text, '');
 *   return <span>{textValue}</span>;
 * }
 * ```
 */
export function useDataBinding<T = unknown>(
  surfaceId: string,
  source: ValueSource | undefined,
  defaultValue?: T
): T {
  const { getDataModel } = useDataModelContext()
  const { basePath } = useScope()

  return useMemo(() => {
    const dataModel = getDataModel(surfaceId)
    return resolveValue<T>(source, dataModel, basePath, defaultValue)
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
  const { getDataModel } = useDataModelContext()

  return useMemo(() => {
    return getDataModel(surfaceId)
  }, [getDataModel, surfaceId])
}

/**
 * Hook for two-way data binding in form components.
 * Returns both the current value and a setter function.
 *
 * @param surfaceId - The surface ID
 * @param source - The value source (must be a path reference for setting)
 * @param defaultValue - Default value if not found
 * @returns Tuple of [value, setValue]
 *
 * @example
 * ```tsx
 * function TextFieldComponent({ surfaceId, text }) {
 *   const [value, setValue] = useFormBinding<string>(surfaceId, text, '');
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
  source: ValueSource | undefined,
  defaultValue?: T
): [T, (value: T) => void] {
  const { getDataModel, setDataValue } = useDataModelContext()
  const { basePath } = useScope()

  const value = useMemo(() => {
    const dataModel = getDataModel(surfaceId)
    return resolveValue<T>(source, dataModel, basePath, defaultValue)
  }, [getDataModel, surfaceId, source, basePath, defaultValue])

  const setValue = useMemo(() => {
    return (newValue: T) => {
      // Only path references can be updated
      if (source && 'path' in source) {
        // Resolve the path against the current scope
        const resolvedPath = resolvePath(source.path, basePath)
        setDataValue(surfaceId, resolvedPath, newValue)
      }
    }
  }, [setDataValue, surfaceId, source, basePath])

  return [value, setValue]
}
