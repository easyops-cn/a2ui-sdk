/**
 * ModalComponent - Modal/Dialog container.
 * Note: In 0.9, entryPointChild/contentChild are renamed to trigger/content.
 */

import { memo, useState } from 'react'
import type { ModalComponentProps } from '@a2ui-sdk/types/0.9/standard-catalog'
import type { A2UIComponentProps } from '@/0.9/components/types'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ComponentRenderer } from '../ComponentRenderer'

/**
 * Modal component - dialog container with trigger.
 */
export const ModalComponent = memo(function ModalComponent({
  surfaceId,
  trigger,
  content,
}: A2UIComponentProps<ModalComponentProps>) {
  const [open, setOpen] = useState(false)

  if (!trigger || !content) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <ComponentRenderer surfaceId={surfaceId} componentId={trigger} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <ComponentRenderer surfaceId={surfaceId} componentId={content} />
      </DialogContent>
    </Dialog>
  )
})

ModalComponent.displayName = 'A2UI.Modal'
