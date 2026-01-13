/**
 * pathUtils Tests
 *
 * Tests for path utility functions used in A2UI 0.9 data model operations.
 */

import { describe, it, expect } from 'vitest'
import {
  parseJsonPointer,
  getValueByPath,
  setValueByPath,
  normalizePath,
  isAbsolutePath,
  resolvePath,
  joinPaths,
} from './pathUtils.js'
import type { DataModel } from '@a2ui-sdk/types/0.9'

describe('pathUtils', () => {
  describe('parseJsonPointer', () => {
    it('should return empty array for empty path', () => {
      expect(parseJsonPointer('')).toEqual([])
    })

    it('should return empty array for root path', () => {
      expect(parseJsonPointer('/')).toEqual([])
    })

    it('should parse simple path', () => {
      expect(parseJsonPointer('/user')).toEqual(['user'])
    })

    it('should parse nested path', () => {
      expect(parseJsonPointer('/user/name')).toEqual(['user', 'name'])
    })

    it('should parse path with array index', () => {
      expect(parseJsonPointer('/items/0')).toEqual(['items', '0'])
    })

    it('should parse deeply nested path', () => {
      expect(parseJsonPointer('/a/b/c/d')).toEqual(['a', 'b', 'c', 'd'])
    })

    it('should unescape ~1 to /', () => {
      expect(parseJsonPointer('/a~1b')).toEqual(['a/b'])
    })

    it('should unescape ~0 to ~', () => {
      expect(parseJsonPointer('/m~0n')).toEqual(['m~n'])
    })

    it('should handle combined escapes', () => {
      expect(parseJsonPointer('/~0~1')).toEqual(['~/'])
    })

    it('should handle path without leading slash', () => {
      expect(parseJsonPointer('user/name')).toEqual(['user', 'name'])
    })
  })

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
      nested: {
        array: [{ id: 1 }, { id: 2 }],
      },
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

    it('should get array element by index', () => {
      expect(getValueByPath(testModel, '/items/0')).toBe('a')
      expect(getValueByPath(testModel, '/items/1')).toBe('b')
      expect(getValueByPath(testModel, '/items/2')).toBe('c')
    })

    it('should get nested array element property', () => {
      expect(getValueByPath(testModel, '/nested/array/0/id')).toBe(1)
      expect(getValueByPath(testModel, '/nested/array/1/id')).toBe(2)
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

    it('should return undefined for out-of-bounds array index', () => {
      expect(getValueByPath(testModel, '/items/10')).toBeUndefined()
    })

    it('should return undefined for non-numeric array index', () => {
      expect(getValueByPath(testModel, '/items/foo')).toBeUndefined()
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

    it('should handle empty data model', () => {
      expect(getValueByPath({}, '/user/name')).toBeUndefined()
    })
  })

  describe('setValueByPath', () => {
    it('should replace entire model for root path with object value', () => {
      const model = { a: 1 }
      const result = setValueByPath(model, '/', { b: 2 })
      expect(result).toEqual({ b: 2 })
    })

    it('should return empty model for root path with undefined value', () => {
      const model = { a: 1 }
      const result = setValueByPath(model, '/', undefined)
      expect(result).toEqual({})
    })

    it('should return original model for root path with non-object value', () => {
      const model = { a: 1 }
      const result = setValueByPath(model, '/', 'string')
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

    it('should delete value with undefined', () => {
      const model = { a: 1, b: 2 }
      const result = setValueByPath(model, '/a', undefined)
      expect(result).toEqual({ b: 2 })
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
      const model: DataModel = {}
      const result = setValueByPath(
        model,
        '/user/profile/email',
        'test@test.com'
      )
      expect(result).toEqual({
        user: { profile: { email: 'test@test.com' } },
      })
    })

    it('should set array element', () => {
      const model = { items: ['a', 'b', 'c'] }
      const result = setValueByPath(model, '/items/1', 'x')
      expect(result).toEqual({ items: ['a', 'x', 'c'] })
    })

    it('should delete array element', () => {
      const model = { items: ['a', 'b', 'c'] }
      const result = setValueByPath(model, '/items/1', undefined)
      expect(result).toEqual({ items: ['a', 'c'] })
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
      const model: DataModel = { items: [] }
      const result = setValueByPath(model, '/items', ['a', 'b'])
      expect(result).toEqual({ items: ['a', 'b'] })
    })

    it('should handle setting object value', () => {
      const model = { user: null }
      const result = setValueByPath(model, '/user', { name: 'John' })
      expect(result).toEqual({ user: { name: 'John' } })
    })
  })

  describe('normalizePath', () => {
    it('should add leading slash if missing', () => {
      expect(normalizePath('user/name')).toBe('/user/name')
    })

    it('should keep existing leading slash', () => {
      expect(normalizePath('/user/name')).toBe('/user/name')
    })

    it('should remove trailing slash', () => {
      expect(normalizePath('/user/name/')).toBe('/user/name')
    })

    it('should keep single root slash', () => {
      expect(normalizePath('/')).toBe('/')
    })

    it('should add leading and remove trailing slash', () => {
      expect(normalizePath('user/name/')).toBe('/user/name')
    })

    it('should trim whitespace', () => {
      expect(normalizePath('  /user/name  ')).toBe('/user/name')
    })

    it('should handle empty string', () => {
      expect(normalizePath('')).toBe('/')
    })

    it('should handle whitespace only', () => {
      expect(normalizePath('   ')).toBe('/')
    })
  })

  describe('isAbsolutePath', () => {
    it('should return true for path starting with "/"', () => {
      expect(isAbsolutePath('/user/name')).toBe(true)
    })

    it('should return true for root path', () => {
      expect(isAbsolutePath('/')).toBe(true)
    })

    it('should return false for relative path', () => {
      expect(isAbsolutePath('user/name')).toBe(false)
    })

    it('should return false for simple name', () => {
      expect(isAbsolutePath('name')).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(isAbsolutePath('')).toBe(false)
    })
  })

  describe('resolvePath', () => {
    it('should return absolute path as-is', () => {
      expect(resolvePath('/user/name', '/items/0')).toBe('/user/name')
    })

    it('should resolve relative path against base path', () => {
      expect(resolvePath('name', '/items/0')).toBe('/items/0/name')
    })

    it('should resolve relative path against root scope', () => {
      expect(resolvePath('name', null)).toBe('/name')
    })

    it('should resolve relative path against "/" base', () => {
      expect(resolvePath('name', '/')).toBe('/name')
    })

    it('should handle complex relative path', () => {
      expect(resolvePath('profile/email', '/users/0')).toBe(
        '/users/0/profile/email'
      )
    })

    it('should normalize absolute path', () => {
      expect(resolvePath('/user/name/', '/items/0')).toBe('/user/name')
    })
  })

  describe('joinPaths', () => {
    it('should join base and relative paths', () => {
      expect(joinPaths('/user', 'name')).toBe('/user/name')
    })

    it('should handle leading slash in relative path', () => {
      expect(joinPaths('/user', '/name')).toBe('/user/name')
    })

    it('should handle trailing slash in base path', () => {
      expect(joinPaths('/user/', 'name')).toBe('/user/name')
    })

    it('should handle both leading and trailing slashes', () => {
      expect(joinPaths('/user/', '/name/')).toBe('/user/name')
    })

    it('should return base path for empty relative path', () => {
      expect(joinPaths('/user', '')).toBe('/user')
    })

    it('should handle root base path', () => {
      expect(joinPaths('/', 'user')).toBe('/user')
    })

    it('should handle root base path with leading slash in relative', () => {
      expect(joinPaths('/', '/user')).toBe('/user')
    })

    it('should normalize base path without leading slash', () => {
      expect(joinPaths('user', 'name')).toBe('/user/name')
    })

    it('should handle multi-segment relative path', () => {
      expect(joinPaths('/base', 'a/b/c')).toBe('/base/a/b/c')
    })

    it('should handle whitespace in relative path', () => {
      expect(joinPaths('/user', '  name  ')).toBe('/user/name')
    })
  })
})
