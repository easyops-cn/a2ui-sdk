/**
 * VideoComponent - Displays video content.
 */

import React, { memo } from 'react'
import type { VideoComponentProps } from '../../types'
import { useDataBinding } from '../../hooks/useDataBinding'
import { cn } from '../../../../../lib/utils'

/**
 * Video component for displaying video content.
 */
export const VideoComponent = memo(function VideoComponent({
  surfaceId,
  url,
}: VideoComponentProps) {
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
