/**
 * Tests for ComponentRenderer - Component routing and rendering.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SurfaceProvider, useSurfaceContext } from '../contexts/SurfaceContext'
import { ComponentsMapProvider } from '../contexts/ComponentsMapContext'
import type { BaseComponentProps } from '@a2ui-sdk/types/0.9'
import { ComponentRenderer } from './ComponentRenderer'
import type { Component } from '@a2ui-sdk/types/0.9'

/**
 * Helper component to setup surface data.
 */
function SurfaceSetup({
  surfaceId,
  components,
}: {
  surfaceId: string
  components: Component[]
}) {
  const ctx = useSurfaceContext()

  // Setup on mount
  if (!ctx.getSurface(surfaceId)) {
    ctx.createSurface(surfaceId, 'catalog-1')
    ctx.updateComponents(surfaceId, components)
  }

  return null
}

describe('ComponentRenderer', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('basic rendering', () => {
    it('should render component from registry', async () => {
      // Test component that receives spread props (new pattern)
      const TestText = ({ text }: BaseComponentProps & { text: string }) => (
        <span data-testid="text">{text}</span>
      )

      const components: Component[] = [
        { id: 'text-1', component: 'Text', text: 'Hello World' },
      ]

      render(
        <SurfaceProvider>
          <ComponentsMapProvider defaultComponents={{ Text: TestText }}>
            <SurfaceSetup surfaceId="main" components={components} />
            <ComponentRenderer surfaceId="main" componentId="text-1" />
          </ComponentsMapProvider>
        </SurfaceProvider>
      )

      expect(screen.getByTestId('text')).toHaveTextContent('Hello World')
    })

    it('should render custom components from context over registry', () => {
      // Custom component using new spread props pattern
      const CustomText = ({ text }: BaseComponentProps & { text: string }) => (
        <span data-testid="custom">{text}</span>
      )

      const components: Component[] = [
        { id: 'text-1', component: 'Text', text: 'Custom Content' },
      ]

      render(
        <SurfaceProvider>
          <ComponentsMapProvider defaultComponents={{ Text: CustomText }}>
            <SurfaceSetup surfaceId="main" components={components} />
            <ComponentRenderer surfaceId="main" componentId="text-1" />
          </ComponentsMapProvider>
        </SurfaceProvider>
      )

      expect(screen.getByTestId('custom')).toHaveTextContent('Custom Content')
    })
  })

  describe('missing components', () => {
    it('should warn and return null for non-existent component', () => {
      render(
        <SurfaceProvider>
          <ComponentsMapProvider defaultComponents={{}}>
            <ComponentRenderer surfaceId="main" componentId="non-existent" />
          </ComponentsMapProvider>
        </SurfaceProvider>
      )

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Component not found: non-existent')
      )
    })

    it('should render UnknownComponent for unknown component types', () => {
      const components: Component[] = [
        { id: 'unknown-1', component: 'UnknownType' } as unknown as Component,
      ]

      render(
        <SurfaceProvider>
          <ComponentsMapProvider defaultComponents={{}}>
            <SurfaceSetup surfaceId="main" components={components} />
            <ComponentRenderer surfaceId="main" componentId="unknown-1" />
          </ComponentsMapProvider>
        </SurfaceProvider>
      )

      // UnknownComponent shows "Unknown component: {type}"
      expect(screen.getByText(/Unknown component:/i)).toBeInTheDocument()
      expect(screen.getByText(/UnknownType/i)).toBeInTheDocument()
    })
  })
})
