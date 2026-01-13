/**
 * Tests for the lexer (tokenizer).
 */

import { describe, it, expect } from 'vitest'
import { tokenize } from './lexer.js'
import { TokenType } from './types.js'

describe('Lexer', () => {
  describe('TEXT tokens', () => {
    it('should tokenize plain text', () => {
      const tokens = tokenize('Hello World')
      expect(tokens).toHaveLength(2) // TEXT + EOF
      expect(tokens[0]).toMatchObject({
        type: TokenType.TEXT,
        value: 'Hello World',
        start: 0,
        end: 11,
      })
    })

    it('should return only EOF for empty string', () => {
      const tokens = tokenize('')
      expect(tokens).toHaveLength(1)
      expect(tokens[0].type).toBe(TokenType.EOF)
    })

    it('should handle text with special characters', () => {
      const tokens = tokenize('Hello @world! #123')
      expect(tokens[0]).toMatchObject({
        type: TokenType.TEXT,
        value: 'Hello @world! #123',
      })
    })

    it('should handle multi-line text', () => {
      const tokens = tokenize('Line 1\nLine 2')
      expect(tokens[0]).toMatchObject({
        type: TokenType.TEXT,
        value: 'Line 1\nLine 2',
      })
    })
  })

  describe('EXPR_START and EXPR_END tokens', () => {
    it('should tokenize expression delimiters', () => {
      const tokens = tokenize('${/path}')
      expect(tokens[0]).toMatchObject({
        type: TokenType.EXPR_START,
        value: '${',
      })
      expect(tokens[1]).toMatchObject({ type: TokenType.PATH, value: '/path' })
      expect(tokens[2]).toMatchObject({ type: TokenType.EXPR_END, value: '}' })
    })

    it('should handle multiple expressions', () => {
      const tokens = tokenize('${/a} ${/b}')
      const types = tokens.map((t) => t.type)
      expect(types).toEqual([
        TokenType.EXPR_START,
        TokenType.PATH,
        TokenType.EXPR_END,
        TokenType.TEXT,
        TokenType.EXPR_START,
        TokenType.PATH,
        TokenType.EXPR_END,
        TokenType.EOF,
      ])
    })

    it('should handle expression at start of string', () => {
      const tokens = tokenize('${/name} is here')
      expect(tokens[0].type).toBe(TokenType.EXPR_START)
    })

    it('should handle expression at end of string', () => {
      const tokens = tokenize('Name: ${/name}')
      expect(tokens[tokens.length - 2].type).toBe(TokenType.EXPR_END)
    })
  })

  describe('PATH tokens', () => {
    it('should tokenize absolute paths', () => {
      const tokens = tokenize('${/user/name}')
      expect(tokens[1]).toMatchObject({
        type: TokenType.PATH,
        value: '/user/name',
      })
    })

    it('should tokenize root path', () => {
      const tokens = tokenize('${/}')
      expect(tokens[1]).toMatchObject({
        type: TokenType.PATH,
        value: '/',
      })
    })

    it('should tokenize paths with array indices', () => {
      const tokens = tokenize('${/items/0}')
      expect(tokens[1]).toMatchObject({
        type: TokenType.PATH,
        value: '/items/0',
      })
    })

    it('should tokenize relative paths', () => {
      const tokens = tokenize('${name}')
      expect(tokens[1]).toMatchObject({
        type: TokenType.PATH,
        value: 'name',
      })
    })

    it('should tokenize nested relative paths', () => {
      const tokens = tokenize('${profile/name}')
      expect(tokens[1]).toMatchObject({
        type: TokenType.PATH,
        value: 'profile/name',
      })
    })

    it('should tokenize paths with hyphens', () => {
      const tokens = tokenize('${/user-data/first-name}')
      expect(tokens[1]).toMatchObject({
        type: TokenType.PATH,
        value: '/user-data/first-name',
      })
    })

    it('should tokenize paths with underscores', () => {
      const tokens = tokenize('${/user_data/first_name}')
      expect(tokens[1]).toMatchObject({
        type: TokenType.PATH,
        value: '/user_data/first_name',
      })
    })
  })

  describe('IDENTIFIER, LPAREN, RPAREN, COMMA tokens', () => {
    it('should tokenize no-argument function call', () => {
      const tokens = tokenize('${now()}')
      expect(tokens[1]).toMatchObject({
        type: TokenType.IDENTIFIER,
        value: 'now',
      })
      expect(tokens[2]).toMatchObject({ type: TokenType.LPAREN, value: '(' })
      expect(tokens[3]).toMatchObject({ type: TokenType.RPAREN, value: ')' })
    })

    it('should tokenize function with single argument', () => {
      const tokens = tokenize("${upper('hello')}")
      expect(tokens[1]).toMatchObject({
        type: TokenType.IDENTIFIER,
        value: 'upper',
      })
      expect(tokens[2]).toMatchObject({ type: TokenType.LPAREN, value: '(' })
      expect(tokens[3]).toMatchObject({
        type: TokenType.STRING,
        value: 'hello',
      })
      expect(tokens[4]).toMatchObject({ type: TokenType.RPAREN, value: ')' })
    })

    it('should tokenize function with multiple arguments', () => {
      const tokens = tokenize('${add(1, 2, 3)}')
      const types = tokens.map((t) => t.type)
      expect(types).toContain(TokenType.COMMA)
      // Count commas
      const commaCount = tokens.filter((t) => t.type === TokenType.COMMA).length
      expect(commaCount).toBe(2)
    })

    it('should handle whitespace around function parts', () => {
      const tokens = tokenize('${ upper ( 1 , 2 ) }')
      expect(tokens[1]).toMatchObject({
        type: TokenType.IDENTIFIER,
        value: 'upper',
      })
      expect(tokens[2]).toMatchObject({ type: TokenType.LPAREN })
      expect(tokens[3]).toMatchObject({ type: TokenType.NUMBER, value: '1' })
      expect(tokens[4]).toMatchObject({ type: TokenType.COMMA })
      expect(tokens[5]).toMatchObject({ type: TokenType.NUMBER, value: '2' })
      expect(tokens[6]).toMatchObject({ type: TokenType.RPAREN })
    })

    it('should tokenize function names with underscores', () => {
      const tokens = tokenize('${format_date()}')
      expect(tokens[1]).toMatchObject({
        type: TokenType.IDENTIFIER,
        value: 'format_date',
      })
    })
  })

  describe('STRING, NUMBER, BOOLEAN literal tokens', () => {
    it('should tokenize string literals', () => {
      const tokens = tokenize("${'hello'}")
      expect(tokens[1]).toMatchObject({
        type: TokenType.STRING,
        value: 'hello',
      })
    })

    it('should tokenize string with spaces', () => {
      const tokens = tokenize("${'hello world'}")
      expect(tokens[1]).toMatchObject({
        type: TokenType.STRING,
        value: 'hello world',
      })
    })

    it('should handle escaped quotes in strings', () => {
      const tokens = tokenize("${'it\\'s here'}")
      expect(tokens[1]).toMatchObject({
        type: TokenType.STRING,
        value: "it's here",
      })
    })

    it('should tokenize integer numbers', () => {
      const tokens = tokenize('${42}')
      expect(tokens[1]).toMatchObject({
        type: TokenType.NUMBER,
        value: '42',
      })
    })

    it('should tokenize negative numbers', () => {
      const tokens = tokenize('${-5}')
      expect(tokens[1]).toMatchObject({
        type: TokenType.NUMBER,
        value: '-5',
      })
    })

    it('should tokenize decimal numbers', () => {
      const tokens = tokenize('${3.14}')
      expect(tokens[1]).toMatchObject({
        type: TokenType.NUMBER,
        value: '3.14',
      })
    })

    it('should tokenize negative decimal numbers', () => {
      const tokens = tokenize('${-3.14}')
      expect(tokens[1]).toMatchObject({
        type: TokenType.NUMBER,
        value: '-3.14',
      })
    })

    it('should tokenize boolean true', () => {
      const tokens = tokenize('${true}')
      expect(tokens[1]).toMatchObject({
        type: TokenType.BOOLEAN,
        value: 'true',
      })
    })

    it('should tokenize boolean false', () => {
      const tokens = tokenize('${false}')
      expect(tokens[1]).toMatchObject({
        type: TokenType.BOOLEAN,
        value: 'false',
      })
    })

    it('should not tokenize partial boolean words', () => {
      const tokens = tokenize('${trueValue}')
      // Should be PATH, not BOOLEAN
      expect(tokens[1].type).toBe(TokenType.PATH)
      expect(tokens[1].value).toBe('trueValue')
    })
  })

  describe('escape sequence handling', () => {
    it('should convert \\${ to literal ${', () => {
      const tokens = tokenize('\\${escaped}')
      expect(tokens[0]).toMatchObject({
        type: TokenType.TEXT,
        value: '${escaped}',
      })
    })

    it('should handle multiple escapes', () => {
      const tokens = tokenize('\\${a} \\${b}')
      expect(tokens[0]).toMatchObject({
        type: TokenType.TEXT,
        value: '${a} ${b}',
      })
    })

    it('should handle mix of escaped and unescaped', () => {
      const tokens = tokenize('\\${escaped} ${/real}')
      expect(tokens[0]).toMatchObject({
        type: TokenType.TEXT,
        value: '${escaped} ',
      })
      expect(tokens[1]).toMatchObject({ type: TokenType.EXPR_START })
      expect(tokens[2]).toMatchObject({ type: TokenType.PATH, value: '/real' })
    })

    it('should handle escape at end of string', () => {
      const tokens = tokenize('text \\${end}')
      expect(tokens[0]).toMatchObject({
        type: TokenType.TEXT,
        value: 'text ${end}',
      })
    })

    it('should handle backslash not followed by ${', () => {
      const tokens = tokenize('back\\slash')
      expect(tokens[0]).toMatchObject({
        type: TokenType.TEXT,
        value: 'back\\slash',
      })
    })
  })

  describe('JSON Pointer escapes in PATH tokens', () => {
    it('should preserve ~1 escape (forward slash) in path', () => {
      const tokens = tokenize('${/a~1b}')
      expect(tokens[1]).toMatchObject({
        type: TokenType.PATH,
        value: '/a~1b',
      })
    })

    it('should preserve ~0 escape (tilde) in path', () => {
      const tokens = tokenize('${/m~0n}')
      expect(tokens[1]).toMatchObject({
        type: TokenType.PATH,
        value: '/m~0n',
      })
    })

    it('should preserve multiple escapes in path', () => {
      const tokens = tokenize('${/a~1b~0c}')
      expect(tokens[1]).toMatchObject({
        type: TokenType.PATH,
        value: '/a~1b~0c',
      })
    })

    it('should handle tilde without following 0 or 1', () => {
      const tokens = tokenize('${/path~other}')
      expect(tokens[1]).toMatchObject({
        type: TokenType.PATH,
        value: '/path~other',
      })
    })
  })

  describe('nested expressions', () => {
    it('should tokenize nested expression in function arg', () => {
      const tokens = tokenize('${upper(${/name})}')
      const types = tokens.map((t) => t.type)
      expect(types).toEqual([
        TokenType.EXPR_START, // ${
        TokenType.IDENTIFIER, // upper
        TokenType.LPAREN, // (
        TokenType.EXPR_START, // ${
        TokenType.PATH, // /name
        TokenType.EXPR_END, // }
        TokenType.RPAREN, // )
        TokenType.EXPR_END, // }
        TokenType.EOF,
      ])
    })

    it('should tokenize deeply nested expressions', () => {
      const tokens = tokenize('${a(${b(${/c})})}')
      // Count nested ${ tokens
      const exprStartCount = tokens.filter(
        (t) => t.type === TokenType.EXPR_START
      ).length
      expect(exprStartCount).toBe(3)
    })
  })

  describe('complex expressions', () => {
    it('should tokenize text with expression in middle', () => {
      const tokens = tokenize('Hello, ${/user/name}!')
      expect(tokens[0]).toMatchObject({
        type: TokenType.TEXT,
        value: 'Hello, ',
      })
      expect(tokens[1]).toMatchObject({ type: TokenType.EXPR_START })
      expect(tokens[2]).toMatchObject({
        type: TokenType.PATH,
        value: '/user/name',
      })
      expect(tokens[3]).toMatchObject({ type: TokenType.EXPR_END })
      expect(tokens[4]).toMatchObject({ type: TokenType.TEXT, value: '!' })
    })

    it('should tokenize multiple expressions in text', () => {
      const tokens = tokenize('${/a} + ${/b} = ${/c}')
      const textTokens = tokens.filter((t) => t.type === TokenType.TEXT)
      const pathTokens = tokens.filter((t) => t.type === TokenType.PATH)
      expect(textTokens.length).toBe(2) // ' + ' and ' = '
      expect(pathTokens.length).toBe(3)
    })
  })
})
