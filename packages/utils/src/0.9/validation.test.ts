/**
 * Tests for validation utilities.
 */

import { describe, it, expect, vi } from 'vitest'
import {
  validationFunctions,
  evaluateCheckRule,
  evaluateChecks,
  resolveArgs,
  type EvaluationContext,
} from './validation.js'

describe('validationFunctions', () => {
  describe('required', () => {
    it('should fail for null', () => {
      expect(validationFunctions.required({ value: null })).toBe(false)
    })

    it('should fail for undefined', () => {
      expect(validationFunctions.required({ value: undefined })).toBe(false)
    })

    it('should fail for empty string', () => {
      expect(validationFunctions.required({ value: '' })).toBe(false)
    })

    it('should fail for whitespace-only string', () => {
      expect(validationFunctions.required({ value: '   ' })).toBe(false)
    })

    it('should pass for non-empty string', () => {
      expect(validationFunctions.required({ value: 'hello' })).toBe(true)
    })

    it('should pass for number zero', () => {
      expect(validationFunctions.required({ value: 0 })).toBe(true)
    })

    it('should pass for boolean false', () => {
      expect(validationFunctions.required({ value: false })).toBe(true)
    })

    it('should fail for empty array', () => {
      expect(validationFunctions.required({ value: [] })).toBe(false)
    })

    it('should pass for non-empty array', () => {
      expect(validationFunctions.required({ value: [1, 2] })).toBe(true)
    })
  })

  describe('email', () => {
    it('should pass for valid email', () => {
      expect(validationFunctions.email({ value: 'test@example.com' })).toBe(
        true
      )
    })

    it('should pass for email with subdomain', () => {
      expect(
        validationFunctions.email({ value: 'test@mail.example.com' })
      ).toBe(true)
    })

    it('should fail for missing @', () => {
      expect(validationFunctions.email({ value: 'testexample.com' })).toBe(
        false
      )
    })

    it('should fail for missing domain', () => {
      expect(validationFunctions.email({ value: 'test@' })).toBe(false)
    })

    it('should fail for missing local part', () => {
      expect(validationFunctions.email({ value: '@example.com' })).toBe(false)
    })

    it('should fail for non-string value', () => {
      expect(validationFunctions.email({ value: 123 })).toBe(false)
    })
  })

  describe('regex', () => {
    it('should pass when pattern matches', () => {
      expect(
        validationFunctions.regex({
          value: 'hello123',
          pattern: '^[a-z]+\\d+$',
        })
      ).toBe(true)
    })

    it('should fail when pattern does not match', () => {
      expect(
        validationFunctions.regex({
          value: '123hello',
          pattern: '^[a-z]+\\d+$',
        })
      ).toBe(false)
    })

    it('should fail for non-string value', () => {
      expect(validationFunctions.regex({ value: 123, pattern: '\\d+' })).toBe(
        false
      )
    })

    it('should fail for invalid regex pattern', () => {
      expect(
        validationFunctions.regex({ value: 'test', pattern: '[invalid' })
      ).toBe(false)
    })

    it('should fail for non-string pattern', () => {
      expect(validationFunctions.regex({ value: 'test', pattern: 123 })).toBe(
        false
      )
    })
  })

  describe('length', () => {
    it('should pass when length is within bounds', () => {
      expect(
        validationFunctions.length({ value: 'hello', min: 3, max: 10 })
      ).toBe(true)
    })

    it('should fail when length is below min', () => {
      expect(validationFunctions.length({ value: 'hi', min: 3, max: 10 })).toBe(
        false
      )
    })

    it('should fail when length is above max', () => {
      expect(
        validationFunctions.length({ value: 'hello world!', min: 3, max: 10 })
      ).toBe(false)
    })

    it('should pass when only min is specified', () => {
      expect(validationFunctions.length({ value: 'hello', min: 3 })).toBe(true)
    })

    it('should pass when only max is specified', () => {
      expect(validationFunctions.length({ value: 'hi', max: 5 })).toBe(true)
    })

    it('should pass with no constraints', () => {
      expect(validationFunctions.length({ value: 'anything' })).toBe(true)
    })

    it('should handle null/undefined value as empty string', () => {
      expect(validationFunctions.length({ value: null, min: 0 })).toBe(true)
      expect(validationFunctions.length({ value: undefined, min: 1 })).toBe(
        false
      )
    })
  })

  describe('numeric', () => {
    it('should pass for valid number within bounds', () => {
      expect(validationFunctions.numeric({ value: 5, min: 0, max: 10 })).toBe(
        true
      )
    })

    it('should fail for number below min', () => {
      expect(validationFunctions.numeric({ value: -1, min: 0, max: 10 })).toBe(
        false
      )
    })

    it('should fail for number above max', () => {
      expect(validationFunctions.numeric({ value: 15, min: 0, max: 10 })).toBe(
        false
      )
    })

    it('should pass for string number within bounds', () => {
      expect(validationFunctions.numeric({ value: '5', min: 0, max: 10 })).toBe(
        true
      )
    })

    it('should fail for non-numeric string', () => {
      expect(
        validationFunctions.numeric({ value: 'hello', min: 0, max: 10 })
      ).toBe(false)
    })

    it('should pass with no constraints', () => {
      expect(validationFunctions.numeric({ value: 100 })).toBe(true)
    })
  })
})

describe('resolveArgs', () => {
  it('should resolve path bindings', () => {
    const args = { value: { path: '/user/name' } }
    const dataModel = { user: { name: 'Alice' } }

    const result = resolveArgs(args, dataModel, null)

    expect(result).toEqual({ value: 'Alice' })
  })

  it('should pass through literal values', () => {
    const args = { min: 0, max: 10, pattern: '^[a-z]+$' }

    const result = resolveArgs(args, {}, null)

    expect(result).toEqual({ min: 0, max: 10, pattern: '^[a-z]+$' })
  })

  it('should resolve relative paths with scope', () => {
    const args = { value: { path: 'name' } }
    const dataModel = { users: [{ name: 'Alice' }, { name: 'Bob' }] }

    const result = resolveArgs(args, dataModel, '/users/0')

    expect(result).toEqual({ value: 'Alice' })
  })

  it('should return empty object for undefined args', () => {
    expect(resolveArgs(undefined, {}, null)).toEqual({})
  })
})

describe('evaluateCheckRule', () => {
  const baseContext: EvaluationContext = {
    dataModel: {},
    basePath: null,
  }

  describe('function calls', () => {
    it('should evaluate a simple function call', () => {
      const rule = {
        call: 'required',
        args: { value: 'hello' },
        message: 'Required',
      }
      const context: EvaluationContext = {
        dataModel: {},
        basePath: null,
      }

      expect(evaluateCheckRule(rule, context)).toBe(true)
    })

    it('should fail for failing validation', () => {
      const rule = {
        call: 'required',
        args: { value: '' },
        message: 'Required',
      }

      expect(evaluateCheckRule(rule, baseContext)).toBe(false)
    })

    it('should resolve path bindings in args', () => {
      const rule = {
        call: 'required',
        args: { value: { path: '/user/email' } },
        message: 'Email required',
      }
      const context: EvaluationContext = {
        dataModel: { user: { email: 'test@example.com' } },
        basePath: null,
      }

      expect(evaluateCheckRule(rule, context)).toBe(true)
    })
  })

  describe('boolean constants', () => {
    it('should return true for { true: true }', () => {
      const rule = { true: true as const, message: 'Always pass' }
      expect(evaluateCheckRule(rule, baseContext)).toBe(true)
    })

    it('should return false for { false: false }', () => {
      const rule = { false: false as const, message: 'Always fail' }
      expect(evaluateCheckRule(rule, baseContext)).toBe(false)
    })
  })

  describe('logical operators', () => {
    it('should handle AND with all passing', () => {
      const rule = {
        and: [
          { call: 'required', args: { value: 'a' }, message: 'a required' },
          { call: 'required', args: { value: 'b' }, message: 'b required' },
        ],
        message: 'All required',
      }

      expect(evaluateCheckRule(rule, baseContext)).toBe(true)
    })

    it('should handle AND with one failing', () => {
      const rule = {
        and: [
          { call: 'required', args: { value: 'a' }, message: 'a required' },
          { call: 'required', args: { value: '' }, message: 'b required' },
        ],
        message: 'All required',
      }

      expect(evaluateCheckRule(rule, baseContext)).toBe(false)
    })

    it('should handle OR with one passing', () => {
      const rule = {
        or: [
          { call: 'required', args: { value: '' }, message: 'a required' },
          { call: 'required', args: { value: 'b' }, message: 'b required' },
        ],
        message: 'One required',
      }

      expect(evaluateCheckRule(rule, baseContext)).toBe(true)
    })

    it('should handle OR with all failing', () => {
      const rule = {
        or: [
          { call: 'required', args: { value: '' }, message: 'a required' },
          { call: 'required', args: { value: '' }, message: 'b required' },
        ],
        message: 'One required',
      }

      expect(evaluateCheckRule(rule, baseContext)).toBe(false)
    })

    it('should handle NOT', () => {
      const rule = {
        not: { call: 'required', args: { value: '' }, message: 'inner' },
        message: 'Should be empty',
      }

      expect(evaluateCheckRule(rule, baseContext)).toBe(true)
    })
  })

  describe('unknown functions', () => {
    it('should return true for unknown functions (with warning)', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const rule = {
        call: 'unknownFunction',
        args: { value: 'test' },
        message: 'Unknown',
      }

      expect(evaluateCheckRule(rule, baseContext)).toBe(true)
      expect(warnSpy).toHaveBeenCalledWith(
        '[A2UI] Unknown validation function: unknownFunction'
      )

      warnSpy.mockRestore()
    })
  })
})

describe('evaluateChecks', () => {
  it('should return valid=true for no checks', () => {
    const result = evaluateChecks(undefined, {}, null)
    expect(result).toEqual({ valid: true, errors: [] })
  })

  it('should return valid=true for empty checks array', () => {
    const result = evaluateChecks([], {}, null)
    expect(result).toEqual({ valid: true, errors: [] })
  })

  it('should collect all error messages for failing checks', () => {
    const checks = [
      { call: 'required', args: { value: '' }, message: 'Field is required' },
      { call: 'email', args: { value: '' }, message: 'Must be a valid email' },
    ]

    const result = evaluateChecks(checks, {}, null)

    expect(result.valid).toBe(false)
    expect(result.errors).toEqual([
      'Field is required',
      'Must be a valid email',
    ])
  })

  it('should return valid=true when all checks pass', () => {
    const checks = [
      {
        call: 'required',
        args: { value: 'test@example.com' },
        message: 'Required',
      },
      {
        call: 'email',
        args: { value: 'test@example.com' },
        message: 'Invalid email',
      },
    ]

    const result = evaluateChecks(checks, {}, null)

    expect(result).toEqual({ valid: true, errors: [] })
  })

  it('should resolve paths from data model', () => {
    const checks = [
      {
        call: 'required',
        args: { value: { path: '/form/email' } },
        message: 'Email is required',
      },
    ]
    const dataModel = { form: { email: 'test@example.com' } }

    const result = evaluateChecks(checks, dataModel, null)

    expect(result).toEqual({ valid: true, errors: [] })
  })
})
