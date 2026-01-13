/**
 * ModalComponent - Modal/Dialog container.
 * Note: In 0.9, entryPointChild/contentChild are renamed to trigger/content.
 */

import { memo, useState } from 'react'
import type { ModalComponent as ModalComponentType } from '@a2ui-sdk/types/0.9'
import type { A2UIComponentProps } from '../../contexts/ComponentsMapContext'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ComponentRenderer } from '../ComponentRenderer'

/**
 * Modal component - dialog container with trigger.
 */
export const ModalComponent = memo(function ModalComponent({
  surfaceId,
  component,
}: A2UIComponentProps) {
  const modalComp = component as ModalComponentType
  const [open, setOpen] = useState(false)

  if (!modalComp.trigger || !modalComp.content) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <ComponentRenderer
            surfaceId={surfaceId}
            componentId={modalComp.trigger}
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <ComponentRenderer
          surfaceId={surfaceId}
          componentId={modalComp.content}
        />
      </DialogContent>
    </Dialog>
  )
})

ModalComponent.displayName = 'A2UI.Modal'
