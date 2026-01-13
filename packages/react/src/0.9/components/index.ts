/**
 * Components exports and registry.
 */

import type { ComponentType } from 'react'
import type { A2UIComponentProps } from '../contexts/ComponentsMapContext'

// Display components
import {
  TextComponent,
  ImageComponent,
  IconComponent,
  VideoComponent,
  AudioPlayerComponent,
  DividerComponent,
} from './display'

// Layout components
import {
  RowComponent,
  ColumnComponent,
  ListComponent,
  CardComponent,
  TabsComponent,
  ModalComponent,
} from './layout'

// Interactive components
import {
  ButtonComponent,
  TextFieldComponent,
  CheckBoxComponent,
  ChoicePickerComponent,
  SliderComponent,
  DateTimeInputComponent,
} from './interactive'

// Re-export component renderer
export { ComponentRenderer, registerComponent } from './ComponentRenderer'
export { UnknownComponent } from './UnknownComponent'

// Re-export all components
export {
  TextComponent,
  ImageComponent,
  IconComponent,
  VideoComponent,
  AudioPlayerComponent,
  DividerComponent,
} from './display'
export {
  RowComponent,
  ColumnComponent,
  ListComponent,
  CardComponent,
  TabsComponent,
  ModalComponent,
  TemplateRenderer,
} from './layout'
export {
  ButtonComponent,
  TextFieldComponent,
  CheckBoxComponent,
  ChoicePickerComponent,
  SliderComponent,
  DateTimeInputComponent,
} from './interactive'

/**
 * Default component registry mapping component type names to React components.
 * Contains all 18 standard catalog components.
 */
export const componentRegistry: Record<
  string,
  ComponentType<A2UIComponentProps>
> = {
  // Display components (6)
  Text: TextComponent,
  Image: ImageComponent,
  Icon: IconComponent,
  Video: VideoComponent,
  AudioPlayer: AudioPlayerComponent,
  Divider: DividerComponent,

  // Layout components (6)
  Row: RowComponent,
  Column: ColumnComponent,
  List: ListComponent,
  Card: CardComponent,
  Tabs: TabsComponent,
  Modal: ModalComponent,

  // Interactive components (6)
  Button: ButtonComponent,
  TextField: TextFieldComponent,
  CheckBox: CheckBoxComponent,
  ChoicePicker: ChoicePickerComponent,
  Slider: SliderComponent,
  DateTimeInput: DateTimeInputComponent,
}
