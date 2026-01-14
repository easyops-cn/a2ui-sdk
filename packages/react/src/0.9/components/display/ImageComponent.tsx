/**
 * ImageComponent - Displays an image with configurable sizing and fit.
 */

import { memo } from 'react'
import type { ImageComponentProps } from '@a2ui-sdk/types/0.9/standard-catalog'
import type { A2UIComponentProps } from '@/0.9/components/types'
import { useStringBinding } from '../../hooks/useDataBinding'
import { cn } from '@/lib/utils'

/**
 * Maps fit property to CSS object-fit values.
 */
const fitStyles: Record<string, string> = {
  contain: 'object-contain',
  cover: 'object-cover',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
}

/**
 * Maps variant to size and style classes.
 * Note: In 0.9, usageHint is renamed to variant.
 */
const variantStyles: Record<string, string> = {
  icon: 'w-6 h-6',
  avatar: 'w-10 h-10 rounded-full',
  smallFeature: 'w-16 h-16',
  mediumFeature: 'w-32 h-32',
  largeFeature: 'w-48 h-48',
  header: 'w-full h-48',
}

/**
 * Image component for displaying images.
 * Supports different sizes via variant and object-fit via fit property.
 */
export const ImageComponent = memo(function ImageComponent({
  surfaceId,
  url,
  fit = 'cover',
  variant,
  weight,
}: A2UIComponentProps<ImageComponentProps>) {
  const imageUrl = useStringBinding(surfaceId, url, '')

  if (!imageUrl) {
    return null
  }

  // Apply weight as flex-grow if set
  const style = weight ? { flexGrow: weight } : undefined

  const className = cn(
    fitStyles[fit] || fitStyles.cover,
    variant && variantStyles[variant]
  )

  return (
    <img
      src={imageUrl}
      alt=""
      className={className}
      style={style}
      loading="lazy"
    />
  )
})

ImageComponent.displayName = 'A2UI.Image'
