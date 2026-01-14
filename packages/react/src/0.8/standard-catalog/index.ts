/**
 * Standard Catalog for A2UI v0.8
 *
 * This module exports the standard catalog containing all built-in components
 * and functions for A2UI v0.8 protocol.
 *
 * @example
 * ```tsx
 * import { standardCatalog } from '@a2ui-sdk/react/0.8/standard-catalog'
 * import { A2UIProvider, A2UIRenderer } from '@a2ui-sdk/react/0.8'
 *
 * // Use standard catalog as-is
 * <A2UIProvider messages={messages} catalog={standardCatalog}>
 *   <A2UIRenderer onAction={handleAction} />
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
 * <A2UIProvider messages={messages} catalog={customCatalog}>
 *   <A2UIRenderer onAction={handleAction} />
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
} from '../components/layout'

// Interactive components
import {
  ButtonComponent,
  CheckBoxComponent,
  TextFieldComponent,
  DateTimeInputComponent,
  MultipleChoiceComponent,
  SliderComponent,
} from '../components/interactive'
import type { A2UIComponentProps } from '../components/types'

/**
 * Type for a component in the catalog.
 */
export type CatalogComponent = ComponentType<A2UIComponentProps>

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
  functions?: CatalogFunctions
}

/**
 * Standard components included in the default catalog.
 */
export const standardComponents: CatalogComponents = {
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
 * Standard functions included in the default catalog (reserved for future use).
 */
// export const standardFunctions: CatalogFunctions = {}

/**
 * The standard catalog containing all built-in A2UI v0.8 components and functions.
 *
 * This is the default catalog used when no custom catalog is provided to A2UIProvider.
 *
 * @example
 * ```tsx
 * // Use as-is
 * <A2UIProvider messages={messages} catalog={standardCatalog}>
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
  // functions: standardFunctions,
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
  // Interactive
  ButtonComponent,
  CheckBoxComponent,
  TextFieldComponent,
  DateTimeInputComponent,
  MultipleChoiceComponent,
  SliderComponent,
}
