/**
 * Tests for A2UIProvider - Combined provider for A2UI contexts.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { SurfaceProvider, useSurfaceContext } from './SurfaceContext'
import { ActionProvider, useActionContext } from './ActionContext'
import {
  ComponentsMapProvider,
  useComponentsMapContext,
} from './ComponentsMapContext'
import { A2UIProvider } from './A2UIProvider'
import { standardCatalog } from '../standard-catalog'
import { type ReactNode } from 'react'

/**
 * Simple test provider.
 */
function TestA2UIProvider({ children }: { children: ReactNode }) {
  return (
    <SurfaceProvider>
      <ComponentsMapProvider defaultComponents={{}}>
        {children}
      </ComponentsMapProvider>
    </SurfaceProvider>
  )
}

/**
 * Test provider with action handling (wraps ActionProvider like A2UIRenderer does).
 */
function TestA2UIProviderWithAction({
  onAction,
  children,
}: {
  onAction?: (payload: unknown) => void
  children: ReactNode
}) {
  return (
    <SurfaceProvider>
      <ActionProvider onAction={onAction}>
        <ComponentsMapProvider defaultComponents={{}}>
          {children}
        </ComponentsMapProvider>
      </ActionProvider>
    </SurfaceProvider>
  )
}

/**
 * Test consumer that exposes context values.
 */
function TestConsumer() {
  const surfaceCtx = useSurfaceContext()

  return (
    <div>
      <span data-testid="surfaces">{surfaceCtx.surfaces.size}</span>
    </div>
  )
}

/**
 * Test consumer that exposes context values including action context.
 */
function TestConsumerWithAction() {
  const surfaceCtx = useSurfaceContext()
  const actionCtx = useActionContext()

  return (
    <div>
      <span data-testid="surfaces">{surfaceCtx.surfaces.size}</span>
      <span data-testid="has-dispatch">{actionCtx ? 'yes' : 'no'}</span>
    </div>
  )
}

describe('A2UIProvider', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('context provision', () => {
    it('should provide SurfaceContext', () => {
      render(
        <TestA2UIProvider>
          <TestConsumer />
        </TestA2UIProvider>
      )

      expect(screen.getByTestId('surfaces')).toHaveTextContent('0')
    })

    it('should provide ActionContext when wrapped with ActionProvider', () => {
      render(
        <TestA2UIProviderWithAction>
          <TestConsumerWithAction />
        </TestA2UIProviderWithAction>
      )

      expect(screen.getByTestId('has-dispatch')).toHaveTextContent('yes')
    })
  })

  describe('message processing', () => {
    it('should process createSurface via context', async () => {
      function SurfaceCreator() {
        const ctx = useSurfaceContext()
        return (
          <div>
            <span data-testid="surfaces">{ctx.surfaces.size}</span>
            <button
              data-testid="create"
              onClick={() => ctx.createSurface('main', 'catalog-1')}
            >
              Create
            </button>
          </div>
        )
      }

      render(
        <TestA2UIProvider>
          <SurfaceCreator />
        </TestA2UIProvider>
      )

      expect(screen.getByTestId('surfaces')).toHaveTextContent('0')

      act(() => {
        screen.getByTestId('create').click()
      })

      expect(screen.getByTestId('surfaces')).toHaveTextContent('1')
    })

    it('should process component and data model updates', async () => {
      function DataManager() {
        const ctx = useSurfaceContext()
        const component = ctx.getComponent('main', 'root')
        const dataModel = ctx.getDataModel('main')

        return (
          <div>
            <span data-testid="component">{component?.component ?? ''}</span>
            <span data-testid="data">{JSON.stringify(dataModel)}</span>
            <button
              data-testid="setup"
              onClick={() => {
                ctx.createSurface('main', 'catalog-1')
                ctx.updateComponents('main', [
                  { id: 'root', component: 'Text', text: 'Hello' },
                ])
                ctx.updateDataModel('main', '/count', 42)
              }}
            >
              Setup
            </button>
          </div>
        )
      }

      render(
        <TestA2UIProvider>
          <DataManager />
        </TestA2UIProvider>
      )

      act(() => {
        screen.getByTestId('setup').click()
      })

      // Wait for state to update
      await waitFor(() => {
        expect(screen.getByTestId('component')).toHaveTextContent('Text')
      })
      expect(screen.getByTestId('data')).toHaveTextContent('{"count":42}')
    })

    it('should handle empty surfaces', () => {
      render(
        <TestA2UIProvider>
          <TestConsumer />
        </TestA2UIProvider>
      )

      expect(screen.getByTestId('surfaces')).toHaveTextContent('0')
    })
  })

  describe('action handling', () => {
    it('should call onAction when action is dispatched via A2UIRenderer', () => {
      const onAction = vi.fn()

      function ActionDispatcher() {
        const surfaceCtx = useSurfaceContext()
        const actionCtx = useActionContext()
        const dataModel = surfaceCtx.getDataModel('main')

        return (
          <button
            data-testid="dispatch"
            onClick={() =>
              actionCtx.dispatchAction(
                'main',
                'btn-1',
                { name: 'click' },
                dataModel
              )
            }
          >
            Dispatch
          </button>
        )
      }

      render(
        <TestA2UIProviderWithAction onAction={onAction}>
          <ActionDispatcher />
        </TestA2UIProviderWithAction>
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
  })

  describe('catalog prop', () => {
    it('should use custom catalog components', () => {
      function CustomText() {
        return <span>Custom Text</span>
      }

      const customCatalog = {
        components: {
          Text: CustomText,
        },
        functions: {},
      }

      const wrapper = ({ children }: { children: ReactNode }) => (
        <A2UIProvider messages={[]} catalog={customCatalog}>
          {children}
        </A2UIProvider>
      )

      const { result } = renderHook(() => useComponentsMapContext(), {
        wrapper,
      })

      expect(result.current.getComponent('Text')).toBe(CustomText)
      // Other standard components should not be available
      expect(result.current.getComponent('Button')).toBeUndefined()
    })

    it('should allow extending standard catalog with custom components', () => {
      function CustomChart() {
        return <div>Chart</div>
      }

      const extendedCatalog = {
        ...standardCatalog,
        components: {
          ...standardCatalog.components,
          CustomChart,
        },
      }

      const wrapper = ({ children }: { children: ReactNode }) => (
        <A2UIProvider messages={[]} catalog={extendedCatalog}>
          {children}
        </A2UIProvider>
      )

      const { result } = renderHook(() => useComponentsMapContext(), {
        wrapper,
      })

      // Custom component should be available
      expect(result.current.getComponent('CustomChart')).toBe(CustomChart)
      // Standard components should still be available
      expect(result.current.getComponent('Text')).toBeDefined()
      expect(result.current.getComponent('Button')).toBeDefined()
    })

    it('should use standard catalog when no catalog is provided', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <A2UIProvider messages={[]}>{children}</A2UIProvider>
      )

      const { result } = renderHook(() => useComponentsMapContext(), {
        wrapper,
      })

      // Standard components should be available
      expect(result.current.getComponent('Text')).toBeDefined()
      expect(result.current.getComponent('Button')).toBeDefined()
      expect(result.current.getComponent('Row')).toBeDefined()
    })
  })
})
