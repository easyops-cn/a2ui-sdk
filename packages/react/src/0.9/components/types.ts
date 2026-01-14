/**
 * Base props shared by all A2UI components.
 */
export type A2UIComponentProps<T = unknown> = T & {
  surfaceId: string
  componentId: string
  weight?: number
}
