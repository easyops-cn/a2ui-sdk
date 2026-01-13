/**
 * Tests for ComponentRenderer - Component routing and rendering.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SurfaceProvider, useSurfaceContext } from '../contexts/SurfaceContext'
import {
  ComponentsMapProvider,
  type A2UIComponentProps,
} from '../contexts/ComponentsMapContext'
import {
  ComponentRenderer,
  registerComponent,
  componentRegistry,
} from './ComponentRenderer'
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

    // Clear registry before each test
    for (const key of Object.keys(componentRegistry)) {
      delete componentRegistry[key]
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('basic rendering', () => {
    it('should render component from registry', async () => {
      // Register a test component
      const TestText = ({ component }: A2UIComponentProps) => (
        <span data-testid="text">{(component as { text: string }).text}</span>
      )
      registerComponent('Text', TestText)

      const components: Component[] = [
        { id: 'text-1', component: 'Text', text: 'Hello World' },
      ]

      render(
        <SurfaceProvider>
          <SurfaceSetup surfaceId="main" components={components} />
          <ComponentRenderer surfaceId="main" componentId="text-1" />
        </SurfaceProvider>
      )

      expect(screen.getByTestId('text')).toHaveTextContent('Hello World')
    })

    it('should render custom components from context over registry', () => {
      // Register a default component
      const DefaultText = () => <span>Default</span>
      registerComponent('Text', DefaultText)

      // Custom component override
      const CustomText = ({ component }: A2UIComponentProps) => (
        <span data-testid="custom">{(component as { text: string }).text}</span>
      )

      const components: Component[] = [
        { id: 'text-1', component: 'Text', text: 'Custom Content' },
      ]

      const customMap = new Map([['Text', CustomText]])

      render(
        <SurfaceProvider>
          <ComponentsMapProvider components={customMap} defaultComponents={{}}>
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
          <ComponentRenderer surfaceId="main" componentId="non-existent" />
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
          <SurfaceSetup surfaceId="main" components={components} />
          <ComponentRenderer surfaceId="main" componentId="unknown-1" />
        </SurfaceProvider>
      )

      // UnknownComponent shows "Unknown component: {type}"
      expect(screen.getByText(/Unknown component:/i)).toBeInTheDocument()
      expect(screen.getByText(/UnknownType/i)).toBeInTheDocument()
    })
  })
})

describe('registerComponent', () => {
  afterEach(() => {
    // Clear registry
    for (const key of Object.keys(componentRegistry)) {
      delete componentRegistry[key]
    }
  })

  it('should register component in registry', () => {
    const TestComponent = () => <div>Test</div>
    registerComponent('Test', TestComponent)

    expect(componentRegistry['Test']).toBe(TestComponent)
  })

  it('should override existing component', () => {
    const First = () => <div>First</div>
    const Second = () => <div>Second</div>

    registerComponent('Test', First)
    registerComponent('Test', Second)

    expect(componentRegistry['Test']).toBe(Second)
  })
})
