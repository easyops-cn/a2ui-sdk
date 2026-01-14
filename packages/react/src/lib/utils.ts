import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * A compatible implementation of Object.hasOwn for older browsers.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn
 */
export const hasOwn: (obj: object, key: PropertyKey) => boolean =
  (Object as { hasOwn?: (obj: object, key: PropertyKey) => boolean }).hasOwn ??
  ((obj, key) => Object.prototype.hasOwnProperty.call(obj, key))
