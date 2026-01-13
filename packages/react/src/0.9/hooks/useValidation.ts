/**
 * useValidation - Hook for evaluating checks on components.
 *
 * Provides reactive validation based on data model changes.
 */

import { useMemo } from 'react'
import type { CheckRule, ValidationResult } from '@a2ui-sdk/types/0.9'
import { useSurfaceContext } from '../contexts/SurfaceContext'
import { useScope } from '../contexts/ScopeContext'
import { evaluateChecks, type ValidationFunction } from '../utils/validation'

/**
 * Hook for evaluating validation checks on a component.
 *
 * @param surfaceId - The surface ID for data model lookup
 * @param checks - Array of check rules to evaluate
 * @param customFunctions - Optional custom validation functions
 * @returns ValidationResult with valid flag and error messages
 *
 * @example
 * ```tsx
 * function TextFieldComponent({ surfaceId, component }) {
 *   const { valid, errors } = useValidation(surfaceId, component.checks);
 *
 *   return (
 *     <div>
 *       <input className={!valid ? 'error' : ''} />
 *       {errors.map(err => <span key={err} className="error">{err}</span>)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useValidation(
  surfaceId: string,
  checks: CheckRule[] | undefined,
  customFunctions?: Record<string, ValidationFunction>
): ValidationResult {
  const { getDataModel } = useSurfaceContext()
  const { basePath } = useScope()

  return useMemo(() => {
    const dataModel = getDataModel(surfaceId)
    return evaluateChecks(checks, dataModel, basePath, customFunctions)
  }, [getDataModel, surfaceId, checks, basePath, customFunctions])
}
