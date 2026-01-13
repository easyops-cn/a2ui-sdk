/**
 * AudioPlayerComponent - Displays an audio player.
 */

import { memo } from 'react'
import type { AudioPlayerComponent as AudioPlayerComponentType } from '@a2ui-sdk/types/0.9'
import type { A2UIComponentProps } from '../../contexts/ComponentsMapContext'
import { useStringBinding } from '../../hooks/useDataBinding'
import { cn } from '@/lib/utils'

/**
 * AudioPlayer component for playing audio content.
 */
export const AudioPlayerComponent = memo(function AudioPlayerComponent({
  surfaceId,
  component,
}: A2UIComponentProps) {
  const audioComp = component as AudioPlayerComponentType
  const audioUrl = useStringBinding(surfaceId, audioComp.url, '')
  const description = useStringBinding(surfaceId, audioComp.description, '')

  if (!audioUrl) {
    return null
  }

  // Apply weight as flex-grow if set
  const style = audioComp.weight ? { flexGrow: audioComp.weight } : undefined

  return (
    <div className={cn('flex flex-col gap-2')} style={style}>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <audio src={audioUrl} controls className="w-full">
        Your browser does not support the audio element.
      </audio>
    </div>
  )
})

AudioPlayerComponent.displayName = 'A2UI.AudioPlayer'
