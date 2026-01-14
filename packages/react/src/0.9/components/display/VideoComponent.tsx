/**
 * VideoComponent - Displays video content.
 */

import { memo } from 'react'
import type { VideoComponentProps } from '@a2ui-sdk/types/0.9/standard-catalog'
import type { A2UIComponentProps } from '@/0.9/components/types'
import { useStringBinding } from '../../hooks/useDataBinding'
import { cn } from '@/lib/utils'

/**
 * Video component for displaying video content.
 */
export const VideoComponent = memo(function VideoComponent({
  surfaceId,
  url,
  weight,
}: A2UIComponentProps<VideoComponentProps>) {
  const videoUrl = useStringBinding(surfaceId, url, '')

  if (!videoUrl) {
    return null
  }

  // Apply weight as flex-grow if set
  const style = weight ? { flexGrow: weight } : undefined

  return (
    <video
      src={videoUrl}
      controls
      className={cn('w-full rounded-lg')}
      style={style}
    >
      <track kind="captions" />
      Your browser does not support the video tag.
    </video>
  )
})

VideoComponent.displayName = 'A2UI.Video'
