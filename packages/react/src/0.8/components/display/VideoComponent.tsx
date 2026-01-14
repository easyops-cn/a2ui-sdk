/**
 * VideoComponent - Displays video content.
 */

import { memo } from 'react'
import type { VideoComponentProps } from '@a2ui-sdk/types/0.8/standard-catalog'
import { useDataBinding } from '@/0.8/hooks/useDataBinding'
import { cn } from '@/lib/utils'
import type { A2UIComponentProps } from '@/0.8/components/types'

/**
 * Video component for displaying video content.
 */
export const VideoComponent = memo(function VideoComponent({
  surfaceId,
  url,
}: A2UIComponentProps<VideoComponentProps>) {
  const videoUrl = useDataBinding<string>(surfaceId, url, '')

  if (!videoUrl) {
    return null
  }

  return (
    <video src={videoUrl} controls className={cn('w-full rounded-lg')}>
      <track kind="captions" />
      Your browser does not support the video tag.
    </video>
  )
})

VideoComponent.displayName = 'A2UI.Video'
