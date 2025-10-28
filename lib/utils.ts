import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const colorForSoonerError = {
  backgroundColor: 'var(--color-error-sooner)',
  color: 'white',
}
