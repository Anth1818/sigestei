# Endpoints de Auditoría - sigestei-backend

## Resumen
Este documento describe todos los endpoints disponibles para consultar el historial de auditoría del sistema.

---

## Autenticación
Todos los endpoints requieren autenticación mediante cookie `auth-token`.

---

## Endpoints

### 1. Historial de una Solicitud
Obtiene el historial completo de cambios de una solicitud específica.

**URL:** `GET /api/audit/requests/:requestId`

**Acceso:** admin, manager, technician

**Parámetros:**
- `requestId` (path): ID de la solicitud

**Respuesta:**
```json
{
  "general_changes": [
    {
      "id": 1,
      "entity_type": "request",
      "entity_id": 5,
      "change_type": "status_changed",
      "field_name": "status_id",
      "old_value": "1",
      "new_value": "2",
      "changed_by_id": 3,
      "changed_at": "2025-11-07T10:30:00Z",
      "comments": null,
      "changed_by": {
        "id": 3,
        "full_name": "Juan Pérez",
        "email": "juan@example.com"
      }
    }
  ],
  "technician_assignments": [
    {
      "id": 1,
      "request_id": 5,
      "technician_id": 7,
      "previous_technician_id": null,
      "assigned_by_id": 3,
      "assigned_at": "2025-11-07T10:25:00Z",
      "reason": "Asignación inicial",
      "technician": {
        "id": 7,
        "full_name": "Carlos Técnico",
        "email": "carlos@example.com"
      },
      "previous_technician": null,
      "assigned_by": {
        "id": 3,
        "full_name": "Juan Pérez",
        "email": "juan@example.com"
      }
    }
  ]
}
```

---

### 2. Historial de un Equipo
Obtiene el historial completo de cambios de un equipo.

**URL:** `GET /api/audit/equipment/:equipmentId`

**Acceso:** admin, manager, technician

**Parámetros:**
- `equipmentId` (path): ID del equipo

**Respuesta:**
```json
{
  "general_changes": [
    {
      "id": 10,
      "entity_type": "equipment",
      "entity_id": 15,
      "change_type": "status_changed",
      "field_name": "status_id",
      "old_value": "1",
      "new_value": "2",
      "changed_by_id": 3,
      "changed_at": "2025-11-07T14:30:00Z",
      "comments": null,
      "changed_by": {
        "id": 3,
        "full_name": "Juan Pérez",
        "email": "juan@example.com"
      }
    }
  ],
  "assignments": [
    {
      "id": 5,
      "equipment_id": 15,
      "user_id": 20,
      "previous_user_id": 18,
      "location": "Oficina de Sistemas - María García",
      "previous_location": "Recepción - Ana López",
      "assigned_by_id": 3,
      "assigned_at": "2025-11-07T14:00:00Z",
      "reason": "Reasignación por cambio de departamento",
      "user": {
        "id": 20,
        "full_name": "María García",
        "email": "maria@example.com"
      },
      "previous_user": {
        "id": 18,
        "full_name": "Ana López",
        "email": "ana@example.com"
      },
      "assigned_by": {
        "id": 3,
        "full_name": "Juan Pérez",
        "email": "juan@example.com"
      }
    }
  ]
}
```

---

### 3. Historial de Logins de un Usuario
Obtiene el historial de todos los intentos de login de un usuario.

**URL:** `GET /api/audit/users/:userId/logins`

**Acceso:** admin, manager

**Parámetros:**
- `userId` (path): ID del usuario
- `limit` (query, opcional): Número máximo de resultados (default: 20)

**Ejemplo:** `/api/audit/users/5/logins?limit=50`

**Respuesta:**
```json
[
  {
    "id": 125,
    "user_id": 5,
    "login_at": "2025-11-07T09:15:00Z",
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0...",
    "success": true,
    "failure_reason": null
  },
  {
    "id": 124,
    "user_id": 5,
    "login_at": "2025-11-06T16:30:00Z",
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0...",
    "success": false,
    "failure_reason": "Contraseña incorrecta"
  }
]
```

---

### 4. Historial de Cambios de un Usuario
Obtiene el historial de cambios de perfil de un usuario (activación, rol, etc.).

**URL:** `GET /api/audit/users/:userId/changes`

**Acceso:** admin, manager

**Parámetros:**
- `userId` (path): ID del usuario

**Respuesta:**
```json
[
  {
    "id": 45,
    "entity_type": "user",
    "entity_id": 12,
    "change_type": "role_changed",
    "field_name": "role_id",
    "old_value": "4",
    "new_value": "3",
    "changed_by_id": 1,
    "changed_at": "2025-11-07T11:00:00Z",
    "comments": "Cambio de rol de usuario",
    "changed_by": {
      "id": 1,
      "full_name": "Admin Principal",
      "email": "admin@example.com"
    }
  },
  {
    "id": 44,
    "entity_type": "user",
    "entity_id": 12,
    "change_type": "user_deactivated",
    "field_name": "is_active",
    "old_value": "true",
    "new_value": "false",
    "changed_by_id": 1,
    "changed_at": "2025-11-06T15:30:00Z",
    "comments": "Usuario desactivado",
    "changed_by": {
      "id": 1,
      "full_name": "Admin Principal",
      "email": "admin@example.com"
    }
  }
]
```

---

### 5. Cambios Recientes del Sistema
Obtiene los cambios más recientes en todo el sistema.

**URL:** `GET /api/audit/recent`

**Acceso:** admin, manager

**Parámetros:**
- `limit` (query, opcional): Número máximo de resultados (default: 50)

**Ejemplo:** `/api/audit/recent?limit=100`

**Respuesta:**
```json
[
  {
    "id": 250,
    "entity_type": "request",
    "entity_id": 42,
    "change_type": "status_changed",
    "field_name": "status_id",
    "old_value": "2",
    "new_value": "3",
    "changed_by_id": 7,
    "changed_at": "2025-11-07T16:45:00Z",
    "comments": null,
    "changed_by": {
      "id": 7,
      "full_name": "Carlos Técnico",
      "email": "carlos@example.com"
    }
  }
  // ... más cambios
]
```

---

### 6. Estadísticas de Auditoría
Obtiene un resumen de las estadísticas del sistema de auditoría.

**URL:** `GET /api/audit/statistics`

**Acceso:** admin, manager

**Respuesta:**
```json
{
  "request_changes": 1250,
  "equipment_changes": 340,
  "user_changes": 89,
  "total_logins": 5678
}
```

---

### 7. Buscar en Logs de Auditoría
Busca en los logs de auditoría con filtros avanzados.

**URL:** `GET /api/audit/search`

**Acceso:** admin, manager

**Parámetros de Query (todos opcionales):**
- `entity_type`: Tipo de entidad (`request`, `equipment`, `user`)
- `entity_id`: ID de la entidad específica
- `change_type`: Tipo de cambio (`status_changed`, `priority_changed`, etc.)
- `changed_by_id`: ID del usuario que hizo el cambio
- `start_date`: Fecha de inicio (formato ISO 8601)
- `end_date`: Fecha de fin (formato ISO 8601)
- `limit`: Número máximo de resultados (default: 100)

**Ejemplos:**

Buscar todos los cambios de estado de solicitudes del último mes:
```
/api/audit/search?entity_type=request&change_type=status_changed&start_date=2025-10-07T00:00:00Z
```

Buscar todos los cambios hechos por un usuario específico:
```
/api/audit/search?changed_by_id=3&limit=200
```

Buscar cambios en equipos en un rango de fechas:
```
/api/audit/search?entity_type=equipment&start_date=2025-11-01T00:00:00Z&end_date=2025-11-07T23:59:59Z
```

**Respuesta:**
```json
[
  {
    "id": 120,
    "entity_type": "request",
    "entity_id": 25,
    "change_type": "status_changed",
    "field_name": "status_id",
    "old_value": "1",
    "new_value": "2",
    "changed_by_id": 3,
    "changed_at": "2025-11-05T14:20:00Z",
    "comments": null,
    "changed_by": {
      "id": 3,
      "full_name": "Juan Pérez",
      "email": "juan@example.com"
    }
  }
  // ... más resultados
]
```

---

## Tipos de Cambios (change_type)

### Para Solicitudes (`entity_type: 'request'`)
- `status_changed` - Cambio de estado
- `priority_changed` - Cambio de prioridad

### Para Equipos (`entity_type: 'equipment'`)
- `status_changed` - Cambio de estado

### Para Usuarios (`entity_type: 'user'`)
- `user_activated` - Usuario activado
- `user_deactivated` - Usuario desactivado
- `role_changed` - Cambio de rol
- `department_changed` - Cambio de departamento
- `position_changed` - Cambio de cargo
- `profile_updated` - Actualización de perfil

---

## Notas Importantes

1. **Autenticación:** Todos los endpoints requieren cookie de autenticación válida
2. **Autorización:** Los permisos están basados en roles (admin, manager, technician, user)
3. **Paginación:** Usa el parámetro `limit` para controlar la cantidad de resultados
4. **Fechas:** Todas las fechas están en formato ISO 8601 (UTC)
5. **IPs:** Las direcciones IP se registran solo en logins
6. **Integridad:** Los logs de auditoría no se pueden eliminar o modificar

---

## Casos de Uso

### Dashboard de Auditoría
```javascript
// Obtener estadísticas generales
const stats = await fetch('/api/audit/statistics');

// Obtener cambios recientes
const recent = await fetch('/api/audit/recent?limit=20');
```

### Seguimiento de Solicitudes
```javascript
// Ver todo el historial de una solicitud
const history = await fetch('/api/audit/requests/42');
```

### Monitoreo de Equipos
```javascript
// Ver por dónde ha pasado un equipo
const equipmentHistory = await fetch('/api/audit/equipment/15');
```

### Auditoría de Usuarios
```javascript
// Ver logins de un usuario
const logins = await fetch('/api/audit/users/5/logins?limit=50');

// Ver cambios de perfil
const changes = await fetch('/api/audit/users/5/changes');
```

### Búsquedas Personalizadas
```javascript
// Buscar todos los cambios hechos por un admin
const adminChanges = await fetch('/api/audit/search?changed_by_id=1&limit=100');

// Buscar cambios de estado en solicitudes del último mes
const recentStatusChanges = await fetch(
  '/api/audit/search?entity_type=request&change_type=status_changed&start_date=2025-10-07T00:00:00Z'
);
```

---

## Seguridad

- ✅ Autenticación obligatoria en todos los endpoints
- ✅ Control de acceso basado en roles
- ✅ Registro de IP y User-Agent en logins
- ✅ Logs inmutables (no se pueden editar ni eliminar)
- ✅ Seguimiento de quién hizo cada cambio
