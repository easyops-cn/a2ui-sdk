/**
 * VideoComponent - Displays video content.
 */

import { memo } from 'react'
import type { VideoComponent as VideoComponentType } from '@a2ui-sdk/types/0.9'
import type { A2UIComponentProps } from '../../contexts/ComponentsMapContext'
import { useStringBinding } from '../../hooks/useDataBinding'
import { cn } from '@/lib/utils'

/**
 * Video component for displaying video content.
 */
export const VideoComponent = memo(function VideoComponent({
  surfaceId,
  component,
}: A2UIComponentProps) {
  const videoComp = component as VideoComponentType
  const videoUrl = useStringBinding(surfaceId, videoComp.url, '')

  if (!videoUrl) {
    return null
  }

  // Apply weight as flex-grow if set
  const style = videoComp.weight ? { flexGrow: videoComp.weight } : undefined

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
