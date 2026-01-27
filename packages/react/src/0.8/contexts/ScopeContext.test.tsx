/**
 * ScopeContext Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScopeProvider, useScope, useScopeBasePath } from './ScopeContext'

describe('ScopeContext', () => {
  describe('useScope', () => {
    it('should return null basePath by default (root scope)', () => {
      function TestComponent() {
        const { basePath } = useScope()
        return (
          <div data-testid="result">
            {basePath === null ? 'root' : basePath}
          </div>
        )
      }

      render(<TestComponent />)
      expect(screen.getByTestId('result')).toHaveTextContent('root')
    })

    it('should return basePath from ScopeProvider', () => {
      function TestComponent() {
        const { basePath } = useScope()
        return <div data-testid="result">{basePath}</div>
      }

      render(
        <ScopeProvider basePath="/items/0">
          <TestComponent />
        </ScopeProvider>
      )
      expect(screen.getByTestId('result')).toHaveTextContent('/items/0')
    })

    it('should support nested ScopeProviders', () => {
      function TestComponent() {
        const { basePath } = useScope()
        return <div data-testid="result">{basePath}</div>
      }

      render(
        <ScopeProvider basePath="/items/0">
          <ScopeProvider basePath="/items/0/children/1">
            <TestComponent />
          </ScopeProvider>
        </ScopeProvider>
      )
      expect(screen.getByTestId('result')).toHaveTextContent(
        '/items/0/children/1'
      )
    })

    it('should isolate scopes between sibling components', () => {
      function TestComponent({ testId }: { testId: string }) {
        const { basePath } = useScope()
        return <div data-testid={testId}>{basePath}</div>
      }

      render(
        <>
          <ScopeProvider basePath="/items/0">
            <TestComponent testId="item-0" />
          </ScopeProvider>
          <ScopeProvider basePath="/items/1">
            <TestComponent testId="item-1" />
          </ScopeProvider>
        </>
      )

      expect(screen.getByTestId('item-0')).toHaveTextContent('/items/0')
      expect(screen.getByTestId('item-1')).toHaveTextContent('/items/1')
    })
  })

  describe('useScopeBasePath', () => {
    it('should return null for root scope', () => {
      function TestComponent() {
        const basePath = useScopeBasePath()
        return (
          <div data-testid="result">
            {basePath === null ? 'root' : basePath}
          </div>
        )
      }

      render(<TestComponent />)
      expect(screen.getByTestId('result')).toHaveTextContent('root')
    })

    it('should return basePath string from ScopeProvider', () => {
      function TestComponent() {
        const basePath = useScopeBasePath()
        return <div data-testid="result">{basePath}</div>
      }

      render(
        <ScopeProvider basePath="/user/profile">
          <TestComponent />
        </ScopeProvider>
      )
      expect(screen.getByTestId('result')).toHaveTextContent('/user/profile')
    })

    it('should return innermost basePath for nested providers', () => {
      function TestComponent() {
        const basePath = useScopeBasePath()
        return <div data-testid="result">{basePath}</div>
      }

      render(
        <ScopeProvider basePath="/outer">
          <ScopeProvider basePath="/outer/inner">
            <TestComponent />
          </ScopeProvider>
        </ScopeProvider>
      )
      expect(screen.getByTestId('result')).toHaveTextContent('/outer/inner')
    })
  })
})
