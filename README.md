# SIGESTEI - UI/UX

Sistema integrado de gestión de solicitudes técnicas e inventario de equipos informáticos 

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Desarrollo Local](#-desarrollo-local)
- [Despliegue en Producción](#-despliegue-en-producción)
- [Estructura de Carpetas](#-estructura-de-carpetas)
- [Características Principales](#-características-principales)
- [Convenciones de Código](#-convenciones-de-código)
- [Scripts Disponibles](#-scripts-disponibles)

## 🎯 Descripción General

SIGESTEI es una aplicación web moderna construida con Next.js que permite gestionar de manera eficiente:

- **Inventario de Equipos**: Control completo de equipos tecnológicos (computadoras, periféricos, etc.)
- **Gestión de Solicitudes**: Registro y seguimiento de solicitudes de mantenimiento y asignación
- **Administración de Usuarios**: Gestión de usuarios con diferentes roles y permisos
- **Sistema de Auditoría**: Registro detallado de todas las operaciones en tiempo real
- **Dashboard Analítico**: Visualización de métricas y estadísticas del sistema
- **Generación de Reportes**: Exportación de datos en formato PDF

## 🚀 Tecnologías Utilizadas

### Frontend
- **[Next.js 16](https://nextjs.org/)**: Framework de React con App Router
- **[React 19](https://react.dev/)**: Biblioteca principal de UI
- **[TypeScript 5](https://www.typescriptlang.org/)**: Tipado estático
- **[Tailwind CSS 4](https://tailwindcss.com/)**: Framework de estilos utility-first
- **[Radix UI](https://www.radix-ui.com/)**: Componentes UI accesibles y sin estilos
- **[Lucide React](https://lucide.dev/)**: Biblioteca de iconos

### Gestión de Estado y Datos
- **[Zustand](https://github.com/pmndrs/zustand)**: Gestión de estado global
- **[TanStack Query](https://tanstack.com/query)**: Gestión de datos asíncronos y caché
- **[React Hook Form](https://react-hook-form.com/)**: Gestión de formularios
- **[Zod](https://zod.dev/)**: Validación de esquemas

### UI y Visualización
- **[Recharts](https://recharts.org/)**: Gráficos y visualizaciones
- **[Framer Motion](https://www.framer.com/motion/)**: Animaciones
- **[date-fns](https://date-fns.org/)**: Manipulación de fechas
- **[Sonner](https://sonner.emilkowal.ski/)**: Notificaciones toast
- **[jsPDF](https://github.com/parallax/jsPDF)**: Generación de PDFs

### Comunicación con API
- **[Axios](https://axios-http.com/)**: Cliente HTTP con interceptores

### Herramientas de Desarrollo
- **[PNPM](https://pnpm.io/)**: Gestor de paquetes rápido y eficiente
- **[Turbopack](https://turbo.build/pack)**: Bundler de alta velocidad
- **ESLint**: Linter de código

## 🏗️ Arquitectura del Proyecto

SIGESTEI sigue una arquitectura modular basada en el **App Router de Next.js**, con separación clara de responsabilidades:

### Patrón de Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                     PRESENTACIÓN                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Pages      │  │  Components  │  │   Layouts    │ │
│  │  (app/*)     │  │ (components/)│  │  (layouts/)  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                       LÓGICA                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Hooks      │  │    Utils     │  │   Stores     │ │
│  │  (hooks/)    │  │   (lib/)     │  │  (Zustand)   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                        DATOS                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   API Layer  │  │ React Query  │  │    Types     │ │
│  │   (api/)     │  │   (Cache)    │  │  (lib/types) │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                ┌────────────────┐
                │  Backend API   │
                │ (External)     │
                └────────────────┘
```

### Capas Principales

1. **Capa de Presentación** (`app/`, `components/`, `layouts/`)
   - Componentes de página (rutas)
   - Componentes reutilizables por dominio
   - Layouts compartidos (sidebar, autenticación)

2. **Capa de Lógica de Negocio** (`hooks/`, `lib/`)
   - Custom hooks para lógica compleja
   - Utilidades y funciones helper
   - Gestión de estado con Zustand

3. **Capa de Datos** (`api/`, `lib/types.ts`)
   - Cliente API con Axios e interceptores
   - Tipos TypeScript compartidos
   - Integración con TanStack Query para caché

### Principios de Diseño

- **Component-Driven Development**: Componentes pequeños y reutilizables
- **Separation of Concerns**: Cada capa tiene responsabilidades específicas
- **Type Safety**: TypeScript en todo el código
- **API First**: Comunicación estandarizada con el backend
- **Server-Side Rendering**: Renderizado en el servidor cuando es posible

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: v20.x o superior ([Descargar](https://nodejs.org/))
- **PNPM**: v10.x o superior
  ```bash
  npm install -g pnpm
  ```
- **Git**: Para clonar el repositorio

## 🔧 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd sigestei
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# URL del API Backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# Configuración de Next.js
NEXT_TELEMETRY_DISABLED=1

# Configuración de salida (opcional para producción)
# NEXT_OUTPUT=standalone
```

**Variables de Entorno Disponibles:**

- `NEXT_PUBLIC_API_BASE_URL`: URL base del backend API (requerida)
- `NEXT_TELEMETRY_DISABLED`: Deshabilitar telemetría de Next.js
- `NEXT_OUTPUT`: Configurar output para deployment (`standalone` para Docker)

## 💻 Desarrollo Local

### Iniciar el Servidor de Desarrollo

```bash
pnpm dev
```

El servidor se iniciará en [http://localhost:3000](http://localhost:3000) con:
- ⚡ **Turbopack** habilitado para compilación ultrarrápida
- 🔥 **Hot Reload** automático al editar archivos
- 🎨 **Actualización instantánea** de estilos

### Verificar el Código

```bash
# Ejecutar el linter
pnpm lint

# Verificar tipos de TypeScript
pnpm build
```

### Estructura de Desarrollo

1. **Crear una nueva página**: Agregar `page.tsx` en `app/[ruta]/`
2. **Crear un componente**: Agregar en `components/[dominio]/ComponentName.tsx`
3. **Crear un hook**: Agregar en `hooks/useHookName.ts`
4. **Agregar utilidades**: Agregar en `lib/utilityName.ts`

## 🚢 Despliegue en Producción

### Opción 1: Deployment con Docker

#### Construir la Imagen

```bash
docker build -t sigestei:latest .
```

#### Ejecutar el Contenedor

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://api.tudominio.com/api \
  sigestei:latest
```

#### Docker Compose (Recomendado)

Crea un archivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  sigestei:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE_URL=https://api.tudominio.com/api
      - NODE_ENV=production
    restart: unless-stopped
```

Ejecutar:

```bash
docker-compose up -d
```

### Opción 2: Build Manual

#### 1. Construir la Aplicación

```bash
pnpm build
```

Esto genera:
- Archivos estáticos optimizados
- Código JavaScript minimizado
- Imágenes optimizadas
- Salida en la carpeta `.next/`

#### 2. Iniciar en Modo Producción

```bash
pnpm start
```

La aplicación se ejecutará en el puerto 3000.

### Opción 3: Deployment en Vercel

La forma más rápida de desplegar:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/sigestei)

1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno en Vercel
3. Deploy automático en cada push a main

### Configuración de Producción

#### Variables de Entorno en Producción

```env
NEXT_PUBLIC_API_BASE_URL=https://api.produccion.com/api
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production
```

#### Optimizaciones Aplicadas

- ✅ Tree-shaking automático
- ✅ Code splitting por rutas
- ✅ Compresión de imágenes
- ✅ Minificación de CSS y JavaScript
- ✅ Caché de assets estáticos
- ✅ Server-side rendering cuando corresponde

## 📁 Estructura de Carpetas

```
sigestei/
├── app/                          # App Router de Next.js (rutas y páginas)
│   ├── layout.tsx               # Layout raíz de la aplicación
│   ├── page.tsx                 # Página de inicio
│   ├── globals.css              # Estilos globales
│   ├── dashboard/               # Página del dashboard
│   ├── addEquipment/            # Agregar equipo
│   ├── viewInventory/           # Ver inventario
│   ├── addRequest/              # Crear solicitud
│   ├── viewRequests/            # Ver solicitudes
│   ├── addUser/                 # Agregar usuario
│   ├── viewUsers/               # Ver usuarios
│   ├── editUser/[id]/           # Editar usuario (ruta dinámica)
│   ├── editEquipment/[id]/      # Editar equipo (ruta dinámica)
│   ├── profile/[id]/            # Perfil de usuario
│   ├── audit/                   # Auditoría del sistema
│   ├── login/                   # Página de login
│   └── api/session/             # API routes (sesión)
│
├── components/                   # Componentes React organizados por dominio
│   ├── audit/                   # Componentes de auditoría
│   │   ├── AuditLogTable.tsx
│   │   ├── AuditRealtimeDashboard.tsx
│   │   └── *AuditDetail.tsx
│   ├── auth/                    # Componentes de autenticación
│   │   └── LoginForm.tsx
│   ├── dashboard/               # Componentes del dashboard
│   │   ├── CardDashboard.tsx
│   │   └── RequestChart.tsx
│   ├── inventory/               # Componentes de inventario
│   │   ├── EquipmentTable.tsx
│   │   ├── AddEquipmentForm.tsx
│   │   └── EditEquipmentForm.tsx
│   ├── requests/                # Componentes de solicitudes
│   │   ├── RequestTable.tsx
│   │   ├── AddRequestForm.tsx
│   │   └── RequestFilters.tsx
│   ├── users/                   # Componentes de usuarios
│   ├── layout/                  # Componentes de layout
│   │   ├── AppSidebar.tsx
│   │   └── Sidebar.tsx
│   ├── navigation/              # Componentes de navegación
│   │   ├── navigation.tsx
│   │   ├── nav-user.tsx
│   │   └── team-switcher.tsx
│   ├── profile/                 # Componentes de perfil
│   ├── providers/               # Context providers
│   │   ├── ClientProviders.tsx
│   │   ├── theme-provider.tsx
│   │   └── UserStoreInitializer.tsx
│   ├── shared/                  # Componentes compartidos
│   │   ├── ButtonToNavigate.tsx
│   │   ├── Notification.tsx
│   │   └── DepartmentUserSelector.tsx
│   └── ui/                      # Componentes UI base (shadcn/ui)
│       └── button.tsx, card.tsx, dialog.tsx, etc.
│
├── hooks/                        # Custom React Hooks
│   ├── useUserStore.ts          # Store de Zustand para usuarios
│   ├── useSessionExpiration.ts  # Manejo de sesión
│   ├── useEquipmentActions.ts   # Acciones de equipos
│   ├── useRequestActions.ts     # Acciones de solicitudes
│   ├── usePaginatedRequests.ts  # Paginación
│   ├── useRedirect.ts           # Navegación
│   └── use*Filters.ts           # Filtros varios
│
├── layouts/                      # Layouts reutilizables
│   └── LayoutSideBar.tsx        # Layout con sidebar
│
├── lib/                          # Utilidades y helpers
│   ├── types.ts                 # Tipos TypeScript compartidos
│   ├── constants.ts             # Constantes de la aplicación
│   ├── utils.ts                 # Funciones utilitarias generales
│   ├── auditUtils.ts            # Utilidades de auditoría
│   ├── equipmentUtils.ts        # Utilidades de equipos
│   ├── requestUtils.ts          # Utilidades de solicitudes
│   ├── userUtils.ts             # Utilidades de usuarios
│   ├── pdfUtils.ts              # Generación de PDFs
│   ├── themeUtils.ts            # Manejo de temas
│   └── redirect.ts              # Redirecciones
│
├── api/                          # Capa de comunicación con backend
│   └── api.ts                   # Cliente Axios + interceptores
│
├── data/                         # Datos de configuración
│   └── sidebarNavData.ts        # Datos de navegación del sidebar
│
├── public/                       # Assets estáticos
│   └── images, fonts, etc.
│
├── .github/                      # Configuración de GitHub
│   └── copilot-instructions.md  # Instrucciones para GitHub Copilot
│
├── components.json               # Configuración de shadcn/ui
├── next.config.ts               # Configuración de Next.js
├── tsconfig.json                # Configuración de TypeScript
├── tailwind.config.ts           # Configuración de Tailwind CSS
├── postcss.config.mjs           # Configuración de PostCSS
├── package.json                 # Dependencias y scripts
├── pnpm-lock.yaml               # Lock file de PNPM
├── Dockerfile                   # Configuración de Docker
└── README.md                    # Este archivo
```

### Convenciones de Organización

- **`app/`**: Cada carpeta representa una ruta URL
- **`components/`**: Organizados por dominio/feature, no por tipo
- **`hooks/`**: Un hook por archivo, prefijo `use`
- **`lib/`**: Funciones puras y utilidades sin estado
- **`layouts/`**: Layouts compartidos entre páginas

## ✨ Características Principales

### 🔐 Autenticación y Seguridad
- Login con validación de credenciales
- Sesión persistente con manejo de expiración
- Redirección automática al expirar sesión
- Protección de rutas según roles

### 📊 Dashboard Analítico
- Visualización de métricas en tiempo real
- Gráficos interactivos con Recharts
- Estadísticas de equipos, solicitudes y usuarios
- Filtros por período y estado

### 💼 Gestión de Inventario
- CRUD completo de equipos
- Búsqueda y filtrado avanzado
- Historial de cambios
- Exportación a PDF
- Campos: serie, marca, modelo, estado, ubicación, responsable

### 📝 Sistema de Solicitudes
- Crear solicitudes de mantenimiento/asignación
- Seguimiento de estado (pendiente, en proceso, completado)
- Filtros por fecha, estado, tipo
- Historial de cambios
- Asignación de técnicos
- Notificaciones en tiempo real

### 👥 Administración de Usuarios
- Gestión de usuarios por roles (admin, técnico, usuario)
- Perfiles de usuario con foto
- Cambio de contraseña
- Historial de login
- Departamentos y áreas

### 📋 Sistema de Auditoría
- Registro automático de todas las operaciones
- Visualización en tiempo real
- Filtros por tipo de operación, usuario, fecha
- Detalles completos de cada cambio
- Exportación de logs

### 🎨 Interfaz de Usuario
- Diseño responsive (móvil, tablet, escritorio)
- Tema claro/oscuro
- Animaciones suaves con Framer Motion
- Notificaciones toast
- Navegación intuitiva con sidebar

### 📄 Generación de Reportes
- Exportación de tablas a PDF
- Reportes personalizables
- Formato profesional con jsPDF

## 📝 Convenciones de Código

### Nomenclatura

#### Componentes
```typescript
// PascalCase para componentes
export const UserCard = () => { ... }
export default DashboardPage
```

#### Funciones y Variables
```typescript
// camelCase para funciones y variables
const handleSubmit = () => { ... }
const userName = "John"
```

#### Archivos
- **Componentes**: `ComponentName.tsx`
- **Hooks**: `useHookName.ts`
- **Utilidades**: `utilityName.ts`
- **Tipos**: `types.ts`

### Estructura de Componentes

```typescript
// 1. Imports
import { useState } from "react"
import { Button } from "@/components/ui/button"

// 2. Types/Interfaces
interface ComponentProps {
  title: string
  onSubmit: () => void
}

// 3. Component
export const Component = ({ title, onSubmit }: ComponentProps) => {
  // 3.1. Hooks
  const [state, setState] = useState()
  
  // 3.2. Handlers
  const handleClick = () => { ... }
  
  // 3.3. Effects
  useEffect(() => { ... }, [])
  
  // 3.4. Render
  return (
    <div>...</div>
  )
}
```

### Commits Convencionales

Usa el formato [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user profile page
fix: correct sidebar navigation bug
docs: update README with deployment info
style: format code with prettier
refactor: simplify equipment table logic
test: add tests for auth hook
chore: update dependencies
```

### Rutas y URLs

- ✅ Usa URLs absolutas: `/dashboard`, `/users`
- ❌ Evita URLs relativas: `./dashboard`, `../users`

### Imports

```typescript
// Usa alias @ para imports
import { Button } from "@/components/ui/button"
import { UserData } from "@/lib/types"
import { useUserStore } from "@/hooks/useUserStore"
```

## 📜 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia servidor de desarrollo con Turbopack
pnpm dev --port 3001  # Inicia en un puerto específico

# Producción
pnpm build            # Construye la aplicación para producción
pnpm start            # Inicia el servidor de producción

# Calidad de Código
pnpm lint             # Ejecuta ESLint

# Gestión de Dependencias
pnpm install          # Instala todas las dependencias
pnpm add <package>    # Agrega una dependencia
pnpm remove <package> # Elimina una dependencia
pnpm update           # Actualiza dependencias
```

## 🔗 Enlaces Útiles

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de React](https://react.dev/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Radix UI Components](https://www.radix-ui.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feat/nueva-funcionalidad`)
3. Commit con mensaje convencional (`git commit -m 'feat: add nueva funcionalidad'`)
4. Push a la rama (`git push origin feat/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

---

**Desarrollado con ❤️ usando Next.js, React y TypeScript**
