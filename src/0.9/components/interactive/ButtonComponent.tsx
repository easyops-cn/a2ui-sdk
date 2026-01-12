/**
 * ButtonComponent - Clickable button that triggers actions.
 */

import { memo, useCallback } from 'react'
import type { ButtonComponent as ButtonComponentType } from '../../types'
import type { A2UIComponentProps } from '../../contexts/ComponentsMapContext'
import { useDispatchAction } from '../../hooks/useDispatchAction'
import { useValidation } from '../../hooks/useValidation'
import { Button } from '@/components/ui/button'
import { ComponentRenderer } from '../ComponentRenderer'

/**
 * Button component - triggers actions on click.
 * When checks are defined and fail, the button is disabled.
 */
export const ButtonComponent = memo(function ButtonComponent({
  surfaceId,
  component,
}: A2UIComponentProps) {
  const btnComp = component as ButtonComponentType
  const dispatchAction = useDispatchAction()
  const { valid } = useValidation(surfaceId, btnComp.checks)

  const handleClick = useCallback(() => {
    if (btnComp.action) {
      dispatchAction(surfaceId, btnComp.id, btnComp.action)
    }
  }, [dispatchAction, surfaceId, btnComp.id, btnComp.action])

  // Apply weight as flex-grow if set
  const style = btnComp.weight ? { flexGrow: btnComp.weight } : undefined

  // Disable button if checks fail
  const isDisabled = !valid

  return (
    <Button
      variant={btnComp.primary ? 'default' : 'outline'}
      onClick={handleClick}
      disabled={isDisabled}
      className="inline-flex items-center justify-center"
      style={style}
    >
      {btnComp.child ? (
        <ComponentRenderer surfaceId={surfaceId} componentId={btnComp.child} />
      ) : (
        'Button'
      )}
    </Button>
  )
})

ButtonComponent.displayName = 'A2UI.Button'
