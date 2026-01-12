/**
 * Tests for SurfaceContext - Surface state management.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { SurfaceProvider, useSurfaceContext } from './SurfaceContext'
import type { Component } from '../types'

/**
 * Test component that exposes SurfaceContext methods.
 */
function TestConsumer({
  onContext,
}: {
  onContext: (ctx: ReturnType<typeof useSurfaceContext>) => void
}) {
  const context = useSurfaceContext()
  onContext(context)
  return <div data-testid="consumer">Consumer</div>
}

describe('SurfaceContext', () => {
  let contextRef: ReturnType<typeof useSurfaceContext>

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  const renderWithProvider = () => {
    render(
      <SurfaceProvider>
        <TestConsumer onContext={(ctx) => (contextRef = ctx)} />
      </SurfaceProvider>
    )
  }

  describe('useSurfaceContext', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        render(<TestConsumer onContext={() => {}} />)
      }).toThrow('useSurfaceContext must be used within a SurfaceProvider')
    })

    it('should provide context when used within provider', () => {
      renderWithProvider()
      expect(contextRef).toBeDefined()
      expect(contextRef.surfaces).toBeInstanceOf(Map)
    })
  })

  describe('createSurface', () => {
    it('should create a new surface', () => {
      renderWithProvider()

      act(() => {
        contextRef.createSurface('test-surface', 'catalog-1')
      })

      const surface = contextRef.getSurface('test-surface')
      expect(surface).toBeDefined()
      expect(surface?.surfaceId).toBe('test-surface')
      expect(surface?.catalogId).toBe('catalog-1')
      expect(surface?.created).toBe(true)
      expect(surface?.components).toBeInstanceOf(Map)
      expect(surface?.dataModel).toEqual({})
    })

    it('should log error and ignore duplicate surface creation', () => {
      renderWithProvider()

      act(() => {
        contextRef.createSurface('test-surface', 'catalog-1')
      })

      act(() => {
        contextRef.createSurface('test-surface', 'catalog-2')
      })

      expect(console.error).toHaveBeenCalledWith(
        '[A2UI 0.9] Surface "test-surface" already exists. Ignoring createSurface.'
      )

      // Original surface should remain unchanged
      const surface = contextRef.getSurface('test-surface')
      expect(surface?.catalogId).toBe('catalog-1')
    })

    it('should support multiple surfaces', () => {
      renderWithProvider()

      act(() => {
        contextRef.createSurface('surface-1', 'catalog-1')
        contextRef.createSurface('surface-2', 'catalog-2')
      })

      expect(contextRef.getSurface('surface-1')).toBeDefined()
      expect(contextRef.getSurface('surface-2')).toBeDefined()
      expect(contextRef.surfaces.size).toBe(2)
    })
  })

  describe('updateComponents', () => {
    it('should add components to existing surface', () => {
      renderWithProvider()

      act(() => {
        contextRef.createSurface('test-surface', 'catalog-1')
      })

      const components: Component[] = [
        { id: 'text-1', component: 'Text', text: 'Hello' },
        {
          id: 'btn-1',
          component: 'Button',
          child: 'text-1',
          action: { name: 'click' },
        },
      ]

      act(() => {
        contextRef.updateComponents('test-surface', components)
      })

      expect(contextRef.getComponent('test-surface', 'text-1')).toEqual(
        components[0]
      )
      expect(contextRef.getComponent('test-surface', 'btn-1')).toEqual(
        components[1]
      )
    })

    it('should update existing components (upsert semantics)', () => {
      renderWithProvider()

      act(() => {
        contextRef.createSurface('test-surface', 'catalog-1')
        contextRef.updateComponents('test-surface', [
          { id: 'text-1', component: 'Text', text: 'Original' },
        ])
      })

      act(() => {
        contextRef.updateComponents('test-surface', [
          { id: 'text-1', component: 'Text', text: 'Updated' },
        ])
      })

      const component = contextRef.getComponent('test-surface', 'text-1')
      expect(component).toEqual({
        id: 'text-1',
        component: 'Text',
        text: 'Updated',
      })
    })

    it('should warn when updating non-existent surface', () => {
      renderWithProvider()

      act(() => {
        contextRef.updateComponents('non-existent', [
          { id: 'text-1', component: 'Text', text: 'Hello' },
        ])
      })

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          'updateComponents called for non-existent surface'
        )
      )
    })
  })

  describe('updateDataModel', () => {
    it('should update data model at root path', () => {
      renderWithProvider()

      act(() => {
        contextRef.createSurface('test-surface', 'catalog-1')
      })

      act(() => {
        contextRef.updateDataModel('test-surface', '/', {
          user: { name: 'Alice' },
        })
      })

      expect(contextRef.getDataModel('test-surface')).toEqual({
        user: { name: 'Alice' },
      })
    })

    it('should update data model at nested path', () => {
      renderWithProvider()

      act(() => {
        contextRef.createSurface('test-surface', 'catalog-1')
        contextRef.updateDataModel('test-surface', '/', { user: {} })
      })

      act(() => {
        contextRef.updateDataModel('test-surface', '/user/name', 'Bob')
      })

      expect(contextRef.getDataModel('test-surface')).toEqual({
        user: { name: 'Bob' },
      })
    })

    it('should default to root path when path is omitted', () => {
      renderWithProvider()

      act(() => {
        contextRef.createSurface('test-surface', 'catalog-1')
      })

      act(() => {
        contextRef.updateDataModel('test-surface', undefined, { key: 'value' })
      })

      expect(contextRef.getDataModel('test-surface')).toEqual({ key: 'value' })
    })

    it('should warn when updating non-existent surface', () => {
      renderWithProvider()

      act(() => {
        contextRef.updateDataModel('non-existent', '/path', 'value')
      })

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          'updateDataModel called for non-existent surface'
        )
      )
    })
  })

  describe('deleteSurface', () => {
    it('should delete an existing surface', () => {
      renderWithProvider()

      act(() => {
        contextRef.createSurface('test-surface', 'catalog-1')
      })

      expect(contextRef.getSurface('test-surface')).toBeDefined()

      act(() => {
        contextRef.deleteSurface('test-surface')
      })

      expect(contextRef.getSurface('test-surface')).toBeUndefined()
    })

    it('should handle deleting non-existent surface gracefully', () => {
      renderWithProvider()

      act(() => {
        contextRef.deleteSurface('non-existent')
      })

      // Should not throw
      expect(contextRef.surfaces.size).toBe(0)
    })
  })

  describe('getSurface', () => {
    it('should return surface when it exists', () => {
      renderWithProvider()

      act(() => {
        contextRef.createSurface('test-surface', 'catalog-1')
      })

      const surface = contextRef.getSurface('test-surface')
      expect(surface).toBeDefined()
      expect(surface?.surfaceId).toBe('test-surface')
    })

    it('should return undefined for non-existent surface', () => {
      renderWithProvider()
      expect(contextRef.getSurface('non-existent')).toBeUndefined()
    })
  })

  describe('getComponent', () => {
    it('should return component when it exists', () => {
      renderWithProvider()

      act(() => {
        contextRef.createSurface('test-surface', 'catalog-1')
        contextRef.updateComponents('test-surface', [
          { id: 'text-1', component: 'Text', text: 'Hello' },
        ])
      })

      const component = contextRef.getComponent('test-surface', 'text-1')
      expect(component).toEqual({
        id: 'text-1',
        component: 'Text',
        text: 'Hello',
      })
    })

    it('should return undefined for non-existent component', () => {
      renderWithProvider()

      act(() => {
        contextRef.createSurface('test-surface', 'catalog-1')
      })

      expect(
        contextRef.getComponent('test-surface', 'non-existent')
      ).toBeUndefined()
    })

    it('should return undefined for non-existent surface', () => {
      renderWithProvider()
      expect(contextRef.getComponent('non-existent', 'text-1')).toBeUndefined()
    })
  })

  describe('getDataModel', () => {
    it('should return data model for surface', () => {
      renderWithProvider()

      act(() => {
        contextRef.createSurface('test-surface', 'catalog-1')
        contextRef.updateDataModel('test-surface', '/', { key: 'value' })
      })

      expect(contextRef.getDataModel('test-surface')).toEqual({ key: 'value' })
    })

    it('should return empty object for non-existent surface', () => {
      renderWithProvider()
      expect(contextRef.getDataModel('non-existent')).toEqual({})
    })
  })

  describe('setDataValue', () => {
    it('should set value at path in data model', () => {
      renderWithProvider()

      act(() => {
        contextRef.createSurface('test-surface', 'catalog-1')
      })

      act(() => {
        contextRef.setDataValue('test-surface', '/user/name', 'Alice')
      })

      expect(contextRef.getDataModel('test-surface')).toEqual({
        user: { name: 'Alice' },
      })
    })

    it('should update existing values', () => {
      renderWithProvider()

      act(() => {
        contextRef.createSurface('test-surface', 'catalog-1')
        contextRef.setDataValue('test-surface', '/count', 1)
      })

      act(() => {
        contextRef.setDataValue('test-surface', '/count', 2)
      })

      expect(contextRef.getDataModel('test-surface')).toEqual({ count: 2 })
    })
  })

  describe('clearSurfaces', () => {
    it('should remove all surfaces', () => {
      renderWithProvider()

      act(() => {
        contextRef.createSurface('surface-1', 'catalog-1')
        contextRef.createSurface('surface-2', 'catalog-2')
      })

      expect(contextRef.surfaces.size).toBe(2)

      act(() => {
        contextRef.clearSurfaces()
      })

      expect(contextRef.surfaces.size).toBe(0)
    })
  })
})
