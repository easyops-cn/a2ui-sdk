/**
 * ComponentRenderer - Routes component rendering based on type.
 */

import React, { memo } from 'react'
import type { BaseComponentProps } from '../types'
import { useComponent } from '../hooks/useComponent'

// Display components
import {
  TextComponent,
  ImageComponent,
  IconComponent,
  VideoComponent,
  AudioPlayerComponent,
  DividerComponent,
} from './display'

// Layout components (will be imported after creation)
import {
  RowComponent,
  ColumnComponent,
  ListComponent,
  CardComponent,
  TabsComponent,
  ModalComponent,
} from './layout'

// Interactive components (will be imported after creation)
import {
  ButtonComponent,
  CheckBoxComponent,
  TextFieldComponent,
  DateTimeInputComponent,
  MultipleChoiceComponent,
  SliderComponent,
} from './interactive'

/**
 * Component registry mapping component type names to React components.
 */
const componentRegistry: Record<
  string,
  React.ComponentType<BaseComponentProps & Record<string, unknown>>
> = {
  // Display components
  Text: TextComponent,
  Image: ImageComponent,
  Icon: IconComponent,
  Video: VideoComponent,
  AudioPlayer: AudioPlayerComponent,
  Divider: DividerComponent,

  // Layout components
  Row: RowComponent,
  Column: ColumnComponent,
  List: ListComponent,
  Card: CardComponent,
  Tabs: TabsComponent,
  Modal: ModalComponent,

  // Interactive components
  Button: ButtonComponent,
  CheckBox: CheckBoxComponent,
  TextField: TextFieldComponent,
  DateTimeInput: DateTimeInputComponent,
  MultipleChoice: MultipleChoiceComponent,
  Slider: SliderComponent,
}

/**
 * Props for ComponentRenderer.
 */
export interface ComponentRendererProps {
  surfaceId: string
  componentId: string
}

/**
 * Renders a component based on its type from the component registry.
 *
 * @example
 * ```tsx
 * // Render a component by ID
 * <ComponentRenderer surfaceId="surface-1" componentId="text-1" />
 * ```
 */
export const ComponentRenderer = memo(function ComponentRenderer({
  surfaceId,
  componentId,
}: ComponentRendererProps) {
  const component = useComponent(surfaceId, componentId)

  if (!component) {
    console.warn(
      `A2UI: Component not found: ${componentId} on surface ${surfaceId}`
    )
    return null
  }

  // Extract the component type and props from the definition
  // component.component is { [componentType]: props }
  const entries = Object.entries(component.component)
  if (entries.length === 0) {
    console.warn(`A2UI: Component ${componentId} has no type definition`)
    return null
  }

  const [componentType, props] = entries[0]
  const Component = componentRegistry[componentType]

  if (!Component) {
    console.warn(`A2UI: Unknown component type: ${componentType}`)
    return null
  }

  return (
    <Component
      surfaceId={surfaceId}
      componentId={componentId}
      weight={component.weight}
      {...(props as Record<string, unknown>)}
    />
  )
})

ComponentRenderer.displayName = 'A2UI.ComponentRenderer'

/**
 * Registers a custom component type.
 *
 * @param type - The component type name
 * @param component - The React component to register
 *
 * @example
 * ```tsx
 * registerComponent('CustomChart', ({ surfaceId, data }) => {
 *   const chartData = useDataBinding(surfaceId, data, []);
 *   return <Chart data={chartData} />;
 * });
 * ```
 */
export function registerComponent(
  type: string,
  component: React.ComponentType<BaseComponentProps & Record<string, unknown>>
): void {
  componentRegistry[type] = component
}
