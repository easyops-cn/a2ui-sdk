import type { Action, ChildrenDefinition, ValueSource } from './index.js'

// ============ Display Component Props ============

/**
 * Text component properties.
 */
export interface TextComponentProps {
  text?: ValueSource
  usageHint?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'caption' | 'body'
}

/**
 * Image component properties.
 */
export interface ImageComponentProps {
  url?: ValueSource
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  usageHint?:
    | 'icon'
    | 'avatar'
    | 'smallFeature'
    | 'mediumFeature'
    | 'largeFeature'
    | 'header'
}

/**
 * Icon component properties.
 */
export interface IconComponentProps {
  name?: ValueSource
}

/**
 * Video component properties.
 */
export interface VideoComponentProps {
  url?: ValueSource
}

/**
 * AudioPlayer component properties.
 */
export interface AudioPlayerComponentProps {
  url?: ValueSource
  description?: ValueSource
}

/**
 * Divider component properties.
 */
export interface DividerComponentProps {
  axis?: 'horizontal' | 'vertical'
}

// ============ Layout Component Props ============

/**
 * Distribution values for flex layouts.
 */
export type Distribution =
  | 'start'
  | 'center'
  | 'end'
  | 'spaceBetween'
  | 'spaceAround'
  | 'spaceEvenly'

/**
 * Alignment values for flex layouts.
 */
export type Alignment = 'start' | 'center' | 'end' | 'stretch'

/**
 * Row component properties.
 */
export interface RowComponentProps {
  children?: ChildrenDefinition
  distribution?: Distribution
  alignment?: Alignment
}

/**
 * Column component properties.
 */
export interface ColumnComponentProps {
  children?: ChildrenDefinition
  distribution?: Distribution
  alignment?: Alignment
}

/**
 * List component properties.
 */
export interface ListComponentProps {
  children?: ChildrenDefinition
  direction?: 'vertical' | 'horizontal'
  alignment?: Alignment
}

/**
 * Card component properties.
 */
export interface CardComponentProps {
  child?: string
}

/**
 * Tab item definition.
 */
export interface TabItem {
  title?: ValueSource
  child: string
}

/**
 * Tabs component properties.
 */
export interface TabsComponentProps {
  tabItems?: TabItem[]
}

/**
 * Modal component properties.
 */
export interface ModalComponentProps {
  entryPointChild?: string
  contentChild?: string
}

// ============ Interactive Component Props ============

/**
 * Button component properties.
 */
export interface ButtonComponentProps {
  child?: string
  primary?: boolean
  action?: Action
}

/**
 * CheckBox component properties.
 */
export interface CheckBoxComponentProps {
  label?: ValueSource
  value?: ValueSource
}

/**
 * TextField component properties.
 */
export interface TextFieldComponentProps {
  label?: ValueSource
  text?: ValueSource
  textFieldType?: 'date' | 'longText' | 'number' | 'shortText' | 'obscured'
  validationRegexp?: string
}

/**
 * DateTimeInput component properties.
 */
export interface DateTimeInputComponentProps {
  label?: ValueSource
  value?: ValueSource
  enableDate?: boolean
  enableTime?: boolean
}

/**
 * MultipleChoice option definition.
 */
export interface MultipleChoiceOption {
  label?: ValueSource
  value: string
}

/**
 * MultipleChoice component properties.
 */
export interface MultipleChoiceComponentProps {
  label?: ValueSource
  selections?: ValueSource
  options?: MultipleChoiceOption[]
  maxAllowedSelections?: number
}

/**
 * Slider component properties.
 */
export interface SliderComponentProps {
  label?: ValueSource
  value?: ValueSource
  minValue?: number
  maxValue?: number
}
