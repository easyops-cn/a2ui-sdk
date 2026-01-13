/**
 * Tests for useValidation - Hook for evaluating validation checks.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { SurfaceProvider, useSurfaceContext } from '../contexts/SurfaceContext'
import { ScopeProvider } from '../contexts/ScopeContext'
import { useValidation } from './useValidation'
import { useRef, type ReactNode } from 'react'
import type { CheckRule } from '@a2ui-sdk/types/0.9'
import type { ValidationFunction } from '../utils/validation'

/**
 * Setup component that creates a surface with data.
 */
function SurfaceSetup({
  surfaceId,
  dataModel,
  children,
}: {
  surfaceId: string
  dataModel: Record<string, unknown>
  children: ReactNode
}) {
  const ctx = useSurfaceContext()
  const setupDone = useRef<null | true>(null)

  if (setupDone.current === null) {
    setupDone.current = true
    ctx.createSurface(surfaceId, 'catalog-1')
    ctx.updateDataModel(surfaceId, '/', dataModel)
  }

  return <>{children}</>
}

describe('useValidation', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('basic validation', () => {
    it('should return valid when no checks are provided', () => {
      function TestComponent() {
        const result = useValidation('main', undefined)
        return (
          <div>
            <span data-testid="valid">{result.valid ? 'yes' : 'no'}</span>
            <span data-testid="errors">{result.errors.length}</span>
          </div>
        )
      }

      render(
        <SurfaceProvider>
          <SurfaceSetup surfaceId="main" dataModel={{}}>
            <TestComponent />
          </SurfaceSetup>
        </SurfaceProvider>
      )

      expect(screen.getByTestId('valid')).toHaveTextContent('yes')
      expect(screen.getByTestId('errors')).toHaveTextContent('0')
    })

    it('should return valid when all checks pass', () => {
      const checks: CheckRule[] = [
        {
          call: 'required',
          args: { value: { path: '/name' } },
          message: 'Name is required',
        },
        {
          call: 'email',
          args: { value: { path: '/email' } },
          message: 'Invalid email',
        },
      ]

      function TestComponent() {
        const result = useValidation('main', checks)
        return (
          <div>
            <span data-testid="valid">{result.valid ? 'yes' : 'no'}</span>
            <span data-testid="errors">{result.errors.join(', ')}</span>
          </div>
        )
      }

      render(
        <SurfaceProvider>
          <SurfaceSetup
            surfaceId="main"
            dataModel={{ name: 'Alice', email: 'alice@example.com' }}
          >
            <TestComponent />
          </SurfaceSetup>
        </SurfaceProvider>
      )

      expect(screen.getByTestId('valid')).toHaveTextContent('yes')
      expect(screen.getByTestId('errors')).toHaveTextContent('')
    })

    it('should return invalid when checks fail', () => {
      const checks: CheckRule[] = [
        {
          call: 'required',
          args: { value: { path: '/name' } },
          message: 'Name is required',
        },
      ]

      function TestComponent() {
        const result = useValidation('main', checks)
        return (
          <div>
            <span data-testid="valid">{result.valid ? 'yes' : 'no'}</span>
            <span data-testid="errors">{result.errors.join(', ')}</span>
          </div>
        )
      }

      render(
        <SurfaceProvider>
          <SurfaceSetup surfaceId="main" dataModel={{ name: '' }}>
            <TestComponent />
          </SurfaceSetup>
        </SurfaceProvider>
      )

      expect(screen.getByTestId('valid')).toHaveTextContent('no')
      expect(screen.getByTestId('errors')).toHaveTextContent('Name is required')
    })
  })

  describe('validation with scope', () => {
    it('should resolve relative paths using basePath from scope', () => {
      const checks: CheckRule[] = [
        {
          call: 'required',
          args: { value: { path: 'name' } }, // Relative path
          message: 'Item name required',
        },
      ]

      function TestComponent() {
        const result = useValidation('main', checks)
        return (
          <div>
            <span data-testid="valid">{result.valid ? 'yes' : 'no'}</span>
            <span data-testid="errors">{result.errors.join(', ')}</span>
          </div>
        )
      }

      render(
        <SurfaceProvider>
          <SurfaceSetup
            surfaceId="main"
            dataModel={{
              items: [{ name: 'First' }, { name: '' }],
            }}
          >
            <ScopeProvider basePath="/items/0">
              <TestComponent />
            </ScopeProvider>
          </SurfaceSetup>
        </SurfaceProvider>
      )

      // First item has name, should be valid
      expect(screen.getByTestId('valid')).toHaveTextContent('yes')
    })

    it('should fail validation when scoped data is missing', () => {
      const checks: CheckRule[] = [
        {
          call: 'required',
          args: { value: { path: 'name' } }, // Relative path
          message: 'Item name required',
        },
      ]

      function TestComponent() {
        const result = useValidation('main', checks)
        return (
          <div>
            <span data-testid="valid">{result.valid ? 'yes' : 'no'}</span>
            <span data-testid="errors">{result.errors.join(', ')}</span>
          </div>
        )
      }

      render(
        <SurfaceProvider>
          <SurfaceSetup
            surfaceId="main"
            dataModel={{
              items: [{ name: 'First' }, { name: '' }],
            }}
          >
            <ScopeProvider basePath="/items/1">
              <TestComponent />
            </ScopeProvider>
          </SurfaceSetup>
        </SurfaceProvider>
      )

      // Second item has empty name, should be invalid
      expect(screen.getByTestId('valid')).toHaveTextContent('no')
      expect(screen.getByTestId('errors')).toHaveTextContent(
        'Item name required'
      )
    })
  })

  describe('multiple validation rules', () => {
    it('should collect all validation errors', () => {
      const checks: CheckRule[] = [
        {
          call: 'required',
          args: { value: { path: '/username' } },
          message: 'Username required',
        },
        {
          call: 'email',
          args: { value: { path: '/email' } },
          message: 'Invalid email',
        },
        {
          call: 'length',
          args: { value: { path: '/password' }, min: 8 },
          message: 'Password too short',
        },
      ]

      function TestComponent() {
        const result = useValidation('main', checks)
        return (
          <div>
            <span data-testid="valid">{result.valid ? 'yes' : 'no'}</span>
            <span data-testid="errorCount">{result.errors.length}</span>
            <ul data-testid="errors">
              {result.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )
      }

      render(
        <SurfaceProvider>
          <SurfaceSetup
            surfaceId="main"
            dataModel={{
              username: '',
              email: 'invalid',
              password: '123',
            }}
          >
            <TestComponent />
          </SurfaceSetup>
        </SurfaceProvider>
      )

      expect(screen.getByTestId('valid')).toHaveTextContent('no')
      expect(screen.getByTestId('errorCount')).toHaveTextContent('3')
    })
  })

  describe('custom validation functions', () => {
    it('should support custom validation functions', () => {
      const checks: CheckRule[] = [
        {
          call: 'customCheck',
          args: { value: { path: '/value' } },
          message: 'Custom check failed',
        },
      ]

      const customFunctions: Record<string, ValidationFunction> = {
        customCheck: ({ value }: Record<string, unknown>) => {
          return value === 'valid'
        },
      }

      function TestComponent() {
        const result = useValidation('main', checks, customFunctions)
        return (
          <div>
            <span data-testid="valid">{result.valid ? 'yes' : 'no'}</span>
            <span data-testid="errors">{result.errors.join(', ')}</span>
          </div>
        )
      }

      render(
        <SurfaceProvider>
          <SurfaceSetup surfaceId="main" dataModel={{ value: 'valid' }}>
            <TestComponent />
          </SurfaceSetup>
        </SurfaceProvider>
      )

      expect(screen.getByTestId('valid')).toHaveTextContent('yes')
    })
  })

  describe('reactive validation', () => {
    it('should update validation when data model changes', () => {
      const checks: CheckRule[] = [
        {
          call: 'required',
          args: { value: { path: '/name' } },
          message: 'Name required',
        },
      ]

      function TestComponent() {
        const ctx = useSurfaceContext()
        const result = useValidation('main', checks)

        return (
          <div>
            <span data-testid="valid">{result.valid ? 'yes' : 'no'}</span>
            <button
              data-testid="update"
              onClick={() => ctx.updateDataModel('main', '/name', 'Alice')}
            >
              Update
            </button>
          </div>
        )
      }

      render(
        <SurfaceProvider>
          <SurfaceSetup surfaceId="main" dataModel={{ name: '' }}>
            <TestComponent />
          </SurfaceSetup>
        </SurfaceProvider>
      )

      // Initially invalid
      expect(screen.getByTestId('valid')).toHaveTextContent('no')

      // Update name
      act(() => {
        screen.getByTestId('update').click()
      })

      // Now valid
      expect(screen.getByTestId('valid')).toHaveTextContent('yes')
    })
  })

  describe('logical operators', () => {
    it('should support AND logic', () => {
      const checks: CheckRule[] = [
        {
          and: [
            {
              call: 'required',
              args: { value: { path: '/name' } },
              message: 'Name required',
            },
            {
              call: 'required',
              args: { value: { path: '/email' } },
              message: 'Email required',
            },
          ],
          message: 'Both name and email are required',
        },
      ]

      function TestComponent() {
        const result = useValidation('main', checks)
        return (
          <div>
            <span data-testid="valid">{result.valid ? 'yes' : 'no'}</span>
            <span data-testid="errors">{result.errors.join(', ')}</span>
          </div>
        )
      }

      render(
        <SurfaceProvider>
          <SurfaceSetup
            surfaceId="main"
            dataModel={{ name: 'Alice', email: '' }}
          >
            <TestComponent />
          </SurfaceSetup>
        </SurfaceProvider>
      )

      // Should be invalid because email is empty
      expect(screen.getByTestId('valid')).toHaveTextContent('no')
    })

    it('should support OR logic', () => {
      const checks: CheckRule[] = [
        {
          or: [
            {
              call: 'required',
              args: { value: { path: '/phone' } },
              message: 'Phone required',
            },
            {
              call: 'required',
              args: { value: { path: '/email' } },
              message: 'Email required',
            },
          ],
          message: 'Either phone or email is required',
        },
      ]

      function TestComponent() {
        const result = useValidation('main', checks)
        return (
          <div>
            <span data-testid="valid">{result.valid ? 'yes' : 'no'}</span>
            <span data-testid="errors">{result.errors.join(', ')}</span>
          </div>
        )
      }

      render(
        <SurfaceProvider>
          <SurfaceSetup
            surfaceId="main"
            dataModel={{ phone: '', email: 'alice@example.com' }}
          >
            <TestComponent />
          </SurfaceSetup>
        </SurfaceProvider>
      )

      // Should be valid because email is present
      expect(screen.getByTestId('valid')).toHaveTextContent('yes')
    })
  })
})
