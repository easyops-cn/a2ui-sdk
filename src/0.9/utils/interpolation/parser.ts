/**
 * Parser for string interpolation expressions.
 *
 * Converts a sequence of tokens into an Abstract Syntax Tree (AST).
 * Implements a recursive descent parser for the LL(1) grammar.
 */

import type {
  Token,
  ASTNode,
  InterpolatedStringNode,
  PathNode,
  FunctionCallNode,
  LiteralNode,
} from './types'
import { TokenType } from './types'

/** Maximum nesting depth for expressions to prevent stack overflow */
const MAX_DEPTH = 10

/**
 * Parser state maintaining current position and depth.
 */
interface ParserState {
  tokens: Token[]
  pos: number
  depth: number
}

/**
 * Parses a sequence of tokens into an AST.
 *
 * @param tokens - The tokens to parse
 * @returns The parsed AST (InterpolatedStringNode)
 */
export function parse(tokens: Token[]): InterpolatedStringNode {
  const state: ParserState = { tokens, pos: 0, depth: 0 }
  return parseInterpolatedString(state)
}

/**
 * Returns the current token without advancing.
 */
function peek(state: ParserState): Token {
  return (
    state.tokens[state.pos] || {
      type: TokenType.EOF,
      value: '',
      start: 0,
      end: 0,
    }
  )
}

/**
 * Returns the current token and advances position.
 */
function advance(state: ParserState): Token {
  return (
    state.tokens[state.pos++] || {
      type: TokenType.EOF,
      value: '',
      start: 0,
      end: 0,
    }
  )
}

/**
 * Parses the root interpolated string node.
 */
function parseInterpolatedString(state: ParserState): InterpolatedStringNode {
  const parts: ASTNode[] = []

  while (peek(state).type !== TokenType.EOF) {
    const token = peek(state)

    if (token.type === TokenType.TEXT) {
      advance(state)
      parts.push({ type: 'literal', value: token.value })
    } else if (token.type === TokenType.EXPR_START) {
      advance(state) // consume ${
      state.depth++

      if (state.depth > MAX_DEPTH) {
        // Max depth exceeded - skip to closing }
        console.warn('[A2UI] Parse error: Maximum nesting depth exceeded')
        skipToExprEnd(state)
        state.depth--
        continue
      }

      const expr = parseExpression(state)
      if (expr) {
        parts.push(expr)
      }

      // Expect closing }
      if (peek(state).type === TokenType.EXPR_END) {
        advance(state)
      }
      state.depth--
    } else if (token.type === TokenType.EXPR_END) {
      // Unexpected } - might be from nested expression context
      break
    } else {
      // Skip unknown tokens at top level
      advance(state)
    }
  }

  // If no parts, add empty literal
  if (parts.length === 0) {
    parts.push({ type: 'literal', value: '' })
  }

  return { type: 'interpolatedString', parts }
}

/**
 * Parses a single expression inside ${...}.
 */
function parseExpression(state: ParserState): ASTNode | null {
  const token = peek(state)

  // Path expression (absolute)
  if (token.type === TokenType.PATH) {
    return parsePath(state)
  }

  // Function call or relative path
  if (token.type === TokenType.IDENTIFIER) {
    // Look ahead to see if it's a function call
    const nextPos = state.pos + 1
    const nextToken = state.tokens[nextPos]
    if (nextToken && nextToken.type === TokenType.LPAREN) {
      return parseFunctionCall(state)
    }
    // It's actually a relative path (shouldn't happen if lexer is correct)
    return parsePath(state)
  }

  // Nested expression
  if (token.type === TokenType.EXPR_START) {
    advance(state) // consume ${
    state.depth++

    if (state.depth > MAX_DEPTH) {
      console.warn('[A2UI] Parse error: Maximum nesting depth exceeded')
      skipToExprEnd(state)
      state.depth--
      return null
    }

    const expr = parseExpression(state)
    if (peek(state).type === TokenType.EXPR_END) {
      advance(state)
    }
    state.depth--
    return expr
  }

  // Literal value (inside function args)
  if (
    token.type === TokenType.STRING ||
    token.type === TokenType.NUMBER ||
    token.type === TokenType.BOOLEAN
  ) {
    return parseLiteral(state)
  }

  // Empty or invalid expression
  return null
}

/**
 * Parses a path node.
 */
function parsePath(state: ParserState): PathNode {
  const token = advance(state)
  const absolute = token.value.startsWith('/')
  return { type: 'path', path: token.value, absolute }
}

/**
 * Parses a function call node.
 */
function parseFunctionCall(state: ParserState): FunctionCallNode {
  const nameToken = advance(state) // function name
  advance(state) // consume (

  const args: ASTNode[] = []

  // Parse arguments
  while (
    peek(state).type !== TokenType.RPAREN &&
    peek(state).type !== TokenType.EOF
  ) {
    const arg = parseArgument(state)
    if (arg) {
      args.push(arg)
    }

    // Skip comma between arguments
    if (peek(state).type === TokenType.COMMA) {
      advance(state)
    }
  }

  // Consume closing )
  if (peek(state).type === TokenType.RPAREN) {
    advance(state)
  }

  return { type: 'functionCall', name: nameToken.value, args }
}

/**
 * Parses a function argument.
 */
function parseArgument(state: ParserState): ASTNode | null {
  const token = peek(state)

  // Nested expression ${...}
  if (token.type === TokenType.EXPR_START) {
    advance(state) // consume ${
    state.depth++

    if (state.depth > MAX_DEPTH) {
      console.warn('[A2UI] Parse error: Maximum nesting depth exceeded')
      skipToExprEnd(state)
      state.depth--
      return null
    }

    const expr = parseExpression(state)
    if (peek(state).type === TokenType.EXPR_END) {
      advance(state)
    }
    state.depth--
    return expr
  }

  // Literal string
  if (token.type === TokenType.STRING) {
    return parseLiteral(state)
  }

  // Literal number
  if (token.type === TokenType.NUMBER) {
    return parseLiteral(state)
  }

  // Literal boolean
  if (token.type === TokenType.BOOLEAN) {
    return parseLiteral(state)
  }

  // Path (absolute)
  if (token.type === TokenType.PATH) {
    return parsePath(state)
  }

  // Identifier could be function call or relative path
  if (token.type === TokenType.IDENTIFIER) {
    const nextPos = state.pos + 1
    const nextToken = state.tokens[nextPos]
    if (nextToken && nextToken.type === TokenType.LPAREN) {
      return parseFunctionCall(state)
    }
  }

  return null
}

/**
 * Parses a literal value node.
 */
function parseLiteral(state: ParserState): LiteralNode {
  const token = advance(state)
  return { type: 'literal', value: token.value }
}

/**
 * Skips tokens until expression end is found.
 */
function skipToExprEnd(state: ParserState): void {
  let depth = 1
  while (depth > 0 && peek(state).type !== TokenType.EOF) {
    const token = advance(state)
    if (token.type === TokenType.EXPR_START) {
      depth++
    } else if (token.type === TokenType.EXPR_END) {
      depth--
    }
  }
}
