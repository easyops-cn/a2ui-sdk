/**
 * Tests for A2UIRenderer - Component for rendering A2UI surfaces.
 */

import { useRef, type ReactNode } from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SurfaceProvider, useSurfaceContext } from './contexts/SurfaceContext'
import { ActionProvider } from './contexts/ActionContext'
import {
  ComponentsMapProvider,
  type A2UIComponent,
} from './contexts/ComponentsMapContext'
import { A2UIRenderer } from './A2UIRenderer'
import { ComponentRenderer } from './components/ComponentRenderer'
import type { ComponentDefinition } from '@a2ui-sdk/types/0.9'
import type { A2UIComponentProps } from './components/types'

/**
 * Simple test provider that uses custom test components.
 */
function TestA2UIProvider({
  testComponents,
  children,
}: {
  testComponents: Record<string, A2UIComponent>
  children: ReactNode
}) {
  return (
    <SurfaceProvider>
      <ActionProvider>
        <ComponentsMapProvider components={testComponents}>
          {children}
        </ComponentsMapProvider>
      </ActionProvider>
    </SurfaceProvider>
  )
}

/**
 * Setup component that creates surface and components.
 */
function SurfaceSetup({
  surfaceId,
  components,
  children,
}: {
  surfaceId: string
  components: ComponentDefinition[]
  children: ReactNode
}) {
  const ctx = useSurfaceContext()
  const setupDone = useRef<null | true>(null)

  // Set up surface synchronously during render for testing
  if (setupDone.current === null) {
    setupDone.current = true
    ctx.createSurface(surfaceId, 'catalog-1')
    ctx.updateComponents(surfaceId, components)
  }

  return <>{children}</>
}

/**
 * Multi-surface setup component.
 */
function MultiSurfaceSetup({
  surfaces,
  children,
}: {
  surfaces: Array<{ surfaceId: string; components: ComponentDefinition[] }>
  children: ReactNode
}) {
  const ctx = useSurfaceContext()
  const setupDone = useRef<null | true>(null)

  // Set up surfaces synchronously during render for testing
  if (setupDone.current === null) {
    setupDone.current = true
    for (const { surfaceId, components } of surfaces) {
      ctx.createSurface(surfaceId, 'catalog-1')
      ctx.updateComponents(surfaceId, components)
    }
  }

  return <>{children}</>
}

describe('A2UIRenderer', () => {
  // Define test components using new spread props pattern
  const TestText = ({
    componentId,
    text,
  }: A2UIComponentProps & { text: string }) => (
    <span data-testid={`text-${componentId}`}>{text}</span>
  )

  const TestColumn = ({
    componentId,
    surfaceId,
    children,
  }: A2UIComponentProps & { children?: string[] }) => {
    const childIds = children ?? []
    return (
      <div data-testid={`column-${componentId}`}>
        {childIds.map((childId: string) => (
          <ComponentRenderer
            key={childId}
            surfaceId={surfaceId}
            componentId={childId}
          />
        ))}
      </div>
    )
  }

  const testComponents: Record<string, A2UIComponent> = {
    Text: TestText,
    Column: TestColumn,
  }

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('rendering surfaces', () => {
    it('should render nothing when no surfaces exist', () => {
      const { container } = render(
        <TestA2UIProvider testComponents={testComponents}>
          <A2UIRenderer />
        </TestA2UIProvider>
      )

      expect(container.firstChild).toBeNull()
    })

    it('should render surface with root component', () => {
      render(
        <TestA2UIProvider testComponents={testComponents}>
          <SurfaceSetup
            surfaceId="main"
            components={[{ id: 'root', component: 'Text', text: 'Hello' }]}
          >
            <A2UIRenderer />
          </SurfaceSetup>
        </TestA2UIProvider>
      )

      expect(screen.getByTestId('text-root')).toHaveTextContent('Hello')
    })

    it('should render all surfaces when no surfaceId is provided', () => {
      render(
        <TestA2UIProvider testComponents={testComponents}>
          <MultiSurfaceSetup
            surfaces={[
              {
                surfaceId: 'surface-1',
                components: [
                  { id: 'root', component: 'Text', text: 'Surface 1' },
                ],
              },
              {
                surfaceId: 'surface-2',
                components: [
                  { id: 'root', component: 'Text', text: 'Surface 2' },
                ],
              },
            ]}
          >
            <A2UIRenderer />
          </MultiSurfaceSetup>
        </TestA2UIProvider>
      )

      expect(screen.getByText('Surface 1')).toBeInTheDocument()
      expect(screen.getByText('Surface 2')).toBeInTheDocument()
    })

    it('should render specific surface when surfaceId is provided', () => {
      render(
        <TestA2UIProvider testComponents={testComponents}>
          <MultiSurfaceSetup
            surfaces={[
              {
                surfaceId: 'surface-1',
                components: [
                  { id: 'root', component: 'Text', text: 'Surface 1' },
                ],
              },
              {
                surfaceId: 'surface-2',
                components: [
                  { id: 'root', component: 'Text', text: 'Surface 2' },
                ],
              },
            ]}
          >
            <A2UIRenderer surfaceId="surface-1" />
          </MultiSurfaceSetup>
        </TestA2UIProvider>
      )

      expect(screen.getByText('Surface 1')).toBeInTheDocument()
      expect(screen.queryByText('Surface 2')).not.toBeInTheDocument()
    })

    it('should render nothing for non-existent surface', () => {
      render(
        <TestA2UIProvider testComponents={testComponents}>
          <SurfaceSetup
            surfaceId="main"
            components={[{ id: 'root', component: 'Text', text: 'Hello' }]}
          >
            <div data-testid="wrapper">
              <A2UIRenderer surfaceId="non-existent" />
            </div>
          </SurfaceSetup>
        </TestA2UIProvider>
      )

      expect(screen.getByTestId('wrapper').children.length).toBe(0)
    })
  })

  describe('root component detection', () => {
    it('should use component with id "root" as root', () => {
      render(
        <TestA2UIProvider testComponents={testComponents}>
          <SurfaceSetup
            surfaceId="main"
            components={[
              { id: 'root', component: 'Text', text: 'Root' },
              { id: 'other', component: 'Text', text: 'Other' },
            ]}
          >
            <A2UIRenderer />
          </SurfaceSetup>
        </TestA2UIProvider>
      )

      // Should render the root component
      expect(screen.getByText('Root')).toBeInTheDocument()
    })

    it('should find root component by analyzing child references', () => {
      render(
        <TestA2UIProvider testComponents={testComponents}>
          <SurfaceSetup
            surfaceId="main"
            components={[
              { id: 'container', component: 'Column', children: ['child-1'] },
              { id: 'child-1', component: 'Text', text: 'Child' },
            ]}
          >
            <A2UIRenderer />
          </SurfaceSetup>
        </TestA2UIProvider>
      )

      // Should render the container (parent) as root
      expect(screen.getByTestId('column-container')).toBeInTheDocument()
      expect(screen.getByText('Child')).toBeInTheDocument()
    })
  })

  describe('component tree rendering', () => {
    it('should render nested component tree', () => {
      render(
        <TestA2UIProvider testComponents={testComponents}>
          <SurfaceSetup
            surfaceId="main"
            components={[
              {
                id: 'root',
                component: 'Column',
                children: ['text-1', 'text-2'],
              },
              { id: 'text-1', component: 'Text', text: 'First' },
              { id: 'text-2', component: 'Text', text: 'Second' },
            ]}
          >
            <A2UIRenderer />
          </SurfaceSetup>
        </TestA2UIProvider>
      )

      expect(screen.getByTestId('column-root')).toBeInTheDocument()
      expect(screen.getByText('First')).toBeInTheDocument()
      expect(screen.getByText('Second')).toBeInTheDocument()
    })
  })
})
