/**
 * Tests for Catalog Components - Display, Layout, and Interactive components.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { SurfaceProvider, useSurfaceContext } from '../contexts/SurfaceContext'
import { ActionProvider } from '../contexts/ActionContext'
import { ComponentsMapProvider } from '../contexts/ComponentsMapContext'
import { ComponentRenderer } from './ComponentRenderer'
import { useRef, type ReactNode } from 'react'
import type { ComponentDefinition } from '@a2ui-sdk/types/0.9'
import { standardCatalog } from '../standard-catalog'

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
      <ActionProvider onAction={onAction}>
        <ComponentsMapProvider components={standardCatalog.components}>
          {children}
        </ComponentsMapProvider>
      </ActionProvider>
    </SurfaceProvider>
  )
}

/**
 * Setup component that creates a surface with components.
 */
function SurfaceSetup({
  surfaceId,
  components,
  dataModel = {},
  children,
}: {
  surfaceId: string
  components: ComponentDefinition[]
  dataModel?: Record<string, unknown>
  children: ReactNode
}) {
  const ctx = useSurfaceContext()
  const setupDone = useRef<null | true>(null)

  if (setupDone.current === null) {
    setupDone.current = true
    ctx.createSurface(surfaceId, 'catalog-1')
    ctx.updateComponents(surfaceId, components)
    ctx.updateDataModel(surfaceId, '/', dataModel)
  }

  return <>{children}</>
}

describe('Display Components', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('TextComponent', () => {
    it('should render literal text', () => {
      const components: ComponentDefinition[] = [
        { id: 'text-1', component: 'Text', text: 'Hello World' },
      ]

      render(
        <TestProvider>
          <SurfaceSetup surfaceId="main" components={components}>
            <ComponentRenderer surfaceId="main" componentId="text-1" />
          </SurfaceSetup>
        </TestProvider>
      )

      expect(screen.getByText('Hello World')).toBeInTheDocument()
    })

    it('should render text from data binding', () => {
      const components: ComponentDefinition[] = [
        { id: 'text-1', component: 'Text', text: { path: '/greeting' } },
      ]

      render(
        <TestProvider>
          <SurfaceSetup
            surfaceId="main"
            components={components}
            dataModel={{ greeting: 'Hello from Data' }}
          >
            <ComponentRenderer surfaceId="main" componentId="text-1" />
          </SurfaceSetup>
        </TestProvider>
      )

      expect(screen.getByText('Hello from Data')).toBeInTheDocument()
    })

    it('should render text with interpolation', () => {
      const components: ComponentDefinition[] = [
        { id: 'text-1', component: 'Text', text: 'Hello, ${/user/name}!' },
      ]

      render(
        <TestProvider>
          <SurfaceSetup
            surfaceId="main"
            components={components}
            dataModel={{ user: { name: 'Alice' } }}
          >
            <ComponentRenderer surfaceId="main" componentId="text-1" />
          </SurfaceSetup>
        </TestProvider>
      )

      expect(screen.getByText('Hello, Alice!')).toBeInTheDocument()
    })
  })

  describe('DividerComponent', () => {
    it('should render a divider', () => {
      const components: ComponentDefinition[] = [
        { id: 'divider-1', component: 'Divider' },
      ]

      render(
        <TestProvider>
          <SurfaceSetup surfaceId="main" components={components}>
            <ComponentRenderer surfaceId="main" componentId="divider-1" />
          </SurfaceSetup>
        </TestProvider>
      )

      // Divider renders as a separator role or hr element
      const separator = document.querySelector(
        '[role="separator"], hr, [data-slot="separator"]'
      )
      expect(separator).toBeInTheDocument()
    })
  })
})

describe('Layout Components', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('ColumnComponent', () => {
    it('should render children in a column layout', () => {
      const components: ComponentDefinition[] = [
        { id: 'col-1', component: 'Column', children: ['text-1', 'text-2'] },
        { id: 'text-1', component: 'Text', text: 'First' },
        { id: 'text-2', component: 'Text', text: 'Second' },
      ]

      render(
        <TestProvider>
          <SurfaceSetup surfaceId="main" components={components}>
            <ComponentRenderer surfaceId="main" componentId="col-1" />
          </SurfaceSetup>
        </TestProvider>
      )

      expect(screen.getByText('First')).toBeInTheDocument()
      expect(screen.getByText('Second')).toBeInTheDocument()
    })
  })

  describe('RowComponent', () => {
    it('should render children in a row layout', () => {
      const components: ComponentDefinition[] = [
        { id: 'row-1', component: 'Row', children: ['text-1', 'text-2'] },
        { id: 'text-1', component: 'Text', text: 'Left' },
        { id: 'text-2', component: 'Text', text: 'Right' },
      ]

      render(
        <TestProvider>
          <SurfaceSetup surfaceId="main" components={components}>
            <ComponentRenderer surfaceId="main" componentId="row-1" />
          </SurfaceSetup>
        </TestProvider>
      )

      expect(screen.getByText('Left')).toBeInTheDocument()
      expect(screen.getByText('Right')).toBeInTheDocument()
    })
  })

  describe('CardComponent', () => {
    it('should render card with content', () => {
      const components: ComponentDefinition[] = [
        { id: 'card-1', component: 'Card', child: 'text-1' },
        { id: 'text-1', component: 'Text', text: 'Card Content' },
      ]

      render(
        <TestProvider>
          <SurfaceSetup surfaceId="main" components={components}>
            <ComponentRenderer surfaceId="main" componentId="card-1" />
          </SurfaceSetup>
        </TestProvider>
      )

      expect(screen.getByText('Card Content')).toBeInTheDocument()
    })
  })

  describe('ListComponent', () => {
    it('should render list items based on data array', () => {
      const components: ComponentDefinition[] = [
        {
          id: 'list-1',
          component: 'List',
          children: { componentId: 'item-template', path: '/items' },
        },
        { id: 'item-template', component: 'Text', text: { path: 'name' } },
      ]

      render(
        <TestProvider>
          <SurfaceSetup
            surfaceId="main"
            components={components}
            dataModel={{
              items: [
                { name: 'Item 1' },
                { name: 'Item 2' },
                { name: 'Item 3' },
              ],
            }}
          >
            <ComponentRenderer surfaceId="main" componentId="list-1" />
          </SurfaceSetup>
        </TestProvider>
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })
  })
})

describe('Interactive Components', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('ButtonComponent', () => {
    it('should render button with child text', () => {
      const components: ComponentDefinition[] = [
        {
          id: 'btn-1',
          component: 'Button',
          child: 'btn-text',
          action: { name: 'click' },
        },
        { id: 'btn-text', component: 'Text', text: 'Click Me' },
      ]

      render(
        <TestProvider>
          <SurfaceSetup surfaceId="main" components={components}>
            <ComponentRenderer surfaceId="main" componentId="btn-1" />
          </SurfaceSetup>
        </TestProvider>
      )

      expect(
        screen.getByRole('button', { name: 'Click Me' })
      ).toBeInTheDocument()
    })

    it('should dispatch action on click', () => {
      const onAction = vi.fn()
      const components: ComponentDefinition[] = [
        {
          id: 'btn-1',
          component: 'Button',
          child: 'btn-text',
          action: { name: 'submit', context: { value: 'test' } },
        },
        { id: 'btn-text', component: 'Text', text: 'Submit' },
      ]

      render(
        <TestProvider onAction={onAction}>
          <SurfaceSetup surfaceId="main" components={components}>
            <ComponentRenderer surfaceId="main" componentId="btn-1" />
          </SurfaceSetup>
        </TestProvider>
      )

      act(() => {
        screen.getByRole('button', { name: 'Submit' }).click()
      })

      expect(onAction).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'submit',
          sourceComponentId: 'btn-1',
        })
      )
    })
  })

  describe('TextFieldComponent', () => {
    it('should render text input', () => {
      const components: ComponentDefinition[] = [
        {
          id: 'input-1',
          component: 'TextField',
          value: { path: '/name' },
          label: 'Name',
        },
      ]

      render(
        <TestProvider>
          <SurfaceSetup
            surfaceId="main"
            components={components}
            dataModel={{ name: 'Alice' }}
          >
            <ComponentRenderer surfaceId="main" componentId="input-1" />
          </SurfaceSetup>
        </TestProvider>
      )

      const input = screen.getByLabelText('Name') as HTMLInputElement
      expect(input).toBeInTheDocument()
      expect(input.value).toBe('Alice')
    })

    it('should update data model on change', () => {
      function TestWithDataCheck() {
        const ctx = useSurfaceContext()
        const dataModel = ctx.getDataModel('main')

        return (
          <div>
            <span data-testid="data">{JSON.stringify(dataModel)}</span>
          </div>
        )
      }

      const components: ComponentDefinition[] = [
        {
          id: 'input-1',
          component: 'TextField',
          value: { path: '/name' },
          label: 'Name',
        },
      ]

      render(
        <TestProvider>
          <SurfaceSetup
            surfaceId="main"
            components={components}
            dataModel={{ name: '' }}
          >
            <ComponentRenderer surfaceId="main" componentId="input-1" />
            <TestWithDataCheck />
          </SurfaceSetup>
        </TestProvider>
      )

      const input = screen.getByLabelText('Name') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'Bob' } })

      expect(screen.getByTestId('data')).toHaveTextContent('"name":"Bob"')
    })
  })

  describe('CheckBoxComponent', () => {
    it('should render checkbox with label', () => {
      const components: ComponentDefinition[] = [
        {
          id: 'check-1',
          component: 'CheckBox',
          label: 'Accept Terms',
          value: { path: '/accepted' },
        },
      ]

      render(
        <TestProvider>
          <SurfaceSetup
            surfaceId="main"
            components={components}
            dataModel={{ accepted: false }}
          >
            <ComponentRenderer surfaceId="main" componentId="check-1" />
          </SurfaceSetup>
        </TestProvider>
      )

      expect(screen.getByText('Accept Terms')).toBeInTheDocument()
    })
  })

  describe('ChoicePickerComponent', () => {
    it('should render choice picker with options', () => {
      const components: ComponentDefinition[] = [
        {
          id: 'picker-1',
          component: 'ChoicePicker',
          label: 'Select Option',
          options: [
            { value: 'a', label: 'Option A' },
            { value: 'b', label: 'Option B' },
          ],
          value: { path: '/selected' },
        },
      ]

      render(
        <TestProvider>
          <SurfaceSetup
            surfaceId="main"
            components={components}
            dataModel={{ selected: 'a' }}
          >
            <ComponentRenderer surfaceId="main" componentId="picker-1" />
          </SurfaceSetup>
        </TestProvider>
      )

      expect(screen.getByText('Select Option')).toBeInTheDocument()
    })
  })
})
