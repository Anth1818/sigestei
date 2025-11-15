# 🎨 Guía de Uso de Temas Personalizados

## 📋 Variantes de Tema Disponibles

Después de configurar los temas personalizados, ahora puedes usar estas variantes en Tailwind:

- `light:` - Para tema claro
- `dark:` - Para tema oscuro estándar  
- `theme-blue:` - Para tema azul oscuro
- `theme-violet:` - Para tema violeta

## 🚀 Métodos de Uso

### **Método 1: Variantes de Tailwind (Directo)**

La forma más simple es agregar las variantes directamente en las clases:

```tsx
// ❌ Antes (solo dark)
<div className="text-gray-800 dark:text-white">

// ✅ Ahora (con todos los temas)
<div className="text-gray-800 dark:text-white theme-blue:text-blue-100 theme-violet:text-purple-100">
```

**Ejemplo completo:**
```tsx
<h2 className={`
  text-xl font-bold 
  text-gray-800 
  dark:text-white 
  theme-blue:text-blue-100 
  theme-violet:text-purple-100
`}>
  SIGESTEI
</h2>
```

### **Método 2: Variables CSS (Recomendado - Más Limpio)**

Usa las variables CSS de los temas que automáticamente se adaptan:

```tsx
// ❌ Múltiples clases para cada tema
<div className="text-gray-800 dark:text-white theme-blue:text-blue-100">

// ✅ Una sola clase con variables CSS
<div className="text-foreground">
```

**Variables disponibles:**

| Variable CSS | Propósito |
|-------------|-----------|
| `text-foreground` | Texto principal |
| `text-muted-foreground` | Texto secundario/atenuado |
| `bg-background` | Fondo principal |
| `bg-card` | Fondo de tarjetas |
| `bg-primary` | Color primario |
| `bg-secondary` | Color secundario |
| `border-border` | Bordes |
| `text-accent-foreground` | Texto de acento |

**Ejemplo:**
```tsx
// Se adapta automáticamente a todos los temas
<div className="bg-card text-foreground border border-border rounded-lg p-4">
  <h3 className="text-primary">Título</h3>
  <p className="text-muted-foreground">Descripción</p>
</div>
```

### **Método 3: Helper Functions (Para casos complejos)**

Usa las funciones de `lib/themeUtils.ts` para casos más complejos:

```tsx
import { cn, getStatusBadgeClass, commonThemeClasses } from "@/lib/themeUtils";

// Ejemplo 1: Combinar clases
<div className={cn(
  "text-xl font-bold",
  "text-gray-800 dark:text-white",
  "theme-blue:text-blue-100 theme-violet:text-purple-100"
)}>

// Ejemplo 2: Badges de estado (con soporte para todos los temas)
<span className={getStatusBadgeClass("active")}>Activo</span>
<span className={getStatusBadgeClass("pending")}>Pendiente</span>
<span className={getStatusBadgeClass("error")}>Error</span>

// Ejemplo 3: Clases comunes predefinidas
<button className={commonThemeClasses.button.primary}>
  Botón Primario
</button>
```

## 📝 Ejemplos Prácticos

### Ejemplo 1: Texto con Todos los Temas
```tsx
<p className="
  text-gray-900 
  dark:text-gray-100 
  theme-blue:text-blue-50 
  theme-violet:text-purple-50
">
  Este texto se adapta a todos los temas
</p>
```

### Ejemplo 2: Fondo con Hover
```tsx
<div className="
  bg-white 
  dark:bg-gray-800 
  theme-blue:bg-blue-950 
  theme-violet:bg-purple-950
  hover:bg-gray-50 
  dark:hover:bg-gray-700
  theme-blue:hover:bg-blue-900
  theme-violet:hover:bg-purple-900
">
  Contenido
</div>
```

### Ejemplo 3: Badge de Estado
```tsx
// Opción A: Manual
<span className="
  px-2 py-1 rounded-full text-xs font-semibold
  text-green-600 bg-green-100
  dark:text-white dark:bg-green-900
  theme-blue:bg-green-900/80 theme-blue:text-green-100
  theme-violet:bg-green-900/80 theme-violet:text-green-100
">
  Activo
</span>

// Opción B: Con helper (más limpio)
<span className={getStatusBadgeClass("active")}>
  Activo
</span>
```

### Ejemplo 4: Sidebar Item
```tsx
<div className={cn(
  "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer",
  "text-gray-700 hover:bg-gray-100",
  "dark:text-gray-200 dark:hover:bg-gray-800",
  "theme-blue:text-blue-100 theme-blue:hover:bg-blue-900/50",
  "theme-violet:text-purple-100 theme-violet:hover:bg-purple-900/50"
)}>
  <Icon />
  <span>Menu Item</span>
</div>
```

## 🔄 Migración de Código Existente

### Paso 1: Identifica clases con `dark:`
```bash
# Busca en tu proyecto
grep -r "dark:" --include="*.tsx" --include="*.ts"
```

### Paso 2: Elige tu estrategia

**Opción A: Agregar variantes (rápido pero verboso)**
```tsx
// Antes
className="text-gray-800 dark:text-white"

// Después
className="text-gray-800 dark:text-white theme-blue:text-blue-100 theme-violet:text-purple-100"
```

**Opción B: Usar variables CSS (limpio y escalable)**
```tsx
// Antes
className="text-gray-800 dark:text-white"

// Después
className="text-foreground"
```

**Opción C: Usar helpers (para lógica compleja)**
```tsx
// Antes
className="text-gray-800 dark:text-white"

// Después
className={cn(
  "text-gray-800",
  "dark:text-white",
  "theme-blue:text-blue-100",
  "theme-violet:text-purple-100"
)}
```

## 💡 Mejores Prácticas

### ✅ DO (Hacer)
```tsx
// 1. Usa variables CSS para elementos base
<div className="bg-background text-foreground">

// 2. Usa cn() para combinar clases condicionales
<div className={cn(
  "base-class",
  condition && "conditional-class",
  "dark:dark-class theme-blue:blue-class"
)}>

// 3. Usa helpers para estados repetitivos
<span className={getStatusBadgeClass("active")}>
```

### ❌ DON'T (Evitar)
```tsx
// 1. No mezcles demasiadas clases específicas
<div className="text-gray-800 dark:text-white theme-blue:text-blue-50 theme-violet:text-purple-50 hover:text-gray-700 dark:hover:text-gray-100...">

// 2. No olvides incluir TODOS los temas si usas variantes
<div className="dark:text-white"> <!-- ❌ Falta theme-blue y theme-violet -->

// 3. No uses colores hardcoded cuando hay variables
<div className="bg-gray-900"> <!-- ❌ Usa bg-background -->
```

## 🎯 Casos de Uso Comunes

### 1. Títulos y Encabezados
```tsx
// Recomendado
<h1 className="text-foreground text-2xl font-bold">

// Alternativa con variantes
<h1 className="
  text-gray-900 dark:text-white 
  theme-blue:text-blue-50 theme-violet:text-purple-50
  text-2xl font-bold
">
```

### 2. Tarjetas
```tsx
<div className="bg-card text-card-foreground border border-border rounded-lg p-4">
  <h3 className="text-primary">Título</h3>
  <p className="text-muted-foreground">Descripción</p>
</div>
```

### 3. Botones
```tsx
// Usa las clases predefinidas
<button className={commonThemeClasses.button.primary}>
  Botón Primario
</button>

// O personaliza
<button className="
  bg-primary text-primary-foreground 
  hover:bg-primary/90
  px-4 py-2 rounded-md
">
  Botón
</button>
```

### 4. Inputs
```tsx
<input className="
  bg-background text-foreground
  border border-input
  focus:ring-2 focus:ring-ring
  rounded-md px-3 py-2
" />
```

## 📦 Actualizar Archivos Existentes

Si ya tienes archivos con `dark:`, aquí están los archivos que necesitas actualizar:

1. **`components/layout/AppSidebar.tsx`** ✅ (ya actualizado)
2. **`lib/userUtils.ts`** - Badges de estado de usuario
3. **`lib/requestUtils.ts`** - Badges de estado de solicitudes
4. **`lib/equipmentUtils.ts`** - Badges de estado de equipos (si existe)

## 🔧 Script de Ayuda

Para buscar y reemplazar automáticamente:

```bash
# Buscar archivos con dark: pero sin theme-blue: o theme-violet:
grep -r "dark:" --include="*.tsx" --include="*.ts" | grep -v "theme-blue" | grep -v "theme-violet"
```

## 📚 Recursos Adicionales

- [Tailwind CSS - Custom Variants](https://tailwindcss.com/docs/hover-focus-and-other-states)
- [Next Themes - Documentation](https://github.com/pacocoursey/next-themes)
- Variables CSS del proyecto: `app/globals.css`
- Helpers del proyecto: `lib/themeUtils.ts`
