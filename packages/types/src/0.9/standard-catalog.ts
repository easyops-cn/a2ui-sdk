import type {
  Action,
  CheckRule,
  ChildList,
  DynamicBoolean,
  DynamicNumber,
  DynamicString,
  DynamicStringList,
} from './index.js'

// ============ Display Component Props ============

/**
 * Justify values for flex layouts (main axis distribution).
 */
export type Justify =
  | 'start'
  | 'center'
  | 'end'
  | 'spaceBetween'
  | 'spaceAround'
  | 'spaceEvenly'
  | 'stretch'

/**
 * Align values for flex layouts (cross axis alignment).
 */
export type Align = 'start' | 'center' | 'end' | 'stretch'

/**
 * Tab item definition.
 */
export interface TabItem {
  title: DynamicString
  /** Component ID */
  child: string
}

/**
 * Choice option definition.
 */
export interface ChoiceOption {
  label: DynamicString
  value: string
}

/**
 * Text component props.
 */
export interface TextComponentProps {
  text: DynamicString
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'caption' | 'body'
}

/**
 * Image component props.
 */
export interface ImageComponentProps {
  url: DynamicString
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  variant?:
    | 'icon'
    | 'avatar'
    | 'smallFeature'
    | 'mediumFeature'
    | 'largeFeature'
    | 'header'
}

/**
 * Icon component props.
 */
export interface IconComponentProps {
  name: DynamicString
}

/**
 * Video component props.
 */
export interface VideoComponentProps {
  url: DynamicString
}

/**
 * AudioPlayer component props.
 */
export interface AudioPlayerComponentProps {
  url: DynamicString
  description?: DynamicString
}

/**
 * Divider component props.
 */
export interface DividerComponentProps {
  axis?: 'horizontal' | 'vertical'
}

// ============ Layout Component Props ============

/**
 * Row component props.
 */
export interface RowComponentProps {
  children: ChildList
  justify?: Justify
  align?: Align
}

/**
 * Column component props.
 */
export interface ColumnComponentProps {
  children: ChildList
  justify?: Justify
  align?: Align
}

/**
 * List component props.
 */
export interface ListComponentProps {
  children: ChildList
  direction?: 'vertical' | 'horizontal'
  align?: Align
}

/**
 * Card component props.
 */
export interface CardComponentProps {
  child: string
}

/**
 * Tabs component props.
 */
export interface TabsComponentProps {
  tabs: TabItem[]
}

/**
 * Modal component props.
 */
export interface ModalComponentProps {
  trigger: string
  content: string
}

// ============ Interactive Component Props ============

/**
 * Checkable props mixin for validation.
 */
export interface CheckableProps {
  checks?: CheckRule[]
}

/**
 * Button component props.
 */
export interface ButtonComponentProps extends CheckableProps {
  child: string
  primary?: boolean
  action: Action
}

/**
 * TextField component props.
 */
export interface TextFieldComponentProps extends CheckableProps {
  label: DynamicString
  value?: DynamicString
  variant?: 'longText' | 'number' | 'shortText' | 'obscured'
}

/**
 * CheckBox component props.
 */
export interface CheckBoxComponentProps extends CheckableProps {
  label: DynamicString
  value: DynamicBoolean
}

/**
 * ChoicePicker component props.
 */
export interface ChoicePickerComponentProps extends CheckableProps {
  label?: DynamicString
  variant?: 'multipleSelection' | 'mutuallyExclusive'
  options: ChoiceOption[]
  value: DynamicStringList
}

/**
 * Slider component props.
 */
export interface SliderComponentProps extends CheckableProps {
  label?: DynamicString
  min: number
  max: number
  value: DynamicNumber
}

/**
 * DateTimeInput component props.
 */
export interface DateTimeInputComponentProps extends CheckableProps {
  value: DynamicString
  enableDate?: boolean
  enableTime?: boolean
  outputFormat?: string
  label?: DynamicString
}
