/**
 * Tests for useDispatchAction - Hook for dispatching actions from components.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { SurfaceProvider, useSurfaceContext } from '../contexts/SurfaceContext'
import { ActionProvider } from '../contexts/ActionContext'
import { ScopeProvider } from '../contexts/ScopeContext'
import { useDispatchAction } from './useDispatchAction'
import { useRef, type ReactNode } from 'react'

/**
 * Test provider with all required contexts.
 */
function TestProvider({
  onAction,
  children,
}: {
  onAction?: (payload: unknown) => void
  children: ReactNode
}) {
  return (
    <SurfaceProvider>
      <ActionProvider onAction={onAction}>{children}</ActionProvider>
    </SurfaceProvider>
  )
}

/**
 * Setup component that creates a surface.
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

describe('useDispatchAction', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return a dispatch function', () => {
    function TestComponent() {
      const dispatchAction = useDispatchAction()
      return <span data-testid="type">{typeof dispatchAction}</span>
    }

    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    )

    expect(screen.getByTestId('type')).toHaveTextContent('function')
  })

  it('should dispatch action with correct payload', () => {
    const onAction = vi.fn()

    function TestComponent() {
      const dispatchAction = useDispatchAction()

      return (
        <button
          data-testid="dispatch"
          onClick={() =>
            dispatchAction('main', 'btn-1', {
              name: 'click',
              context: { key: 'value' },
            })
          }
        >
          Click
        </button>
      )
    }

    render(
      <TestProvider onAction={onAction}>
        <SurfaceSetup surfaceId="main" dataModel={{}}>
          <TestComponent />
        </SurfaceSetup>
      </TestProvider>
    )

    act(() => {
      screen.getByTestId('dispatch').click()
    })

    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({
        surfaceId: 'main',
        name: 'click',
        sourceComponentId: 'btn-1',
      })
    )
  })

  it('should resolve context values from data model', () => {
    const onAction = vi.fn()

    function TestComponent() {
      const dispatchAction = useDispatchAction()

      return (
        <button
          data-testid="dispatch"
          onClick={() =>
            dispatchAction('main', 'btn-1', {
              name: 'submit',
              context: {
                username: { path: '/user/name' },
                count: { path: '/count' },
              },
            })
          }
        >
          Submit
        </button>
      )
    }

    render(
      <TestProvider onAction={onAction}>
        <SurfaceSetup
          surfaceId="main"
          dataModel={{ user: { name: 'Alice' }, count: 42 }}
        >
          <TestComponent />
        </SurfaceSetup>
      </TestProvider>
    )

    act(() => {
      screen.getByTestId('dispatch').click()
    })

    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({
        surfaceId: 'main',
        name: 'submit',
        context: {
          username: 'Alice',
          count: 42,
        },
      })
    )
  })

  it('should use basePath from ScopeContext for relative paths', () => {
    const onAction = vi.fn()

    function TestComponent() {
      const dispatchAction = useDispatchAction()

      return (
        <button
          data-testid="dispatch"
          onClick={() =>
            dispatchAction('main', 'btn-1', {
              name: 'select',
              context: {
                itemName: { path: 'name' }, // Relative path
              },
            })
          }
        >
          Select
        </button>
      )
    }

    render(
      <TestProvider onAction={onAction}>
        <SurfaceSetup
          surfaceId="main"
          dataModel={{
            items: [{ name: 'First' }, { name: 'Second' }],
          }}
        >
          <ScopeProvider basePath="/items/0">
            <TestComponent />
          </ScopeProvider>
        </SurfaceSetup>
      </TestProvider>
    )

    act(() => {
      screen.getByTestId('dispatch').click()
    })

    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'select',
        context: {
          itemName: 'First',
        },
      })
    )
  })

  it('should handle action without context', () => {
    const onAction = vi.fn()

    function TestComponent() {
      const dispatchAction = useDispatchAction()

      return (
        <button
          data-testid="dispatch"
          onClick={() =>
            dispatchAction('main', 'btn-1', {
              name: 'simple-action',
            })
          }
        >
          Click
        </button>
      )
    }

    render(
      <TestProvider onAction={onAction}>
        <SurfaceSetup surfaceId="main" dataModel={{}}>
          <TestComponent />
        </SurfaceSetup>
      </TestProvider>
    )

    act(() => {
      screen.getByTestId('dispatch').click()
    })

    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'simple-action',
        context: {},
      })
    )
  })

  it('should warn when no handler is registered', () => {
    function TestComponent() {
      const dispatchAction = useDispatchAction()

      return (
        <button
          data-testid="dispatch"
          onClick={() => dispatchAction('main', 'btn-1', { name: 'test' })}
        >
          Click
        </button>
      )
    }

    render(
      <TestProvider>
        <SurfaceSetup surfaceId="main" dataModel={{}}>
          <TestComponent />
        </SurfaceSetup>
      </TestProvider>
    )

    act(() => {
      screen.getByTestId('dispatch').click()
    })

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('no handler is registered')
    )
  })
})
