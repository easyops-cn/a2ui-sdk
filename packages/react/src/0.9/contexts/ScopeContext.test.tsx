/**
 * ScopeContext Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScopeProvider, useScope, useScopeBasePath } from './ScopeContext'

// Test component that displays scope info
function ScopeDisplay() {
  const scope = useScope()
  return (
    <div>
      <span data-testid="basePath">{scope.basePath ?? 'null'}</span>
    </div>
  )
}

// Test component using the helper hook
function BasePathDisplay() {
  const basePath = useScopeBasePath()
  return <span data-testid="hookBasePath">{basePath ?? 'null'}</span>
}

describe('ScopeContext', () => {
  describe('default value', () => {
    it('should provide null basePath by default', () => {
      render(<ScopeDisplay />)
      expect(screen.getByTestId('basePath')).toHaveTextContent('null')
    })
  })

  describe('ScopeProvider', () => {
    it('should provide the specified basePath', () => {
      render(
        <ScopeProvider basePath="/items/0">
          <ScopeDisplay />
        </ScopeProvider>
      )
      expect(screen.getByTestId('basePath')).toHaveTextContent('/items/0')
    })

    it('should support nested providers', () => {
      render(
        <ScopeProvider basePath="/items">
          <div data-testid="outer">
            <ScopeDisplay />
          </div>
          <ScopeProvider basePath="/items/0">
            <div data-testid="inner">
              <ScopeDisplay />
            </div>
          </ScopeProvider>
        </ScopeProvider>
      )

      const displays = screen.getAllByTestId('basePath')
      expect(displays[0]).toHaveTextContent('/items')
      expect(displays[1]).toHaveTextContent('/items/0')
    })

    it('should handle deeply nested providers', () => {
      render(
        <ScopeProvider basePath="/users">
          <ScopeProvider basePath="/users/0">
            <ScopeProvider basePath="/users/0/profile">
              <ScopeDisplay />
            </ScopeProvider>
          </ScopeProvider>
        </ScopeProvider>
      )
      expect(screen.getByTestId('basePath')).toHaveTextContent(
        '/users/0/profile'
      )
    })
  })

  describe('useScope', () => {
    it('should return the current scope value', () => {
      render(
        <ScopeProvider basePath="/test">
          <ScopeDisplay />
        </ScopeProvider>
      )
      expect(screen.getByTestId('basePath')).toHaveTextContent('/test')
    })
  })

  describe('useScopeBasePath', () => {
    it('should return null for root scope', () => {
      render(<BasePathDisplay />)
      expect(screen.getByTestId('hookBasePath')).toHaveTextContent('null')
    })

    it('should return basePath within provider', () => {
      render(
        <ScopeProvider basePath="/items/2">
          <BasePathDisplay />
        </ScopeProvider>
      )
      expect(screen.getByTestId('hookBasePath')).toHaveTextContent('/items/2')
    })
  })
})
