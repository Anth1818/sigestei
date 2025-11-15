# 🎨 Guía de Temas - SIGESTEI

Este proyecto incluye múltiples temas para personalizar la experiencia visual de la aplicación.

## 📋 Temas Disponibles

### Temas Base
1. **Light** - Tema claro por defecto
2. **Dark** - Tema oscuro estándar
3. **System** - Se adapta automáticamente al tema del sistema operativo

### Temas Personalizados (Modo Oscuro)
4. **Azul Oscuro** (`theme-blue`) - Tema oscuro con tonos azules
   - Colores principales en tonos azul profundo
   - Ideal para ambientes nocturnos
   - Contraste optimizado para lectura prolongada

5. **Violeta** (`theme-violet`) - Tema oscuro con tonos violetas/púrpura
   - Colores principales en tonos violeta
   - Estilo moderno y elegante
   - Perfecto para diferenciación visual

## 🔧 Cómo Cambiar de Tema

### Desde la Interfaz
1. Busca el botón de tema (icono de sol/luna) en la barra de navegación
2. Haz clic en el botón
3. Selecciona el tema deseado del menú desplegable

### Programáticamente
```tsx
import { useTheme } from "next-themes"

function MiComponente() {
  const { setTheme } = useTheme()
  
  // Cambiar a tema azul
  setTheme("theme-blue")
  
  // Cambiar a tema violeta
  setTheme("theme-violet")
  
  // Volver al tema oscuro estándar
  setTheme("dark")
}
```

## 🎨 Personalización de Temas

Los temas están definidos en `app/globals.css`. Cada tema incluye variables CSS personalizadas:

```css
.theme-blue {
  --background: oklch(0.15 0.03 240);
  --foreground: oklch(0.98 0.01 240);
  --primary: oklch(0.55 0.18 240);
  /* ... más variables ... */
}
```

### Variables de Color Disponibles
- `--background`: Color de fondo principal
- `--foreground`: Color de texto principal
- `--card`: Color de fondo de tarjetas
- `--primary`: Color primario (botones, enlaces)
- `--secondary`: Color secundario
- `--muted`: Color atenuado
- `--accent`: Color de acento
- `--destructive`: Color para acciones destructivas
- `--border`: Color de bordes
- `--input`: Color de campos de entrada
- `--ring`: Color de enfoque/anillos
- `--sidebar-*`: Variables específicas de la barra lateral
- `--chart-*`: Variables para gráficos

## 🚀 Agregar Nuevos Temas

Para agregar un nuevo tema:

1. **Definir el tema en `app/globals.css`:**
```css
.theme-mi-tema {
  --background: /* tu color */;
  --foreground: /* tu color */;
  /* ... definir todas las variables ... */
}
```

2. **Agregar al ThemeProvider en `components/providers/ClientProviders.tsx`:**
```tsx
<ThemeProvider
  themes={["light", "dark", "theme-blue", "theme-violet", "theme-mi-tema"]}
>
```

3. **Agregar opción en el selector de temas `components/ui/theme-toggle.tsx`:**
```tsx
<DropdownMenuItem onClick={() => setTheme("theme-mi-tema")}>
  <div className="mr-2 h-4 w-4 rounded-full bg-[color]" />
  Mi Tema
</DropdownMenuItem>
```

## 🎯 Colores OKLCH

Los temas utilizan el espacio de color OKLCH que ofrece:
- Mayor precisión en la percepción del color
- Mejor interpolación de colores
- Soporte para colores HDR
- Sintaxis: `oklch(lightness chroma hue)`

Ejemplo:
```css
/* oklch(luminosidad saturación tono) */
--primary: oklch(0.55 0.18 240);
/*              55%    18%    240° (azul) */
```

## 📱 Compatibilidad

Los temas son compatibles con:
- ✅ Next.js 14+
- ✅ Tailwind CSS v4
- ✅ next-themes
- ✅ Todos los navegadores modernos
- ✅ Modo oscuro del sistema

## 💡 Consejos

- Los temas personalizados están optimizados para modo oscuro
- Usa `theme="system"` para respetar las preferencias del usuario
- Los temas persisten en localStorage automáticamente
- Las transiciones de tema están deshabilitadas para mejor rendimiento
