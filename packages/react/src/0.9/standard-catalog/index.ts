/**
 * Standard Catalog for A2UI v0.9
 *
 * This module exports the standard catalog containing all built-in components
 * and functions for A2UI v0.9 protocol.
 *
 * @example
 * ```tsx
 * import { standardCatalog } from '@a2ui-sdk/react/0.9/standard-catalog'
 * import { A2UIProvider, A2UIRenderer } from '@a2ui-sdk/react/0.9'
 *
 * // Use standard catalog as-is
 * <A2UIProvider messages={messages} onAction={handleAction}>
 *   <A2UIRenderer />
 * </A2UIProvider>
 *
 * // Extend standard catalog with custom components
 * const customCatalog = {
 *   ...standardCatalog,
 *   components: {
 *     ...standardCatalog.components,
 *     CustomChart: MyChartComponent,
 *   },
 * }
 * <A2UIProvider messages={messages} onAction={handleAction} catalog={customCatalog}>
 *   <A2UIRenderer />
 * </A2UIProvider>
 * ```
 */

import type { ComponentType } from 'react'

// Display components
import {
  TextComponent,
  ImageComponent,
  IconComponent,
  VideoComponent,
  AudioPlayerComponent,
  DividerComponent,
} from '../components/display'

// Layout components
import {
  RowComponent,
  ColumnComponent,
  ListComponent,
  CardComponent,
  TabsComponent,
  ModalComponent,
  TemplateRenderer,
} from '../components/layout'

// Interactive components
import {
  ButtonComponent,
  TextFieldComponent,
  CheckBoxComponent,
  ChoicePickerComponent,
  SliderComponent,
  DateTimeInputComponent,
} from '../components/interactive'

/**
 * Type for a component in the catalog.
 * Components receive BaseComponentProps plus their specific props spread.
 * We use a loose type here since props are dynamically spread at runtime.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CatalogComponent = ComponentType<any>

/**
 * Type for the components registry in a catalog.
 */
export type CatalogComponents = Record<string, CatalogComponent>

/**
 * Type for functions in a catalog (reserved for future use).
 */
export type CatalogFunctions = Record<string, unknown>

/**
 * Type for a catalog containing components and functions.
 */
export interface Catalog {
  /** Component registry mapping type names to React components */
  components: CatalogComponents
  /** Function registry (reserved for future use) */
  functions: CatalogFunctions
}

/**
 * Standard components included in the default catalog.
 * Type assertions are used because ComponentRenderer spreads props at runtime
 * and the catalog just needs to map component type names to implementations.
 */
export const standardComponents: CatalogComponents = {
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

/**
 * Standard functions included in the default catalog (reserved for future use).
 */
export const standardFunctions: CatalogFunctions = {}

/**
 * The standard catalog containing all built-in A2UI v0.9 components and functions.
 *
 * This is the default catalog used when no custom catalog is provided to A2UIProvider.
 *
 * @example
 * ```tsx
 * // Use as-is
 * <A2UIProvider messages={messages} onAction={handleAction}>
 *   <A2UIRenderer />
 * </A2UIProvider>
 *
 * // Extend with custom components
 * const myCatalog = {
 *   ...standardCatalog,
 *   components: {
 *     ...standardCatalog.components,
 *     MyComponent: MyComponentImpl,
 *   },
 * }
 * ```
 */
export const standardCatalog: Catalog = {
  components: standardComponents,
  functions: standardFunctions,
}

// Re-export individual components for direct imports
export {
  // Display
  TextComponent,
  ImageComponent,
  IconComponent,
  VideoComponent,
  AudioPlayerComponent,
  DividerComponent,
  // Layout
  RowComponent,
  ColumnComponent,
  ListComponent,
  CardComponent,
  TabsComponent,
  ModalComponent,
  TemplateRenderer,
  // Interactive
  ButtonComponent,
  TextFieldComponent,
  CheckBoxComponent,
  ChoicePickerComponent,
  SliderComponent,
  DateTimeInputComponent,
}
