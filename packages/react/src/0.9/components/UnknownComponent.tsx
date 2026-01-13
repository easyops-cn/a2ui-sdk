/**
 * UnknownComponent - Fallback for unknown component types.
 *
 * In development mode, renders a visible placeholder to help developers
 * identify missing or misspelled component types.
 * In production mode, this should log a warning but render minimally.
 */

import type { A2UIComponentProps } from '../contexts/ComponentsMapContext'

/**
 * Fallback component for unknown types.
 *
 * Displays a warning box with the unknown component type name
 * to help developers identify configuration issues.
 */
export function UnknownComponent({ component }: A2UIComponentProps) {
  const componentType = component.component
  const componentId = component.id

  // Log warning in both dev and production
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[A2UI 0.9] Unknown component type "${componentType}" (id: ${componentId}). ` +
        'Make sure the component type is correct or provide a custom component.'
    )
  }

  return (
    <div
      style={{
        padding: '8px 12px',
        margin: '4px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '4px',
        color: '#856404',
        fontSize: '12px',
        fontFamily: 'monospace',
      }}
    >
      <strong>Unknown component:</strong> {componentType}
      <br />
      <span style={{ opacity: 0.7 }}>ID: {componentId}</span>
    </div>
  )
}

UnknownComponent.displayName = 'A2UI.UnknownComponent'
