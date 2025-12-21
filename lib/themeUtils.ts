/**
 * Utilidades para trabajar con temas personalizados
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind de manera inteligente
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Tipos de variantes de tema disponibles
 */
export type ThemeVariant = "light" | "dark" | "theme-blue" | "theme-violet";

/**
 * Configuración de clases para diferentes temas
 * Usa esto cuando necesites clases específicas por tema
 */
export interface ThemeClasses {
  light?: string;
  dark?: string;
  "theme-blue"?: string;
  "theme-violet"?: string;
  default?: string; // Fallback para todos los temas
}

/**
 * Genera clases de Tailwind para todos los temas
 * 
 * @example
 * ```tsx
 * <div className={themeClasses({
 *   default: "text-gray-800",
 *   dark: "dark:text-white",
 *   "theme-blue": "theme-blue:text-blue-100",
 *   "theme-violet": "theme-violet:text-purple-100"
 * })}>
 * ```
 */
export function themeClasses(classes: ThemeClasses): string {
  const classArray: string[] = [];
  
  if (classes.default) classArray.push(classes.default);
  if (classes.light) classArray.push(classes.light);
  if (classes.dark) classArray.push(classes.dark);
  if (classes["theme-blue"]) classArray.push(classes["theme-blue"]);
  if (classes["theme-violet"]) classArray.push(classes["theme-violet"]);
  
  return cn(...classArray);
}

/**
 * Clases predefinidas para elementos comunes
 */
export const commonThemeClasses = {
  // Texto principal
  text: {
    primary: "text-foreground",
    secondary: "text-muted-foreground",
    accent: "text-accent-foreground",
  },
  
  // Fondos
  bg: {
    primary: "bg-background",
    card: "bg-card",
    accent: "bg-accent",
    muted: "bg-muted",
  },
  
  // Bordes
  border: {
    default: "border-border",
    input: "border-input",
  },
  
  // Botones
  button: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  },
  
  // Estados
  status: {
    active: cn(
      "text-green-600 bg-green-100 dark:text-white dark:bg-green-900",
      "theme-blue:bg-green-900/80 theme-blue:text-green-100",
      "theme-violet:bg-green-900/80 theme-violet:text-green-100",
      "theme-orange:bg-green-900/80 theme-orange:text-green-100"
    ),
    inactive: cn(
      "text-red-600 bg-red-100 dark:text-white dark:bg-red-900",
      "theme-blue:bg-red-900/80 theme-blue:text-red-100",
      "theme-violet:bg-red-900/80 theme-violet:text-red-100",
      "theme-orange:bg-red-900/80 theme-orange:text-red-100"
    ),
    pending: cn(
      "text-orange-600 bg-orange-100 dark:text-white dark:bg-orange-900",
      "theme-blue:bg-orange-900/80 theme-blue:text-orange-100",
      "theme-violet:bg-orange-900/80 theme-violet:text-orange-100",
      "theme-orange:bg-orange-900/80 theme-orange:text-orange-100"
    ),
    success: cn(
      "text-green-600 bg-green-100 dark:text-white dark:bg-green-900",
      "theme-blue:bg-green-900/80 theme-blue:text-green-100",
      "theme-violet:bg-green-900/80 theme-violet:text-green-100",
      "theme-orange:bg-green-900/80 theme-orange:text-green-100"
    ),
  },
} as const;

/**
 * Hook personalizado para obtener clases según el tema actual
 * (Requiere 'use client' en el componente que lo use)
 */
export function getThemeAwareClass(baseClass: string, themeSpecific?: Partial<Record<ThemeVariant, string>>): string {
  const classes = [baseClass];
  
  if (themeSpecific) {
    Object.entries(themeSpecific).forEach(([theme, className]) => {
      if (className) {
        classes.push(`${theme}:${className}`);
      }
    });
  }
  
  return cn(...classes);
}

/**
 * Clases para badges/etiquetas de estado con soporte para todos los temas
 */
export function getStatusBadgeClass(
  status: "active" | "inactive" | "pending" | "success" | "error" | "warning" | "info"
): string {
  const baseClass = "px-2 py-1 rounded-full text-xs font-semibold";
  
  const statusClasses = {
    active: cn(
      baseClass,
      "text-green-600 bg-green-100",
      "dark:text-white dark:bg-green-900",
      "theme-blue:bg-green-900/80 theme-blue:text-green-100",
      "theme-violet:bg-green-900/80 theme-violet:text-green-100",
      "theme-orange:bg-green-900/80 theme-orange:text-green-100"
    ),
    inactive: cn(
      baseClass,
      "text-red-600 bg-red-100",
      "dark:text-white dark:bg-red-900",
      "theme-blue:bg-red-900/80 theme-blue:text-red-100",
      "theme-violet:bg-red-900/80 theme-violet:text-red-100",
      "theme-orange:bg-red-900/80 theme-orange:text-red-100"
    ),
    pending: cn(
      baseClass,
      "text-orange-600 bg-orange-100",
      "dark:text-white dark:bg-orange-900",
      "theme-blue:bg-orange-900/80 theme-blue:text-orange-100",
      "theme-violet:bg-orange-900/80 theme-violet:text-orange-100",
      "theme-orange:bg-orange-900/80 theme-orange:text-orange-100"
    ),
    success: cn(
      baseClass,
      "text-green-600 bg-green-100",
      "dark:text-white dark:bg-green-900",
      "theme-blue:bg-green-900/80 theme-blue:text-green-100",
      "theme-violet:bg-green-900/80 theme-violet:text-green-100",
      "theme-orange:bg-green-900/80 theme-orange:text-green-100"
    ),
    error: cn(
      baseClass,
      "text-red-600 bg-red-100",
      "dark:text-white dark:bg-red-900",
      "theme-blue:bg-red-900/80 theme-blue:text-red-100",
      "theme-violet:bg-red-900/80 theme-violet:text-red-100",
      "theme-orange:bg-red-900/80 theme-orange:text-red-100"
    ),
    warning: cn(
      baseClass,
      "text-yellow-600 bg-yellow-100",
      "dark:text-white dark:bg-yellow-900",
      "theme-blue:bg-yellow-900/80 theme-blue:text-yellow-100",
      "theme-violet:bg-yellow-900/80 theme-violet:text-yellow-100",
      "theme-orange:bg-yellow-900/80 theme-orange:text-yellow-100"
    ),
    info: cn(
      baseClass,
      "text-blue-600 bg-blue-100",
      "dark:text-white dark:bg-blue-900",
      "theme-blue:bg-blue-900/80 theme-blue:text-blue-100",
      "theme-violet:bg-blue-900/80 theme-violet:text-purple-100",
      "theme-orange:bg-blue-900/80 theme-orange:text-blue-100"
    ),
  };
  
  return statusClasses[status] || statusClasses.info;
}
