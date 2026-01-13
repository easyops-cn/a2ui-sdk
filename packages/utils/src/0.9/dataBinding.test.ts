/**
 * dataBinding Tests
 *
 * Tests for data binding utility functions used in A2UI 0.9.
 */

import { describe, it, expect } from 'vitest'
import {
  isPathBinding,
  isFunctionCall,
  resolveValue,
  resolveString,
  resolveContext,
} from './dataBinding.js'
import type { DataModel, FormBindableValue } from '@a2ui-sdk/types/0.9'

describe('dataBinding', () => {
  const testModel: DataModel = {
    user: {
      name: 'John',
      age: 30,
      active: true,
    },
    items: ['a', 'b', 'c'],
    count: 42,
  }

  describe('isPathBinding', () => {
    it('should return true for path binding object', () => {
      expect(isPathBinding({ path: '/user/name' })).toBe(true)
    })

    it('should return true for relative path binding', () => {
      expect(isPathBinding({ path: 'name' })).toBe(true)
    })

    it('should return false for string literal', () => {
      expect(isPathBinding('Hello')).toBe(false)
    })

    it('should return false for number literal', () => {
      expect(isPathBinding(42)).toBe(false)
    })

    it('should return false for boolean literal', () => {
      expect(isPathBinding(true)).toBe(false)
    })

    it('should return false for function call', () => {
      expect(isPathBinding({ call: 'required' })).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isPathBinding(undefined)).toBe(false)
    })

    it('should return false for null', () => {
      expect(isPathBinding(null)).toBe(false)
    })

    it('should return false for object without path property', () => {
      expect(
        isPathBinding({ other: 'value' } as unknown as FormBindableValue)
      ).toBe(false)
    })
  })

  describe('isFunctionCall', () => {
    it('should return true for function call object', () => {
      expect(isFunctionCall({ call: 'required' })).toBe(true)
    })

    it('should return true for function call with args', () => {
      expect(isFunctionCall({ call: 'regex', args: { pattern: '.*' } })).toBe(
        true
      )
    })

    it('should return false for path binding', () => {
      expect(isFunctionCall({ path: '/user/name' })).toBe(false)
    })

    it('should return false for string literal', () => {
      expect(isFunctionCall('Hello')).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isFunctionCall(undefined)).toBe(false)
    })

    it('should return false for null', () => {
      expect(isFunctionCall(null)).toBe(false)
    })
  })

  // Note: hasInterpolation is now an internal function (not exported)
  // Tests for interpolation behavior are in interpolation.test.ts

  describe('resolveValue', () => {
    it('should resolve string literal', () => {
      expect(resolveValue('Hello', testModel)).toBe('Hello')
    })

    it('should resolve number literal', () => {
      expect(resolveValue(42, testModel)).toBe(42)
    })

    it('should resolve boolean literal', () => {
      expect(resolveValue(true, testModel)).toBe(true)
      expect(resolveValue(false, testModel)).toBe(false)
    })

    it('should resolve absolute path binding', () => {
      expect(resolveValue({ path: '/user/name' }, testModel)).toBe('John')
    })

    it('should resolve nested path binding', () => {
      expect(resolveValue({ path: '/user/age' }, testModel)).toBe(30)
    })

    it('should resolve relative path binding with base path', () => {
      expect(resolveValue({ path: 'name' }, testModel, '/user')).toBe('John')
    })

    it('should resolve absolute path even with base path', () => {
      expect(resolveValue({ path: '/count' }, testModel, '/user')).toBe(42)
    })

    it('should return default for undefined value', () => {
      expect(resolveValue(undefined, testModel, null, 'default')).toBe(
        'default'
      )
    })

    it('should return default for null value', () => {
      expect(resolveValue(null, testModel, null, 'default')).toBe('default')
    })

    it('should return default for non-existent path', () => {
      expect(
        resolveValue({ path: '/nonexistent' }, testModel, null, 'default')
      ).toBe('default')
    })

    it('should return default for function call', () => {
      expect(
        resolveValue({ call: 'required' }, testModel, null, 'default')
      ).toBe('default')
    })

    it('should resolve array element by index', () => {
      expect(resolveValue({ path: '/items/0' }, testModel)).toBe('a')
    })
  })

  describe('resolveString', () => {
    it('should resolve string literal', () => {
      expect(resolveString('Hello', testModel)).toBe('Hello')
    })

    it('should resolve path binding to string', () => {
      expect(resolveString({ path: '/user/name' }, testModel)).toBe('John')
    })

    it('should convert number to string', () => {
      expect(resolveString({ path: '/count' }, testModel)).toBe('42')
    })

    it('should return default for undefined', () => {
      expect(resolveString(undefined, testModel, null, 'default')).toBe(
        'default'
      )
    })

    it('should return empty string as default', () => {
      expect(resolveString(undefined, testModel)).toBe('')
    })
  })

  describe('resolveContext', () => {
    it('should resolve context with literal values', () => {
      const context = {
        name: 'John',
        age: 30,
        active: true,
      }
      expect(resolveContext(context, testModel)).toEqual({
        name: 'John',
        age: 30,
        active: true,
      })
    })

    it('should resolve context with path bindings', () => {
      const context = {
        name: { path: '/user/name' },
        age: { path: '/user/age' },
      }
      expect(resolveContext(context, testModel)).toEqual({
        name: 'John',
        age: 30,
      })
    })

    it('should resolve context with mixed values', () => {
      const context = {
        userName: { path: '/user/name' },
        action: 'submit',
        count: 42,
      }
      expect(resolveContext(context, testModel)).toEqual({
        userName: 'John',
        action: 'submit',
        count: 42,
      })
    })

    it('should resolve relative paths with base path', () => {
      const context = {
        name: { path: 'name' },
      }
      expect(resolveContext(context, testModel, '/user')).toEqual({
        name: 'John',
      })
    })

    it('should return empty object for undefined context', () => {
      expect(resolveContext(undefined, testModel)).toEqual({})
    })

    it('should handle non-existent paths', () => {
      const context = {
        name: { path: '/nonexistent' },
      }
      expect(resolveContext(context, testModel)).toEqual({
        name: undefined,
      })
    })
  })
})
