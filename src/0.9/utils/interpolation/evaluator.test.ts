/**
 * Tests for the evaluator.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { tokenize } from './lexer'
import { parse } from './parser'
import { evaluate } from './evaluator'
import type { EvaluationContext, FunctionRegistry } from './types'

/**
 * Test helper functions - these are used within tests to verify
 * function call behavior. They are passed via context.functions.
 */
const testFunctions: FunctionRegistry = {
  // String functions
  upper: (str: unknown) => String(str).toUpperCase(),
  lower: (str: unknown) => String(str).toLowerCase(),
  trim: (str: unknown) => String(str).trim(),
  length: (str: unknown) => {
    if (Array.isArray(str)) return str.length
    return String(str).length
  },

  // Date functions
  now: () => new Date().toISOString(),

  // Math functions
  add: (...args: unknown[]) =>
    args.reduce((sum: number, val) => sum + Number(val), 0),
  sub: (a: unknown, b: unknown) => Number(a) - Number(b),
  mul: (...args: unknown[]) =>
    args.reduce((product: number, val) => product * Number(val), 1),
  div: (a: unknown, b: unknown) => {
    const divisor = Number(b)
    return divisor !== 0 ? Number(a) / divisor : 0
  },
  mod: (a: unknown, b: unknown) => Number(a) % Number(b),
  abs: (n: unknown) => Math.abs(Number(n)),
  round: (n: unknown) => Math.round(Number(n)),
  floor: (n: unknown) => Math.floor(Number(n)),
  ceil: (n: unknown) => Math.ceil(Number(n)),

  // Conditional functions
  if: (condition: unknown, thenVal: unknown, elseVal: unknown) =>
    condition ? thenVal : elseVal,
  eq: (a: unknown, b: unknown) => a === b,
  ne: (a: unknown, b: unknown) => a !== b,
  gt: (a: unknown, b: unknown) => Number(a) > Number(b),
  lt: (a: unknown, b: unknown) => Number(a) < Number(b),
  gte: (a: unknown, b: unknown) => Number(a) >= Number(b),
  lte: (a: unknown, b: unknown) => Number(a) <= Number(b),

  // String manipulation
  concat: (...args: unknown[]) => args.map(String).join(''),
  join: (arr: unknown, sep: unknown = ',') => {
    if (Array.isArray(arr)) return arr.join(String(sep))
    return String(arr)
  },
  split: (str: unknown, sep: unknown = ',') => String(str).split(String(sep)),
  replace: (str: unknown, search: unknown, replacement: unknown) =>
    String(str).replace(String(search), String(replacement)),
  substr: (str: unknown, start: unknown, length?: unknown) =>
    length !== undefined
      ? String(str).substr(Number(start), Number(length))
      : String(str).substr(Number(start)),

  // Type conversion
  toString: (val: unknown) => String(val),
  toNumber: (val: unknown) => Number(val),
  toBoolean: (val: unknown) => Boolean(val),

  // JSON
  json: (val: unknown) => JSON.stringify(val),
  parseJson: (str: unknown) => {
    try {
      return JSON.parse(String(str))
    } catch {
      return null
    }
  },

  // Default/fallback
  default: (val: unknown, defaultVal: unknown) =>
    val !== undefined && val !== null && val !== '' ? val : defaultVal,
}

function evaluateTemplate(
  template: string,
  context: EvaluationContext
): string {
  const tokens = tokenize(template)
  const ast = parse(tokens)
  // Merge testFunctions with any custom functions in context
  const mergedContext: EvaluationContext = {
    ...context,
    functions: { ...testFunctions, ...context.functions },
  }
  return evaluate(ast, mergedContext)
}

describe('Evaluator', () => {
  describe('US1: Path resolution', () => {
    const dataModel = {
      user: { name: 'John', age: 30 },
      items: ['a', 'b', 'c'],
      nested: { deep: { value: 'found' } },
    }

    it('should resolve simple path', () => {
      const result = evaluateTemplate('${/user/name}', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('John')
    })

    it('should resolve path with array index', () => {
      const result = evaluateTemplate('${/items/0}', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('a')
    })

    it('should resolve nested path', () => {
      const result = evaluateTemplate('${/nested/deep/value}', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('found')
    })

    it('should concatenate with literal text', () => {
      const result = evaluateTemplate('Hello, ${/user/name}!', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('Hello, John!')
    })

    it('should resolve multiple paths', () => {
      const result = evaluateTemplate('${/user/name} is ${/user/age}', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('John is 30')
    })
  })

  describe('US1: Missing path handling', () => {
    const dataModel = { user: { name: 'John' } }

    it('should return empty string for missing path', () => {
      const result = evaluateTemplate('${/nonexistent}', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('')
    })

    it('should return empty string for deeply missing path', () => {
      const result = evaluateTemplate('${/a/b/c/d}', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('')
    })

    it('should preserve literal text around missing path', () => {
      const result = evaluateTemplate('Value: ${/missing}!', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('Value: !')
    })
  })

  describe('US1: Type coercion', () => {
    const dataModel = {
      str: 'text',
      num: 42,
      float: 3.14,
      bool: true,
      boolFalse: false,
      nullVal: null,
      arr: [1, 2, 3],
      obj: { key: 'value' },
    }

    it('should convert number to string', () => {
      const result = evaluateTemplate('${/num}', { dataModel, basePath: null })
      expect(result).toBe('42')
    })

    it('should convert float to string', () => {
      const result = evaluateTemplate('${/float}', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('3.14')
    })

    it('should convert boolean true to string', () => {
      const result = evaluateTemplate('${/bool}', { dataModel, basePath: null })
      expect(result).toBe('true')
    })

    it('should convert boolean false to string', () => {
      const result = evaluateTemplate('${/boolFalse}', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('false')
    })

    it('should convert null to empty string', () => {
      const result = evaluateTemplate('${/nullVal}', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('')
    })

    it('should convert array to JSON', () => {
      const result = evaluateTemplate('${/arr}', { dataModel, basePath: null })
      expect(result).toBe('[1,2,3]')
    })

    it('should convert object to JSON', () => {
      const result = evaluateTemplate('${/obj}', { dataModel, basePath: null })
      expect(result).toBe('{"key":"value"}')
    })
  })

  describe('US1: JSON Pointer escape decoding', () => {
    it('should decode ~1 to forward slash', () => {
      const dataModel = { 'a/b': 'slash-key' }
      const result = evaluateTemplate('${/a~1b}', { dataModel, basePath: null })
      expect(result).toBe('slash-key')
    })

    it('should decode ~0 to tilde', () => {
      const dataModel = { 'm~n': 'tilde-key' }
      const result = evaluateTemplate('${/m~0n}', { dataModel, basePath: null })
      expect(result).toBe('tilde-key')
    })

    it('should decode multiple escapes', () => {
      const dataModel = { 'a/b~c': 'mixed-key' }
      const result = evaluateTemplate('${/a~1b~0c}', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('mixed-key')
    })

    it('should decode in correct order (~1 before ~0)', () => {
      // Key is literally "~1" (not "/")
      const dataModel = { '~1': 'literal-tilde-one' }
      const result = evaluateTemplate('${/~01}', { dataModel, basePath: null })
      expect(result).toBe('literal-tilde-one')
    })
  })

  describe('US2: Function invocation', () => {
    const dataModel = { name: 'john' }

    it('should invoke upper function', () => {
      const result = evaluateTemplate("${upper('hello')}", {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('HELLO')
    })

    it('should invoke lower function', () => {
      const result = evaluateTemplate("${lower('HELLO')}", {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('hello')
    })

    it('should invoke now function', () => {
      const result = evaluateTemplate('${now()}', { dataModel, basePath: null })
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })

    it('should invoke add function', () => {
      const result = evaluateTemplate('${add(1, 2, 3)}', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('6')
    })

    it('should invoke sub function', () => {
      const result = evaluateTemplate('${sub(10, 3)}', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('7')
    })

    it('should invoke mul function', () => {
      const result = evaluateTemplate('${mul(2, 3, 4)}', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('24')
    })

    it('should invoke div function', () => {
      const result = evaluateTemplate('${div(10, 2)}', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('5')
    })

    it('should invoke concat function', () => {
      const result = evaluateTemplate("${concat('a', 'b', 'c')}", {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('abc')
    })

    it('should invoke trim function', () => {
      const result = evaluateTemplate("${trim('  hello  ')}", {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('hello')
    })

    it('should invoke length function', () => {
      const result = evaluateTemplate("${length('hello')}", {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('5')
    })

    it('should invoke if function', () => {
      const result = evaluateTemplate("${if(true, 'yes', 'no')}", {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('yes')
    })

    it('should invoke default function', () => {
      const result = evaluateTemplate("${default(${/missing}, 'fallback')}", {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('fallback')
    })
  })

  describe('US2: Unknown function handling', () => {
    let warnSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
      warnSpy.mockRestore()
    })

    it('should return empty string for unknown function', () => {
      const result = evaluateTemplate('${unknownFunc()}', {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('')
    })

    it('should log warning for unknown function', () => {
      evaluateTemplate('${unknownFunc()}', { dataModel: {}, basePath: null })
      expect(warnSpy).toHaveBeenCalledWith(
        '[A2UI] Unknown function: unknownFunc'
      )
    })
  })

  describe('US2: Function with resolved path arguments', () => {
    const dataModel = {
      name: 'john',
      a: 5,
      b: 3,
    }

    it('should resolve path argument and pass to function', () => {
      const result = evaluateTemplate('${upper(${/name})}', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('JOHN')
    })

    it('should resolve multiple path arguments', () => {
      const result = evaluateTemplate('${add(${/a}, ${/b})}', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('8')
    })
  })

  describe('US3: Nested expression evaluation', () => {
    const dataModel = {
      name: 'john',
      value: 10,
    }

    it('should evaluate nested path in function', () => {
      const result = evaluateTemplate('${upper(${/name})}', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('JOHN')
    })

    it('should evaluate nested function call', () => {
      const result = evaluateTemplate("${upper(${lower('HELLO')})}", {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('HELLO')
    })

    it('should evaluate deeply nested expressions', () => {
      const result = evaluateTemplate('${add(${mul(${/value}, 2)}, 5)}', {
        dataModel,
        basePath: null,
      })
      expect(result).toBe('25')
    })

    it('should evaluate innermost expressions first', () => {
      const result = evaluateTemplate(
        "${concat(${upper('a')}, ${lower('B')})}",
        { dataModel, basePath: null }
      )
      expect(result).toBe('Ab')
    })
  })

  describe('US4: Escaped expression output', () => {
    it('should output literal ${ for escaped expression', () => {
      const result = evaluateTemplate('\\${escaped}', {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('${escaped}')
    })

    it('should handle mixed escaped and unescaped', () => {
      const result = evaluateTemplate('\\${escaped} ${/name}', {
        dataModel: { name: 'John' },
        basePath: null,
      })
      expect(result).toBe('${escaped} John')
    })

    it('should handle multiple escapes', () => {
      const result = evaluateTemplate('\\${a} and \\${b}', {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('${a} and ${b}')
    })
  })

  describe('US5: Relative path resolution with basePath', () => {
    const dataModel = {
      users: [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
      ],
    }

    it('should resolve relative path with basePath', () => {
      const result = evaluateTemplate('${name}', {
        dataModel,
        basePath: '/users/0',
      })
      expect(result).toBe('Alice')
    })

    it('should resolve different items with different basePath', () => {
      const result1 = evaluateTemplate('${name}', {
        dataModel,
        basePath: '/users/0',
      })
      const result2 = evaluateTemplate('${name}', {
        dataModel,
        basePath: '/users/1',
      })

      expect(result1).toBe('Alice')
      expect(result2).toBe('Bob')
    })

    it('should handle mixed absolute and relative paths', () => {
      const context = { dataModel, basePath: '/users/0' }
      const result = evaluateTemplate('${name} from ${/users/1/name}', context)
      expect(result).toBe('Alice from Bob')
    })

    it('should resolve nested relative paths', () => {
      const dataModel2 = {
        company: {
          dept: {
            employee: { name: 'Jane' },
          },
        },
      }
      const result = evaluateTemplate('${dept/employee/name}', {
        dataModel: dataModel2,
        basePath: '/company',
      })
      expect(result).toBe('Jane')
    })

    it('should handle null basePath as root', () => {
      const dataModel2 = { name: 'Root' }
      const result = evaluateTemplate('${name}', {
        dataModel: dataModel2,
        basePath: null,
      })
      expect(result).toBe('Root')
    })

    it('should handle "/" basePath as root', () => {
      const dataModel2 = { name: 'Root' }
      const result = evaluateTemplate('${name}', {
        dataModel: dataModel2,
        basePath: '/',
      })
      expect(result).toBe('Root')
    })
  })

  describe('Custom functions', () => {
    it('should use custom function from registry', () => {
      const customFunctions = {
        greet: (name: unknown) => `Hello, ${name}!`,
      }

      const result = evaluateTemplate("${greet('World')}", {
        dataModel: {},
        basePath: null,
        functions: customFunctions,
      })

      expect(result).toBe('Hello, World!')
    })

    it('should override test functions with custom function', () => {
      const customFunctions = {
        upper: () => 'CUSTOM',
      }

      const result = evaluateTemplate("${upper('test')}", {
        dataModel: {},
        basePath: null,
        functions: customFunctions,
      })

      expect(result).toBe('CUSTOM')
    })
  })

  describe('More functions', () => {
    it('should invoke mod function', () => {
      const result = evaluateTemplate('${mod(10, 3)}', {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('1')
    })

    it('should invoke abs function', () => {
      const result = evaluateTemplate('${abs(-5)}', {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('5')
    })

    it('should invoke round function', () => {
      const result = evaluateTemplate('${round(3.7)}', {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('4')
    })

    it('should invoke floor function', () => {
      const result = evaluateTemplate('${floor(3.9)}', {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('3')
    })

    it('should invoke ceil function', () => {
      const result = evaluateTemplate('${ceil(3.1)}', {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('4')
    })

    it('should invoke eq function', () => {
      const result = evaluateTemplate("${eq('a', 'a')}", {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('true')
    })

    it('should invoke ne function', () => {
      const result = evaluateTemplate("${ne('a', 'b')}", {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('true')
    })

    it('should invoke gt function', () => {
      const result = evaluateTemplate('${gt(5, 3)}', {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('true')
    })

    it('should invoke lt function', () => {
      const result = evaluateTemplate('${lt(3, 5)}', {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('true')
    })

    it('should invoke gte function', () => {
      const result = evaluateTemplate('${gte(5, 5)}', {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('true')
    })

    it('should invoke lte function', () => {
      const result = evaluateTemplate('${lte(5, 5)}', {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('true')
    })

    it('should invoke join function with array', () => {
      const result = evaluateTemplate("${join(${/arr}, '-')}", {
        dataModel: { arr: [1, 2, 3] },
        basePath: null,
      })
      expect(result).toBe('1-2-3')
    })

    it('should invoke join function with non-array', () => {
      const result = evaluateTemplate("${join('test', '-')}", {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('test')
    })

    it('should invoke split function', () => {
      const result = evaluateTemplate("${split('a,b,c', ',')}", {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('["a","b","c"]')
    })

    it('should invoke replace function', () => {
      const result = evaluateTemplate(
        "${replace('hello world', 'world', 'there')}",
        { dataModel: {}, basePath: null }
      )
      expect(result).toBe('hello there')
    })

    it('should invoke substr function', () => {
      const result = evaluateTemplate("${substr('hello', 0, 3)}", {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('hel')
    })

    it('should invoke substr function without length', () => {
      const result = evaluateTemplate("${substr('hello', 2)}", {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('llo')
    })

    it('should invoke toString function', () => {
      const result = evaluateTemplate('${toString(42)}', {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('42')
    })

    it('should invoke toNumber function', () => {
      const result = evaluateTemplate("${toNumber('42')}", {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('42')
    })

    it('should invoke toBoolean function', () => {
      const result = evaluateTemplate('${toBoolean(1)}', {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('true')
    })

    it('should invoke json function', () => {
      const result = evaluateTemplate('${json(${/obj})}', {
        dataModel: { obj: { a: 1 } },
        basePath: null,
      })
      expect(result).toBe('{"a":1}')
    })

    it('should invoke parseJson function', () => {
      const result = evaluateTemplate('${parseJson(\'{"a":1}\')}', {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('{"a":1}')
    })

    it('should handle parseJson with invalid JSON', () => {
      const result = evaluateTemplate("${parseJson('invalid')}", {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('')
    })

    it('should handle div by zero', () => {
      const result = evaluateTemplate('${div(10, 0)}', {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('0')
    })

    it('should invoke length function with array', () => {
      const result = evaluateTemplate('${length(${/arr})}', {
        dataModel: { arr: [1, 2, 3] },
        basePath: null,
      })
      expect(result).toBe('3')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty template', () => {
      const result = evaluateTemplate('', { dataModel: {}, basePath: null })
      expect(result).toBe('')
    })

    it('should handle template with only literal text', () => {
      const result = evaluateTemplate('Hello World', {
        dataModel: {},
        basePath: null,
      })
      expect(result).toBe('Hello World')
    })

    it('should handle expression at start', () => {
      const result = evaluateTemplate('${/name} is here', {
        dataModel: { name: 'John' },
        basePath: null,
      })
      expect(result).toBe('John is here')
    })

    it('should handle expression at end', () => {
      const result = evaluateTemplate('Name: ${/name}', {
        dataModel: { name: 'John' },
        basePath: null,
      })
      expect(result).toBe('Name: John')
    })

    it('should handle only expression', () => {
      const result = evaluateTemplate('${/name}', {
        dataModel: { name: 'John' },
        basePath: null,
      })
      expect(result).toBe('John')
    })
  })
})
