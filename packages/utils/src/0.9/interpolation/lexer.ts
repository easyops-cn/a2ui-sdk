/**
 * Lexer (Tokenizer) for string interpolation expressions.
 *
 * Converts an input string into a sequence of tokens that can be
 * consumed by the parser.
 */

import { Token, TokenType } from './types.js'

/**
 * Tokenizes an interpolated string into a sequence of tokens.
 *
 * The lexer operates as a state machine with two main modes:
 * - TEXT mode: Collecting literal text outside ${...}
 * - EXPRESSION mode: Tokenizing content inside ${...}
 *
 * @param input - The input string to tokenize
 * @returns Array of tokens
 */
export function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let pos = 0
  let expressionDepth = 0 // Track nesting depth

  while (pos < input.length) {
    if (expressionDepth > 0) {
      // Skip whitespace inside expressions
      while (pos < input.length && /\s/.test(input[pos])) {
        pos++
      }

      if (pos >= input.length) {
        break
      }

      const char = input[pos]

      // Expression end
      if (char === '}') {
        tokens.push({
          type: TokenType.EXPR_END,
          value: '}',
          start: pos,
          end: pos + 1,
        })
        pos++
        expressionDepth-- // Decrement depth instead of setting to false
        continue
      }

      // Left parenthesis
      if (char === '(') {
        tokens.push({
          type: TokenType.LPAREN,
          value: '(',
          start: pos,
          end: pos + 1,
        })
        pos++
        continue
      }

      // Right parenthesis
      if (char === ')') {
        tokens.push({
          type: TokenType.RPAREN,
          value: ')',
          start: pos,
          end: pos + 1,
        })
        pos++
        continue
      }

      // Comma
      if (char === ',') {
        tokens.push({
          type: TokenType.COMMA,
          value: ',',
          start: pos,
          end: pos + 1,
        })
        pos++
        continue
      }

      // String literal
      if (char === "'") {
        const start = pos
        pos++ // skip opening quote
        let value = ''
        while (pos < input.length && input[pos] !== "'") {
          if (
            input[pos] === '\\' &&
            pos + 1 < input.length &&
            input[pos + 1] === "'"
          ) {
            value += "'"
            pos += 2
          } else {
            value += input[pos]
            pos++
          }
        }
        pos++ // skip closing quote
        tokens.push({ type: TokenType.STRING, value, start, end: pos })
        continue
      }

      // Boolean literal
      if (
        input.slice(pos, pos + 4) === 'true' &&
        !isIdentifierChar(input[pos + 4])
      ) {
        tokens.push({
          type: TokenType.BOOLEAN,
          value: 'true',
          start: pos,
          end: pos + 4,
        })
        pos += 4
        continue
      }
      if (
        input.slice(pos, pos + 5) === 'false' &&
        !isIdentifierChar(input[pos + 5])
      ) {
        tokens.push({
          type: TokenType.BOOLEAN,
          value: 'false',
          start: pos,
          end: pos + 5,
        })
        pos += 5
        continue
      }

      // Number literal (including negative)
      if (char === '-' || isDigit(char)) {
        const start = pos
        if (char === '-') pos++
        while (pos < input.length && isDigit(input[pos])) {
          pos++
        }
        if (pos < input.length && input[pos] === '.') {
          pos++
          while (pos < input.length && isDigit(input[pos])) {
            pos++
          }
        }
        const value = input.slice(start, pos)
        // Only treat as number if it's more than just '-'
        if (value !== '-') {
          tokens.push({ type: TokenType.NUMBER, value, start, end: pos })
          continue
        }
        // Reset if just '-'
        pos = start
      }

      // Nested expression start
      if (input.slice(pos, pos + 2) === '${') {
        tokens.push({
          type: TokenType.EXPR_START,
          value: '${',
          start: pos,
          end: pos + 2,
        })
        pos += 2
        expressionDepth++ // Increment depth for nesting
        continue
      }

      // Path (starts with / for absolute, or identifier chars for relative)
      if (char === '/') {
        const start = pos
        pos++ // skip leading /
        while (pos < input.length && isPathChar(input[pos])) {
          pos++
        }
        const value = input.slice(start, pos)
        tokens.push({ type: TokenType.PATH, value, start, end: pos })
        continue
      }

      // Identifier or relative path
      if (isIdentifierStart(char)) {
        const start = pos
        while (pos < input.length && isPathChar(input[pos])) {
          pos++
        }
        const value = input.slice(start, pos)

        // Check if it's a function call (followed by '(')
        let lookahead = pos
        while (lookahead < input.length && /\s/.test(input[lookahead])) {
          lookahead++
        }

        if (input[lookahead] === '(') {
          tokens.push({ type: TokenType.IDENTIFIER, value, start, end: pos })
        } else {
          // It's a relative path
          tokens.push({ type: TokenType.PATH, value, start, end: pos })
        }
        continue
      }

      // Unknown character - skip
      pos++
    } else {
      // TEXT mode - collect literal text until ${ or end
      const start = pos
      let text = ''

      while (pos < input.length) {
        // Check for escaped expression: \${
        if (input[pos] === '\\' && input.slice(pos + 1, pos + 3) === '${') {
          text += '${'
          pos += 3
          continue
        }

        // Check for expression start: ${
        if (input.slice(pos, pos + 2) === '${') {
          break
        }

        text += input[pos]
        pos++
      }

      if (text.length > 0) {
        tokens.push({ type: TokenType.TEXT, value: text, start, end: pos })
      }

      // Expression start
      if (input.slice(pos, pos + 2) === '${') {
        tokens.push({
          type: TokenType.EXPR_START,
          value: '${',
          start: pos,
          end: pos + 2,
        })
        pos += 2
        expressionDepth++ // Increment depth
      }
    }
  }

  tokens.push({ type: TokenType.EOF, value: '', start: pos, end: pos })
  return tokens
}

function isDigit(char: string | undefined): boolean {
  return char !== undefined && char >= '0' && char <= '9'
}

function isIdentifierStart(char: string | undefined): boolean {
  return (
    char !== undefined &&
    ((char >= 'a' && char <= 'z') ||
      (char >= 'A' && char <= 'Z') ||
      char === '_')
  )
}

function isIdentifierChar(char: string | undefined): boolean {
  return isIdentifierStart(char) || isDigit(char)
}

function isPathChar(char: string | undefined): boolean {
  if (char === undefined) return false
  // Path can contain: letters, digits, underscore, hyphen, dot, tilde, slash
  // But not: }, (, ), ,, ', whitespace
  return (
    isIdentifierChar(char) ||
    char === '/' ||
    char === '-' ||
    char === '.' ||
    char === '~'
  )
}
