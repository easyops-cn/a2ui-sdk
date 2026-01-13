/**
 * Tests for useDataBinding hooks - Data binding in components.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { SurfaceProvider, useSurfaceContext } from '../contexts/SurfaceContext'
import { ScopeProvider } from '../contexts/ScopeContext'
import {
  useDataBinding,
  useStringBinding,
  useDataModel,
  useFormBinding,
} from './useDataBinding'

/**
 * Helper to set up a surface with data.
 */
function SurfaceSetup({
  surfaceId,
  dataModel,
  children,
}: {
  surfaceId: string
  dataModel: Record<string, unknown>
  children: React.ReactNode
}) {
  const ctx = useSurfaceContext()

  if (!ctx.getSurface(surfaceId)) {
    ctx.createSurface(surfaceId, 'catalog-1')
    ctx.updateDataModel(surfaceId, '/', dataModel)
  }

  return <>{children}</>
}

describe('useDataBinding', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  describe('literal values', () => {
    it('should return literal string value', () => {
      function Test() {
        const value = useDataBinding<string>('main', 'hello', '')
        return <span data-testid="value">{value}</span>
      }

      render(
        <SurfaceProvider>
          <SurfaceSetup surfaceId="main" dataModel={{}}>
            <Test />
          </SurfaceSetup>
        </SurfaceProvider>
      )

      expect(screen.getByTestId('value')).toHaveTextContent('hello')
    })

    it('should return literal number value', () => {
      function Test() {
        const value = useDataBinding<number>('main', 42, 0)
        return <span data-testid="value">{value}</span>
      }

      render(
        <SurfaceProvider>
          <SurfaceSetup surfaceId="main" dataModel={{}}>
            <Test />
          </SurfaceSetup>
        </SurfaceProvider>
      )

      expect(screen.getByTestId('value')).toHaveTextContent('42')
    })

    it('should return literal boolean value', () => {
      function Test() {
        const value = useDataBinding<boolean>('main', true, false)
        return <span data-testid="value">{value ? 'yes' : 'no'}</span>
      }

      render(
        <SurfaceProvider>
          <SurfaceSetup surfaceId="main" dataModel={{}}>
            <Test />
          </SurfaceSetup>
        </SurfaceProvider>
      )

      expect(screen.getByTestId('value')).toHaveTextContent('yes')
    })
  })

  describe('path bindings', () => {
    it('should resolve absolute path binding', () => {
      function Test() {
        const value = useDataBinding<string>('main', { path: '/user/name' }, '')
        return <span data-testid="value">{value}</span>
      }

      render(
        <SurfaceProvider>
          <SurfaceSetup
            surfaceId="main"
            dataModel={{ user: { name: 'Alice' } }}
          >
            <Test />
          </SurfaceSetup>
        </SurfaceProvider>
      )

      expect(screen.getByTestId('value')).toHaveTextContent('Alice')
    })

    it('should return default value for non-existent path', () => {
      function Test() {
        const value = useDataBinding<string>(
          'main',
          { path: '/nonexistent' },
          'default'
        )
        return <span data-testid="value">{value}</span>
      }

      render(
        <SurfaceProvider>
          <SurfaceSetup surfaceId="main" dataModel={{}}>
            <Test />
          </SurfaceSetup>
        </SurfaceProvider>
      )

      expect(screen.getByTestId('value')).toHaveTextContent('default')
    })

    it('should resolve relative path with scope', () => {
      function Test() {
        const value = useDataBinding<string>('main', { path: 'name' }, '')
        return <span data-testid="value">{value}</span>
      }

      render(
        <SurfaceProvider>
          <SurfaceSetup
            surfaceId="main"
            dataModel={{ users: [{ name: 'Alice' }, { name: 'Bob' }] }}
          >
            <ScopeProvider basePath="/users/0">
              <Test />
            </ScopeProvider>
          </SurfaceSetup>
        </SurfaceProvider>
      )

      expect(screen.getByTestId('value')).toHaveTextContent('Alice')
    })
  })

  describe('default values', () => {
    it('should return default value for undefined source', () => {
      function Test() {
        const value = useDataBinding<string>('main', undefined, 'default')
        return <span data-testid="value">{value}</span>
      }

      render(
        <SurfaceProvider>
          <SurfaceSetup surfaceId="main" dataModel={{}}>
            <Test />
          </SurfaceSetup>
        </SurfaceProvider>
      )

      expect(screen.getByTestId('value')).toHaveTextContent('default')
    })
  })
})

describe('useStringBinding', () => {
  it('should resolve string with interpolation', () => {
    function Test() {
      const value = useStringBinding('main', 'Hello, ${/user/name}!', '')
      return <span data-testid="value">{value}</span>
    }

    render(
      <SurfaceProvider>
        <SurfaceSetup surfaceId="main" dataModel={{ user: { name: 'Alice' } }}>
          <Test />
        </SurfaceSetup>
      </SurfaceProvider>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('Hello, Alice!')
  })

  it('should handle path binding for string', () => {
    function Test() {
      const value = useStringBinding('main', { path: '/greeting' }, '')
      return <span data-testid="value">{value}</span>
    }

    render(
      <SurfaceProvider>
        <SurfaceSetup surfaceId="main" dataModel={{ greeting: 'Hello World' }}>
          <Test />
        </SurfaceSetup>
      </SurfaceProvider>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('Hello World')
  })
})

describe('useDataModel', () => {
  it('should return full data model for surface', () => {
    function Test() {
      const dataModel = useDataModel('main')
      return <span data-testid="value">{JSON.stringify(dataModel)}</span>
    }

    render(
      <SurfaceProvider>
        <SurfaceSetup
          surfaceId="main"
          dataModel={{ user: { name: 'Alice' }, count: 42 }}
        >
          <Test />
        </SurfaceSetup>
      </SurfaceProvider>
    )

    expect(screen.getByTestId('value')).toHaveTextContent(
      '{"user":{"name":"Alice"},"count":42}'
    )
  })

  it('should return empty object for non-existent surface', () => {
    function Test() {
      const dataModel = useDataModel('non-existent')
      return <span data-testid="value">{JSON.stringify(dataModel)}</span>
    }

    render(
      <SurfaceProvider>
        <Test />
      </SurfaceProvider>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('{}')
  })
})

describe('useFormBinding', () => {
  it('should return current value and setter', () => {
    function Test() {
      const [value, setValue] = useFormBinding<string>(
        'main',
        { path: '/form/name' },
        ''
      )
      return (
        <div>
          <span data-testid="value">{value}</span>
          <button data-testid="update" onClick={() => setValue('Bob')}>
            Update
          </button>
        </div>
      )
    }

    render(
      <SurfaceProvider>
        <SurfaceSetup surfaceId="main" dataModel={{ form: { name: 'Alice' } }}>
          <Test />
        </SurfaceSetup>
      </SurfaceProvider>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('Alice')

    act(() => {
      screen.getByTestId('update').click()
    })

    expect(screen.getByTestId('value')).toHaveTextContent('Bob')
  })

  it('should update data model when setter is called', () => {
    function Test() {
      const ctx = useSurfaceContext()
      const [value, setValue] = useFormBinding<string>(
        'main',
        { path: '/input' },
        ''
      )

      return (
        <div>
          <input
            data-testid="input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <span data-testid="data">
            {JSON.stringify(ctx.getDataModel('main'))}
          </span>
        </div>
      )
    }

    render(
      <SurfaceProvider>
        <SurfaceSetup surfaceId="main" dataModel={{ input: 'initial' }}>
          <Test />
        </SurfaceSetup>
      </SurfaceProvider>
    )

    const input = screen.getByTestId('input')
    fireEvent.change(input, { target: { value: 'new value' } })

    expect(screen.getByTestId('data')).toHaveTextContent(
      '{"input":"new value"}'
    )
  })

  it('should not update when source is literal (not path binding)', () => {
    function Test() {
      const ctx = useSurfaceContext()
      const [value, setValue] = useFormBinding<string>('main', 'literal', '')

      return (
        <div>
          <span data-testid="value">{value}</span>
          <button data-testid="update" onClick={() => setValue('changed')}>
            Update
          </button>
          <span data-testid="data">
            {JSON.stringify(ctx.getDataModel('main'))}
          </span>
        </div>
      )
    }

    render(
      <SurfaceProvider>
        <SurfaceSetup surfaceId="main" dataModel={{}}>
          <Test />
        </SurfaceSetup>
      </SurfaceProvider>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('literal')

    act(() => {
      screen.getByTestId('update').click()
    })

    // Value should still be 'literal' because it's not a path binding
    expect(screen.getByTestId('value')).toHaveTextContent('literal')
    // Data model should be unchanged
    expect(screen.getByTestId('data')).toHaveTextContent('{}')
  })

  it('should handle relative path with scope', () => {
    function Test() {
      const [value, setValue] = useFormBinding<string>(
        'main',
        { path: 'name' },
        ''
      )

      return (
        <div>
          <span data-testid="value">{value}</span>
          <button data-testid="update" onClick={() => setValue('Updated')}>
            Update
          </button>
        </div>
      )
    }

    render(
      <SurfaceProvider>
        <SurfaceSetup
          surfaceId="main"
          dataModel={{ items: [{ name: 'First' }] }}
        >
          <ScopeProvider basePath="/items/0">
            <Test />
          </ScopeProvider>
        </SurfaceSetup>
      </SurfaceProvider>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('First')

    act(() => {
      screen.getByTestId('update').click()
    })

    expect(screen.getByTestId('value')).toHaveTextContent('Updated')
  })
})
