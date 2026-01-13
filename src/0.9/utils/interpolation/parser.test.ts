/**
 * Tests for the parser.
 */

import { describe, it, expect } from 'vitest'
import { tokenize } from './lexer'
import { parse } from './parser'
import type { PathNode, FunctionCallNode, LiteralNode } from './types'

describe('Parser', () => {
  describe('US1: Simple path expressions', () => {
    it('should parse simple absolute path', () => {
      const tokens = tokenize('${/user/name}')
      const ast = parse(tokens)

      expect(ast.type).toBe('interpolatedString')
      expect(ast.parts).toHaveLength(1)

      const pathNode = ast.parts[0] as PathNode
      expect(pathNode.type).toBe('path')
      expect(pathNode.path).toBe('/user/name')
      expect(pathNode.absolute).toBe(true)
    })

    it('should parse root path', () => {
      const tokens = tokenize('${/}')
      const ast = parse(tokens)

      const pathNode = ast.parts[0] as PathNode
      expect(pathNode.path).toBe('/')
      expect(pathNode.absolute).toBe(true)
    })

    it('should parse path with array index', () => {
      const tokens = tokenize('${/items/0}')
      const ast = parse(tokens)

      const pathNode = ast.parts[0] as PathNode
      expect(pathNode.path).toBe('/items/0')
    })

    it('should parse mixed literal and path content', () => {
      const tokens = tokenize('Hello, ${/user/name}!')
      const ast = parse(tokens)

      expect(ast.parts).toHaveLength(3)

      expect((ast.parts[0] as LiteralNode).type).toBe('literal')
      expect((ast.parts[0] as LiteralNode).value).toBe('Hello, ')

      expect((ast.parts[1] as PathNode).type).toBe('path')
      expect((ast.parts[1] as PathNode).path).toBe('/user/name')

      expect((ast.parts[2] as LiteralNode).type).toBe('literal')
      expect((ast.parts[2] as LiteralNode).value).toBe('!')
    })

    it('should parse multiple path expressions', () => {
      const tokens = tokenize('${/user/name} is ${/user/age} years old')
      const ast = parse(tokens)

      expect(ast.parts).toHaveLength(4)

      expect((ast.parts[0] as PathNode).path).toBe('/user/name')
      expect((ast.parts[1] as LiteralNode).value).toBe(' is ')
      expect((ast.parts[2] as PathNode).path).toBe('/user/age')
      expect((ast.parts[3] as LiteralNode).value).toBe(' years old')
    })

    it('should parse adjacent expressions', () => {
      const tokens = tokenize('${/a}${/b}${/c}')
      const ast = parse(tokens)

      expect(ast.parts).toHaveLength(3)
      expect((ast.parts[0] as PathNode).path).toBe('/a')
      expect((ast.parts[1] as PathNode).path).toBe('/b')
      expect((ast.parts[2] as PathNode).path).toBe('/c')
    })

    it('should parse path with JSON Pointer escapes', () => {
      const tokens = tokenize('${/a~1b}')
      const ast = parse(tokens)

      const pathNode = ast.parts[0] as PathNode
      expect(pathNode.path).toBe('/a~1b')
    })
  })

  describe('US2: Function call expressions', () => {
    it('should parse no-argument function call', () => {
      const tokens = tokenize('${now()}')
      const ast = parse(tokens)

      expect(ast.parts).toHaveLength(1)

      const funcNode = ast.parts[0] as FunctionCallNode
      expect(funcNode.type).toBe('functionCall')
      expect(funcNode.name).toBe('now')
      expect(funcNode.args).toHaveLength(0)
    })

    it('should parse function with string argument', () => {
      const tokens = tokenize("${upper('hello')}")
      const ast = parse(tokens)

      const funcNode = ast.parts[0] as FunctionCallNode
      expect(funcNode.name).toBe('upper')
      expect(funcNode.args).toHaveLength(1)

      const arg = funcNode.args[0] as LiteralNode
      expect(arg.type).toBe('literal')
      expect(arg.value).toBe('hello')
    })

    it('should parse function with number argument', () => {
      const tokens = tokenize('${abs(-5)}')
      const ast = parse(tokens)

      const funcNode = ast.parts[0] as FunctionCallNode
      expect(funcNode.name).toBe('abs')

      const arg = funcNode.args[0] as LiteralNode
      expect(arg.value).toBe('-5')
    })

    it('should parse function with boolean argument', () => {
      const tokens = tokenize('${if(true)}')
      const ast = parse(tokens)

      const funcNode = ast.parts[0] as FunctionCallNode
      const arg = funcNode.args[0] as LiteralNode
      expect(arg.value).toBe('true')
    })

    it('should parse function with multiple arguments', () => {
      const tokens = tokenize('${add(1, 2, 3)}')
      const ast = parse(tokens)

      const funcNode = ast.parts[0] as FunctionCallNode
      expect(funcNode.name).toBe('add')
      expect(funcNode.args).toHaveLength(3)
      expect((funcNode.args[0] as LiteralNode).value).toBe('1')
      expect((funcNode.args[1] as LiteralNode).value).toBe('2')
      expect((funcNode.args[2] as LiteralNode).value).toBe('3')
    })

    it('should parse function with path argument', () => {
      const tokens = tokenize('${upper(${/name})}')
      const ast = parse(tokens)

      const funcNode = ast.parts[0] as FunctionCallNode
      expect(funcNode.name).toBe('upper')
      expect(funcNode.args).toHaveLength(1)

      const arg = funcNode.args[0] as PathNode
      expect(arg.type).toBe('path')
      expect(arg.path).toBe('/name')
    })

    it('should parse function with mixed argument types', () => {
      const tokens = tokenize("${format(${/value}, 'prefix', 10)}")
      const ast = parse(tokens)

      const funcNode = ast.parts[0] as FunctionCallNode
      expect(funcNode.args).toHaveLength(3)

      expect((funcNode.args[0] as PathNode).type).toBe('path')
      expect((funcNode.args[1] as LiteralNode).type).toBe('literal')
      expect((funcNode.args[2] as LiteralNode).type).toBe('literal')
    })
  })

  describe('US3: Nested expressions', () => {
    it('should parse nested path in function argument', () => {
      const tokens = tokenize('${upper(${/name})}')
      const ast = parse(tokens)

      const funcNode = ast.parts[0] as FunctionCallNode
      const arg = funcNode.args[0] as PathNode
      expect(arg.path).toBe('/name')
    })

    it('should parse nested function call in argument', () => {
      const tokens = tokenize('${upper(${lower(${/name})})}')
      const ast = parse(tokens)

      const outerFunc = ast.parts[0] as FunctionCallNode
      expect(outerFunc.name).toBe('upper')

      const innerFunc = outerFunc.args[0] as FunctionCallNode
      expect(innerFunc.name).toBe('lower')

      const pathArg = innerFunc.args[0] as PathNode
      expect(pathArg.path).toBe('/name')
    })

    it('should parse deeply nested expressions (3+ levels)', () => {
      const tokens = tokenize('${a(${b(${c(${/x})})})}')
      const ast = parse(tokens)

      const level1 = ast.parts[0] as FunctionCallNode
      expect(level1.name).toBe('a')

      const level2 = level1.args[0] as FunctionCallNode
      expect(level2.name).toBe('b')

      const level3 = level2.args[0] as FunctionCallNode
      expect(level3.name).toBe('c')

      const path = level3.args[0] as PathNode
      expect(path.path).toBe('/x')
    })

    it('should handle max nesting depth gracefully', () => {
      // Create expression with 11 nesting levels (exceeds MAX_DEPTH of 10)
      let expr = '${/x}'
      for (let i = 0; i < 11; i++) {
        expr = `\${wrap(${expr})}`
      }

      const tokens = tokenize(expr)
      const ast = parse(tokens)

      // Should still return valid AST (with warning logged)
      expect(ast.type).toBe('interpolatedString')
    })
  })

  describe('US4: Escaped expressions', () => {
    it('should parse escaped expression as literal text', () => {
      const tokens = tokenize('\\${escaped}')
      const ast = parse(tokens)

      expect(ast.parts).toHaveLength(1)
      expect((ast.parts[0] as LiteralNode).type).toBe('literal')
      expect((ast.parts[0] as LiteralNode).value).toBe('${escaped}')
    })

    it('should parse mixed escaped and unescaped', () => {
      const tokens = tokenize('\\${escaped} ${/real}')
      const ast = parse(tokens)

      expect(ast.parts).toHaveLength(2)
      expect((ast.parts[0] as LiteralNode).value).toBe('${escaped} ')
      expect((ast.parts[1] as PathNode).path).toBe('/real')
    })
  })

  describe('US5: Relative paths', () => {
    it('should parse relative path', () => {
      const tokens = tokenize('${name}')
      const ast = parse(tokens)

      const pathNode = ast.parts[0] as PathNode
      expect(pathNode.type).toBe('path')
      expect(pathNode.path).toBe('name')
      expect(pathNode.absolute).toBe(false)
    })

    it('should parse nested relative path', () => {
      const tokens = tokenize('${profile/name}')
      const ast = parse(tokens)

      const pathNode = ast.parts[0] as PathNode
      expect(pathNode.path).toBe('profile/name')
      expect(pathNode.absolute).toBe(false)
    })

    it('should parse mixed absolute and relative paths', () => {
      const tokens = tokenize('${name} and ${/absolute}')
      const ast = parse(tokens)

      const relativePath = ast.parts[0] as PathNode
      expect(relativePath.absolute).toBe(false)

      const absolutePath = ast.parts[2] as PathNode
      expect(absolutePath.absolute).toBe(true)
    })
  })

  describe('Additional edge cases', () => {
    it('should parse function with direct path argument (not nested)', () => {
      const tokens = tokenize('${upper(/name)}')
      const ast = parse(tokens)

      const funcNode = ast.parts[0] as FunctionCallNode
      expect(funcNode.type).toBe('functionCall')
      expect(funcNode.name).toBe('upper')
      // Direct path in function args (without ${})
      expect(funcNode.args).toHaveLength(1)
    })

    it('should parse function call inside function argument', () => {
      // Test nested function call recognized via IDENTIFIER token
      const tokens = tokenize('${outer(inner())}')
      const ast = parse(tokens)

      const outerFunc = ast.parts[0] as FunctionCallNode
      expect(outerFunc.name).toBe('outer')
      expect(outerFunc.args).toHaveLength(1)

      const innerFunc = outerFunc.args[0] as FunctionCallNode
      expect(innerFunc.type).toBe('functionCall')
      expect(innerFunc.name).toBe('inner')
    })

    it('should handle function argument with EOF', () => {
      const tokens = tokenize('${func(')
      const ast = parse(tokens)

      const funcNode = ast.parts[0] as FunctionCallNode
      expect(funcNode.type).toBe('functionCall')
      expect(funcNode.name).toBe('func')
    })

    it('should handle nested EXPR_START at depth limit in parseArgument', () => {
      // Create expression with exactly MAX_DEPTH nestings in function arg context
      let expr = '${/x}'
      for (let i = 0; i < 9; i++) {
        expr = `\${f(${expr})}`
      }
      // One more nesting should trigger the max depth in parseArgument
      expr = `\${f(${expr})}`
      expr = `\${f(${expr})}`

      const tokens = tokenize(expr)
      const ast = parse(tokens)

      // Should still return valid AST
      expect(ast.type).toBe('interpolatedString')
    })

    it('should handle literal in parseExpression', () => {
      // When a literal token appears in an expression context
      const tokens = tokenize("${'string'}")
      const ast = parse(tokens)

      const literalNode = ast.parts[0] as LiteralNode
      expect(literalNode.type).toBe('literal')
      expect(literalNode.value).toBe('string')
    })

    it('should handle number in parseExpression', () => {
      const tokens = tokenize('${42}')
      const ast = parse(tokens)

      const literalNode = ast.parts[0] as LiteralNode
      expect(literalNode.type).toBe('literal')
      expect(literalNode.value).toBe('42')
    })

    it('should handle boolean in parseExpression', () => {
      const tokens = tokenize('${true}')
      const ast = parse(tokens)

      const literalNode = ast.parts[0] as LiteralNode
      expect(literalNode.type).toBe('literal')
      expect(literalNode.value).toBe('true')
    })

    it('should handle unexpected EXPR_END at top level', () => {
      // This simulates finding } outside of expression context
      const tokens = tokenize('text}more')
      const ast = parse(tokens)

      expect(ast.type).toBe('interpolatedString')
      expect(ast.parts).toHaveLength(1)
      expect((ast.parts[0] as LiteralNode).value).toBe('text}more')
    })
  })

  describe('Error handling', () => {
    it('should return empty literal for empty expression', () => {
      const tokens = tokenize('${}')
      const ast = parse(tokens)

      // Should not crash, may have empty parts
      expect(ast.type).toBe('interpolatedString')
    })

    it('should handle unclosed expression', () => {
      const tokens = tokenize('${/path')
      const ast = parse(tokens)

      // Should return partial AST
      expect(ast.type).toBe('interpolatedString')
    })

    it('should handle plain text without expressions', () => {
      const tokens = tokenize('Hello World')
      const ast = parse(tokens)

      expect(ast.parts).toHaveLength(1)
      expect((ast.parts[0] as LiteralNode).value).toBe('Hello World')
    })

    it('should handle empty string', () => {
      const tokens = tokenize('')
      const ast = parse(tokens)

      expect(ast.type).toBe('interpolatedString')
      expect(ast.parts.length).toBeGreaterThanOrEqual(1)
    })
  })
})
