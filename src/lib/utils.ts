import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina clases CSS con soporte para Tailwind
 * @param inputs Clases CSS a combinar
 * @returns Clases CSS combinadas y optimizadas
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
