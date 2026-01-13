/**
 * Tests for the public interpolation API.
 * Tests the new refactored parser module.
 */

import { describe, it, expect } from 'vitest'
import { parseInterpolation, interpolate } from './interpolation'
import type { PathNode, LiteralNode, FunctionCallNode } from './interpolation'

describe('parseInterpolation', () => {
  it('should parse simple path expression', () => {
    const ast = parseInterpolation('${/user/name}')
    expect(ast.type).toBe('interpolatedString')
    expect(ast.parts).toHaveLength(1)

    const pathNode = ast.parts[0] as PathNode
    expect(pathNode.type).toBe('path')
    expect(pathNode.path).toBe('/user/name')
    expect(pathNode.absolute).toBe(true)
  })

  it('should parse mixed content', () => {
    const ast = parseInterpolation('Hello, ${/user/name}!')
    expect(ast.parts).toHaveLength(3)

    expect((ast.parts[0] as LiteralNode).type).toBe('literal')
    expect((ast.parts[0] as LiteralNode).value).toBe('Hello, ')

    expect((ast.parts[1] as PathNode).type).toBe('path')
    expect((ast.parts[1] as PathNode).path).toBe('/user/name')

    expect((ast.parts[2] as LiteralNode).type).toBe('literal')
    expect((ast.parts[2] as LiteralNode).value).toBe('!')
  })

  it('should parse function call', () => {
    const ast = parseInterpolation('${now()}')

    const funcNode = ast.parts[0] as FunctionCallNode
    expect(funcNode.type).toBe('functionCall')
    expect(funcNode.name).toBe('now')
    expect(funcNode.args).toHaveLength(0)
  })

  it('should parse nested expressions', () => {
    const ast = parseInterpolation('${upper(${/name})}')

    const funcNode = ast.parts[0] as FunctionCallNode
    expect(funcNode.type).toBe('functionCall')
    expect(funcNode.name).toBe('upper')
    expect(funcNode.args).toHaveLength(1)

    const arg = funcNode.args[0] as PathNode
    expect(arg.type).toBe('path')
    expect(arg.path).toBe('/name')
  })

  it('should handle escaped expressions', () => {
    const ast = parseInterpolation('\\${escaped}')
    expect(ast.parts).toHaveLength(1)
    expect((ast.parts[0] as LiteralNode).value).toBe('${escaped}')
  })

  it('should parse relative paths', () => {
    const ast = parseInterpolation('${name}')

    const pathNode = ast.parts[0] as PathNode
    expect(pathNode.type).toBe('path')
    expect(pathNode.path).toBe('name')
    expect(pathNode.absolute).toBe(false)
  })
})

describe('interpolate', () => {
  const dataModel = {
    user: {
      name: 'John',
      age: 30,
    },
    stats: {
      count: 42,
      active: true,
    },
    items: ['a', 'b', 'c'],
  }

  it('should interpolate single value', () => {
    expect(interpolate('Hello, ${/user/name}!', dataModel)).toBe('Hello, John!')
  })

  it('should interpolate multiple values', () => {
    expect(
      interpolate('${/user/name} is ${/user/age} years old', dataModel)
    ).toBe('John is 30 years old')
  })

  it('should handle number values', () => {
    expect(interpolate('Count: ${/stats/count}', dataModel)).toBe('Count: 42')
  })

  it('should handle boolean values', () => {
    expect(interpolate('Active: ${/stats/active}', dataModel)).toBe(
      'Active: true'
    )
  })

  it('should handle array values as JSON', () => {
    expect(interpolate('Items: ${/items}', dataModel)).toBe(
      'Items: ["a","b","c"]'
    )
  })

  it('should handle object values as JSON', () => {
    expect(interpolate('User: ${/user}', dataModel)).toBe(
      'User: {"name":"John","age":30}'
    )
  })

  it('should handle undefined values as empty string', () => {
    expect(interpolate('Missing: ${/nonexistent}', dataModel)).toBe('Missing: ')
    expect(interpolate('${/a}${/b}${/c}', dataModel)).toBe('')
  })

  it('should handle null values as empty string', () => {
    const modelWithNull = { value: null }
    expect(interpolate('Value: ${/value}', modelWithNull)).toBe('Value: ')
  })

  it('should preserve text without interpolation', () => {
    expect(interpolate('Hello, World!', dataModel)).toBe('Hello, World!')
    expect(interpolate('No variables here', dataModel)).toBe(
      'No variables here'
    )
  })

  it('should unescape escaped expressions', () => {
    expect(interpolate('Escaped \\${/user/name}', dataModel)).toBe(
      'Escaped ${/user/name}'
    )
    expect(interpolate('\\${a} and \\${b}', dataModel)).toBe('${a} and ${b}')
  })

  it('should handle mix of escaped and unescaped', () => {
    expect(interpolate('\\${escaped} ${/user/name}', dataModel)).toBe(
      '${escaped} John'
    )
  })

  describe('with basePath', () => {
    it('should resolve relative paths with basePath', () => {
      expect(interpolate('Name: ${name}', dataModel, '/user')).toBe(
        'Name: John'
      )
      expect(interpolate('Age: ${age}', dataModel, '/user')).toBe('Age: 30')
    })

    it('should handle absolute paths even with basePath', () => {
      expect(interpolate('Count: ${/stats/count}', dataModel, '/user')).toBe(
        'Count: 42'
      )
    })

    it('should handle mix of relative and absolute', () => {
      expect(
        interpolate('${name} has ${/stats/count} items', dataModel, '/user')
      ).toBe('John has 42 items')
    })
  })

  describe('function calls', () => {
    const testFunctions = {
      upper: (str: unknown) => String(str).toUpperCase(),
      lower: (str: unknown) => String(str).toLowerCase(),
      add: (...args: unknown[]) =>
        args.reduce((sum: number, val) => sum + Number(val), 0),
    }

    it('should invoke functions from context', () => {
      expect(interpolate("${upper('hello')}", {}, null, testFunctions)).toBe(
        'HELLO'
      )
      expect(interpolate("${lower('HELLO')}", {}, null, testFunctions)).toBe(
        'hello'
      )
      expect(interpolate('${add(1, 2, 3)}', {}, null, testFunctions)).toBe('6')
    })

    it('should handle function with path arguments', () => {
      expect(
        interpolate('${upper(${/user/name})}', dataModel, null, testFunctions)
      ).toBe('JOHN')
    })

    it('should handle nested function calls', () => {
      expect(
        interpolate('${add(${/user/age}, 10)}', dataModel, null, testFunctions)
      ).toBe('40')
    })
  })

  describe('JSON Pointer escapes', () => {
    it('should resolve keys with forward slash', () => {
      const model = { 'a/b': 'value' }
      expect(interpolate('${/a~1b}', model)).toBe('value')
    })

    it('should resolve keys with tilde', () => {
      const model = { 'm~n': 'value' }
      expect(interpolate('${/m~0n}', model)).toBe('value')
    })
  })

  describe('custom functions', () => {
    it('should use custom functions', () => {
      const customFunctions = {
        greet: (name: unknown) => `Hello, ${name}!`,
      }
      expect(interpolate("${greet('World')}", {}, null, customFunctions)).toBe(
        'Hello, World!'
      )
    })
  })
})
