/**
 * TextComponent - Displays text content.
 */

import { memo, type JSX } from 'react'
import type { TextComponentProps } from '@a2ui-sdk/types/0.9/standard-catalog'
import { useStringBinding } from '../../hooks/useDataBinding'
import { cn } from '@/lib/utils'
import type { A2UIComponentProps } from '@/0.9/components/types'

/**
 * Maps variant to Tailwind CSS classes.
 */
const variantStyles: Record<string, string> = {
  h1: 'text-3xl font-bold tracking-tight',
  h2: 'text-2xl font-semibold tracking-tight',
  h3: 'text-xl font-semibold',
  h4: 'text-lg font-semibold',
  h5: 'text-base font-semibold',
  caption: 'text-sm text-muted-foreground',
  body: 'text-base',
}

/**
 * Maps variant to HTML element type.
 */
const variantElements: Record<string, keyof JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  caption: 'span',
  body: 'p',
}

/**
 * Text component for displaying text content.
 * Supports different text styles via variant.
 */
export const TextComponent = memo(function TextComponent({
  surfaceId,
  text,
  variant = 'body',
  weight,
}: A2UIComponentProps<TextComponentProps>) {
  const textValue = useStringBinding(surfaceId, text, '')

  const className = cn(variantStyles[variant] || variantStyles.body)
  const Element = (variantElements[variant] as 'p') || 'p'

  // Apply weight as flex-grow if set
  const style = weight ? { flexGrow: weight } : undefined

  return (
    <Element className={className} style={style}>
      {textValue}
    </Element>
  )
})

TextComponent.displayName = 'A2UI.Text'
