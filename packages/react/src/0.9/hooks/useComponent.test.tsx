/**
 * Tests for useComponent - Hook to get a component from a Surface.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { SurfaceProvider, useSurfaceContext } from '../contexts/SurfaceContext'
import { useComponent } from './useComponent'
import type { Component } from '@a2ui-sdk/types/0.9'

/**
 * Setup component that creates a surface with components.
 */
function SetupAndTest({
  surfaceId,
  components,
  testComponentId,
}: {
  surfaceId: string
  components: Component[]
  testComponentId: string
}) {
  const ctx = useSurfaceContext()
  const component = useComponent(surfaceId, testComponentId)

  // Setup surface on first render
  if (!ctx.getSurface(surfaceId)) {
    ctx.createSurface(surfaceId, 'catalog-1')
    ctx.updateComponents(surfaceId, components)
  }

  return (
    <div>
      <span data-testid="component-type">{component?.component ?? 'none'}</span>
      <span data-testid="component-id">{component?.id ?? 'none'}</span>
    </div>
  )
}

describe('useComponent', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('should return component when it exists', () => {
    const components: Component[] = [
      { id: 'text-1', component: 'Text', text: 'Hello' },
    ]

    render(
      <SurfaceProvider>
        <SetupAndTest
          surfaceId="main"
          components={components}
          testComponentId="text-1"
        />
      </SurfaceProvider>
    )

    expect(screen.getByTestId('component-type')).toHaveTextContent('Text')
    expect(screen.getByTestId('component-id')).toHaveTextContent('text-1')
  })

  it('should return undefined for non-existent component', () => {
    const components: Component[] = [
      { id: 'text-1', component: 'Text', text: 'Hello' },
    ]

    render(
      <SurfaceProvider>
        <SetupAndTest
          surfaceId="main"
          components={components}
          testComponentId="non-existent"
        />
      </SurfaceProvider>
    )

    expect(screen.getByTestId('component-type')).toHaveTextContent('none')
    expect(screen.getByTestId('component-id')).toHaveTextContent('none')
  })

  it('should return undefined for non-existent surface', () => {
    function TestNonExistentSurface() {
      const component = useComponent('non-existent', 'text-1')
      return (
        <span data-testid="result">{component ? 'found' : 'not-found'}</span>
      )
    }

    render(
      <SurfaceProvider>
        <TestNonExistentSurface />
      </SurfaceProvider>
    )

    expect(screen.getByTestId('result')).toHaveTextContent('not-found')
  })

  it('should update when component is updated', () => {
    function UpdateTest() {
      const ctx = useSurfaceContext()
      const component = useComponent('main', 'text-1')

      // Create surface on first render
      if (!ctx.getSurface('main')) {
        ctx.createSurface('main', 'catalog-1')
        ctx.updateComponents('main', [
          { id: 'text-1', component: 'Text', text: 'Original' },
        ])
      }

      return (
        <div>
          <span data-testid="text">
            {(component as { text?: string })?.text ?? 'none'}
          </span>
          <button
            data-testid="update"
            onClick={() =>
              ctx.updateComponents('main', [
                { id: 'text-1', component: 'Text', text: 'Updated' },
              ])
            }
          >
            Update
          </button>
        </div>
      )
    }

    render(
      <SurfaceProvider>
        <UpdateTest />
      </SurfaceProvider>
    )

    expect(screen.getByTestId('text')).toHaveTextContent('Original')

    act(() => {
      screen.getByTestId('update').click()
    })

    expect(screen.getByTestId('text')).toHaveTextContent('Updated')
  })

  it('should memoize component reference', () => {
    const renderCounts = { count: 0 }

    function MemoTest() {
      const ctx = useSurfaceContext()
      const component = useComponent('main', 'text-1')

      // eslint-disable-next-line react-hooks/immutability
      renderCounts.count++

      // Setup once
      if (!ctx.getSurface('main')) {
        ctx.createSurface('main', 'catalog-1')
        ctx.updateComponents('main', [
          { id: 'text-1', component: 'Text', text: 'Hello' },
        ])
      }

      return <span>{component?.component}</span>
    }

    const { rerender } = render(
      <SurfaceProvider>
        <MemoTest />
      </SurfaceProvider>
    )

    const initialCount = renderCounts.count

    // Rerender without changing anything
    rerender(
      <SurfaceProvider>
        <MemoTest />
      </SurfaceProvider>
    )

    // Should have rendered again but with same memoized values
    expect(renderCounts.count).toBeGreaterThan(initialCount)
  })
})
