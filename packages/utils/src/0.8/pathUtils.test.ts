/**
 * pathUtils Tests
 *
 * Tests for path utility functions used in A2UI data model operations.
 */

import { describe, it, expect } from 'vitest'
import {
  getValueByPath,
  setValueByPath,
  mergeAtPath,
  normalizePath,
  isAbsolutePath,
  joinPaths,
  resolvePath,
} from './pathUtils.js'
import type { DataModel } from '@a2ui-sdk/types/0.8'

describe('pathUtils', () => {
  describe('getValueByPath', () => {
    const testModel: DataModel = {
      user: {
        name: 'John',
        age: 30,
        profile: {
          email: 'john@example.com',
          active: true,
        },
      },
      items: ['a', 'b', 'c'],
      count: 42,
    }

    it('should return entire data model for empty path', () => {
      expect(getValueByPath(testModel, '')).toEqual(testModel)
    })

    it('should return entire data model for root path', () => {
      expect(getValueByPath(testModel, '/')).toEqual(testModel)
    })

    it('should get top-level string value', () => {
      const model = { name: 'test' }
      expect(getValueByPath(model, '/name')).toBe('test')
    })

    it('should get top-level number value', () => {
      expect(getValueByPath(testModel, '/count')).toBe(42)
    })

    it('should get top-level array value', () => {
      expect(getValueByPath(testModel, '/items')).toEqual(['a', 'b', 'c'])
    })

    it('should get nested object value', () => {
      expect(getValueByPath(testModel, '/user')).toEqual({
        name: 'John',
        age: 30,
        profile: {
          email: 'john@example.com',
          active: true,
        },
      })
    })

    it('should get deeply nested string value', () => {
      expect(getValueByPath(testModel, '/user/name')).toBe('John')
    })

    it('should get deeply nested number value', () => {
      expect(getValueByPath(testModel, '/user/age')).toBe(30)
    })

    it('should get deeply nested object value', () => {
      expect(getValueByPath(testModel, '/user/profile')).toEqual({
        email: 'john@example.com',
        active: true,
      })
    })

    it('should get very deeply nested value', () => {
      expect(getValueByPath(testModel, '/user/profile/email')).toBe(
        'john@example.com'
      )
      expect(getValueByPath(testModel, '/user/profile/active')).toBe(true)
    })

    it('should return undefined for non-existent path', () => {
      expect(getValueByPath(testModel, '/nonexistent')).toBeUndefined()
    })

    it('should return undefined for non-existent nested path', () => {
      expect(getValueByPath(testModel, '/user/nonexistent')).toBeUndefined()
    })

    it('should return undefined for path through non-object', () => {
      expect(getValueByPath(testModel, '/count/nested')).toBeUndefined()
    })

    it('should return undefined when intermediate value is null', () => {
      const model = { user: null }
      expect(getValueByPath(model, '/user/name')).toBeUndefined()
    })

    it('should return undefined when intermediate value is undefined', () => {
      const model = { user: undefined }
      expect(
        getValueByPath(model as unknown as DataModel, '/user/name')
      ).toBeUndefined()
    })

    it('should handle paths without leading slash', () => {
      expect(getValueByPath(testModel, 'user/name')).toBe('John')
    })

    it('should handle empty data model', () => {
      expect(getValueByPath({}, '/user/name')).toBeUndefined()
    })
  })

  describe('setValueByPath', () => {
    it('should return merged object for empty path with object value', () => {
      const model = { a: 1 }
      const result = setValueByPath(model, '', { b: 2 })
      expect(result).toEqual({ a: 1, b: 2 })
    })

    it('should return merged object for root path with object value', () => {
      const model = { a: 1 }
      const result = setValueByPath(model, '/', { b: 2 })
      expect(result).toEqual({ a: 1, b: 2 })
    })

    it('should return original model for root path with non-object value', () => {
      const model = { a: 1 }
      const result = setValueByPath(model, '/', 'string')
      expect(result).toEqual({ a: 1 })
    })

    it('should return original model for root path with array value', () => {
      const model = { a: 1 }
      const result = setValueByPath(model, '/', [1, 2, 3])
      expect(result).toEqual({ a: 1 })
    })

    it('should set top-level value', () => {
      const model = { a: 1 }
      const result = setValueByPath(model, '/b', 2)
      expect(result).toEqual({ a: 1, b: 2 })
    })

    it('should update existing top-level value', () => {
      const model = { a: 1 }
      const result = setValueByPath(model, '/a', 2)
      expect(result).toEqual({ a: 2 })
    })

    it('should set nested value in existing object', () => {
      const model = { user: { name: 'John' } }
      const result = setValueByPath(model, '/user/age', 30)
      expect(result).toEqual({ user: { name: 'John', age: 30 } })
    })

    it('should update existing nested value', () => {
      const model = { user: { name: 'John' } }
      const result = setValueByPath(model, '/user/name', 'Jane')
      expect(result).toEqual({ user: { name: 'Jane' } })
    })

    it('should create nested structure if not exists', () => {
      const model = {}
      const result = setValueByPath(
        model,
        '/user/profile/email',
        'test@test.com'
      )
      expect(result).toEqual({
        user: { profile: { email: 'test@test.com' } },
      })
    })

    it('should replace non-object with object when setting nested path', () => {
      const model = { user: 'string' }
      const result = setValueByPath(model, '/user/name', 'John')
      expect(result).toEqual({ user: { name: 'John' } })
    })

    it('should be immutable - not modify original model', () => {
      const model = { user: { name: 'John' } }
      const result = setValueByPath(model, '/user/name', 'Jane')
      expect(model).toEqual({ user: { name: 'John' } })
      expect(result).toEqual({ user: { name: 'Jane' } })
    })

    it('should handle setting null value', () => {
      const model = { user: { name: 'John' } }
      const result = setValueByPath(model, '/user/name', null)
      expect(result).toEqual({ user: { name: null } })
    })

    it('should handle setting array value', () => {
      const model = { items: [] }
      const result = setValueByPath(model, '/items', ['a', 'b'])
      expect(result).toEqual({ items: ['a', 'b'] })
    })

    it('should handle setting object value', () => {
      const model = { user: null }
      const result = setValueByPath(model, '/user', { name: 'John' })
      expect(result).toEqual({ user: { name: 'John' } })
    })
  })

  describe('mergeAtPath', () => {
    it('should merge at root for empty path', () => {
      const model = { a: 1 }
      const result = mergeAtPath(model, '', { b: 2 })
      expect(result).toEqual({ a: 1, b: 2 })
    })

    it('should merge at root for root path', () => {
      const model = { a: 1 }
      const result = mergeAtPath(model, '/', { b: 2 })
      expect(result).toEqual({ a: 1, b: 2 })
    })

    it('should overwrite existing keys at root', () => {
      const model = { a: 1, b: 2 }
      const result = mergeAtPath(model, '/', { b: 3, c: 4 })
      expect(result).toEqual({ a: 1, b: 3, c: 4 })
    })

    it('should merge at nested path', () => {
      const model = { user: { name: 'John' } }
      const result = mergeAtPath(model, '/user', { age: 30 })
      expect(result).toEqual({ user: { name: 'John', age: 30 } })
    })

    it('should overwrite existing keys at nested path', () => {
      const model = { user: { name: 'John', age: 25 } }
      const result = mergeAtPath(model, '/user', { age: 30 })
      expect(result).toEqual({ user: { name: 'John', age: 30 } })
    })

    it('should create path if not exists', () => {
      const model = {}
      const result = mergeAtPath(model, '/user', { name: 'John' })
      expect(result).toEqual({ user: { name: 'John' } })
    })

    it('should replace non-object at path with merged result', () => {
      const model = { user: 'string' }
      const result = mergeAtPath(model, '/user', { name: 'John' })
      expect(result).toEqual({ user: { name: 'John' } })
    })

    it('should handle array at path by treating as non-object', () => {
      const model = { items: [1, 2, 3] }
      const result = mergeAtPath(model, '/items', { a: 1 })
      expect(result).toEqual({ items: { a: 1 } })
    })

    it('should be immutable - not modify original model', () => {
      const model = { user: { name: 'John' } }
      const result = mergeAtPath(model, '/user', { age: 30 })
      expect(model).toEqual({ user: { name: 'John' } })
      expect(result).toEqual({ user: { name: 'John', age: 30 } })
    })
  })

  describe('normalizePath', () => {
    it('should add leading slash to relative paths', () => {
      expect(normalizePath('user/name')).toBe('/user/name')
      expect(normalizePath('items')).toBe('/items')
    })

    it('should keep leading slash for absolute paths', () => {
      expect(normalizePath('/user/name')).toBe('/user/name')
      expect(normalizePath('/items')).toBe('/items')
    })

    it('should remove trailing slash', () => {
      expect(normalizePath('/items/')).toBe('/items')
      expect(normalizePath('/user/profile/')).toBe('/user/profile')
      expect(normalizePath('items/')).toBe('/items')
    })

    it('should handle root path', () => {
      expect(normalizePath('/')).toBe('/')
      expect(normalizePath('')).toBe('/')
    })

    it('should handle paths with multiple slashes', () => {
      expect(normalizePath('/user//name')).toBe('/user//name')
    })
  })

  describe('isAbsolutePath', () => {
    it('should return true for absolute paths', () => {
      expect(isAbsolutePath('/user/name')).toBe(true)
      expect(isAbsolutePath('/items')).toBe(true)
      expect(isAbsolutePath('/')).toBe(true)
    })

    it('should return false for relative paths', () => {
      expect(isAbsolutePath('user/name')).toBe(false)
      expect(isAbsolutePath('name')).toBe(false)
      expect(isAbsolutePath('items')).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(isAbsolutePath('')).toBe(false)
    })
  })

  describe('joinPaths', () => {
    it('should join base path and relative path', () => {
      expect(joinPaths('/items/0', 'name')).toBe('/items/0/name')
      expect(joinPaths('/user', 'profile')).toBe('/user/profile')
    })

    it('should handle nested relative paths', () => {
      expect(joinPaths('/user', 'profile/age')).toBe('/user/profile/age')
      expect(joinPaths('/items/0', 'data/value')).toBe('/items/0/data/value')
    })

    it('should handle empty relative path', () => {
      expect(joinPaths('/items', '')).toBe('/items')
      expect(joinPaths('/user', '')).toBe('/user')
    })

    it('should normalize the result', () => {
      expect(joinPaths('/items/', 'name')).toBe('/items/name')
      expect(joinPaths('items', 'name')).toBe('/items/name')
    })

    it('should handle relative path with leading slash', () => {
      expect(joinPaths('/items/0', '/name')).toBe('/items/0/name')
    })
  })

  describe('resolvePath', () => {
    describe('with absolute paths', () => {
      it('should return absolute path unchanged', () => {
        expect(resolvePath('/user/name', '/items/0')).toBe('/user/name')
        expect(resolvePath('/data', '/items')).toBe('/data')
      })

      it('should ignore base path for absolute paths', () => {
        expect(resolvePath('/user/name', null)).toBe('/user/name')
        expect(resolvePath('/data', '/')).toBe('/data')
      })

      it('should normalize absolute paths', () => {
        expect(resolvePath('/user/name/', '/items')).toBe('/user/name')
      })
    })

    describe('with relative paths and null base path', () => {
      it('should treat relative path as absolute when base path is null', () => {
        expect(resolvePath('name', null)).toBe('/name')
        expect(resolvePath('user/profile', null)).toBe('/user/profile')
      })

      it('should treat relative path as absolute when base path is "/"', () => {
        expect(resolvePath('name', '/')).toBe('/name')
        expect(resolvePath('items', '/')).toBe('/items')
      })
    })

    describe('with relative paths and base path', () => {
      it('should resolve relative path against base path', () => {
        expect(resolvePath('name', '/items/0')).toBe('/items/0/name')
        expect(resolvePath('age', '/user')).toBe('/user/age')
      })

      it('should handle nested relative paths', () => {
        expect(resolvePath('profile/age', '/user')).toBe('/user/profile/age')
        expect(resolvePath('data/value', '/items/0')).toBe(
          '/items/0/data/value'
        )
      })

      it('should normalize the result', () => {
        expect(resolvePath('name/', '/items/0')).toBe('/items/0/name')
        expect(resolvePath('name', '/items/0/')).toBe('/items/0/name')
      })
    })

    describe('edge cases', () => {
      it('should handle empty relative path', () => {
        // Empty path with null basePath resolves to root
        expect(resolvePath('', null)).toBe('/')
        // Empty path with basePath resolves to the basePath (current scope)
        expect(resolvePath('', '/items')).toBe('/items')
      })

      it('should handle root path', () => {
        expect(resolvePath('/', '/items')).toBe('/')
        expect(resolvePath('/', null)).toBe('/')
      })
    })
  })
})
