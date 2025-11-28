# Arquitectura de KSol

## Descripción General

KSol es una aplicación web full-stack construida con una arquitectura moderna de tres capas: presentación (frontend), lógica de negocio (backend) y persistencia (base de datos). La aplicación utiliza **tRPC** como capa de comunicación type-safe entre frontend y backend.

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTE (Browser)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React 19 + TypeScript + Tailwind CSS + shadcn/ui   │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Páginas (Home, Dashboard, Kermesse, etc)    │  │   │
│  │  ├────────────────────────────────────────────────┤  │   │
│  │  │  Componentes (Button, Card, Input, etc)      │  │   │
│  │  ├────────────────────────────────────────────────┤  │   │
│  │  │  tRPC Client (type-safe API calls)           │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/HTTPS
                           │ tRPC Protocol
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVIDOR (Node.js)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Express 4 + tRPC 11 + TypeScript                   │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  tRPC Routers (kermesses, dishes, sales, etc) │  │   │
│  │  ├────────────────────────────────────────────────┤  │   │
│  │  │  Procedimientos (publicProcedure, protected)  │  │   │
│  │  ├────────────────────────────────────────────────┤  │   │
│  │  │  Autenticación (Manus OAuth + JWT)            │  │   │
│  │  ├────────────────────────────────────────────────┤  │   │
│  │  │  Helpers de Base de Datos (db.ts)             │  │   │
│  │  ├────────────────────────────────────────────────┤  │   │
│  │  │  Almacenamiento S3 (storage.ts)               │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ SQL
                           │ Connection Pool
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  PostgreSQL 12+                                      │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Tablas (users, kermesses, dishes, etc)       │  │   │
│  │  ├────────────────────────────────────────────────┤  │   │
│  │  │  Índices y Relaciones                          │  │   │
│  │  ├────────────────────────────────────────────────┤  │   │
│  │  │  Drizzle ORM (schema.ts)                       │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Capas de la Aplicación

### 1. Capa de Presentación (Frontend)

**Ubicación:** `client/src/`

La capa de presentación es responsable de la interfaz de usuario y la experiencia del usuario.

#### Componentes Principales

- **Páginas:** Componentes de nivel superior que representan rutas
  - `Home.tsx` - Página de inicio pública
  - `KermesseDetail.tsx` - Detalle de una kermesse
  - `Dashboard.tsx` - Panel del usuario
  - `CreateKermesse.tsx` - Crear nueva kermesse
  - `ManageKermesse.tsx` - Gestionar kermesse
  - `RegisterSale.tsx` - Registrar ventas
  - `ManageDeliveries.tsx` - Gestionar entregas
  - `SalesReport.tsx` - Reportes de ventas

- **Componentes:** Componentes reutilizables de UI
  - Componentes de shadcn/ui (Button, Card, Input, etc.)
  - Componentes personalizados

- **Hooks:** Lógica reutilizable
  - `useAuth()` - Gestión de autenticación
  - `useAuth()` - Hooks personalizados

- **Contextos:** Estado global
  - `ThemeContext` - Gestión del tema (claro/oscuro)

#### Flujo de Datos

```
Usuario interactúa → Página/Componente → tRPC Hook (useQuery/useMutation)
                                              ↓
                                        Servidor tRPC
                                              ↓
                                        Base de Datos
                                              ↓
                                        Respuesta → UI Actualizada
```

### 2. Capa de Lógica de Negocio (Backend)

**Ubicación:** `server/`

La capa de lógica de negocio procesa las solicitudes, aplica reglas de negocio y coordina con la base de datos.

#### Estructura de tRPC Routers

```typescript
appRouter
├── auth
│   ├── me - Obtener usuario actual
│   └── logout - Cerrar sesión
├── kermesses
│   ├── getActive - Obtener kermesses activas
│   ├── getAll - Obtener todas las kermesses
│   ├── getById - Obtener kermesse por ID
│   ├── getMine - Obtener mis kermesses
│   ├── create - Crear nueva kermesse
│   └── update - Actualizar kermesse
├── dishes
│   ├── getForKermesse - Obtener platos de kermesse
│   ├── create - Crear plato
│   ├── update - Actualizar plato
│   └── delete - Eliminar plato
├── ingredients
│   ├── getForKermesse - Obtener ingredientes
│   ├── create - Crear ingrediente
│   ├── update - Actualizar ingrediente
│   └── delete - Eliminar ingrediente
├── ingredientDonations
│   ├── getForIngredient - Obtener donaciones
│   └── create - Registrar donación
├── sales
│   ├── getForKermesse - Obtener ventas de kermesse
│   ├── getMySales - Obtener mis ventas
│   ├── create - Registrar venta
│   └── updateStatus - Actualizar estado de venta
├── collaborators
│   ├── getForKermesse - Obtener colaboradores
│   ├── add - Agregar colaborador
│   └── remove - Eliminar colaborador
└── deliveries
    ├── getForKermesse - Obtener entregas
    ├── getMyDeliveries - Obtener mis entregas
    ├── create - Crear entrega
    └── updateStatus - Actualizar estado de entrega
```

#### Patrones de Seguridad

- **publicProcedure:** Accesible sin autenticación
- **protectedProcedure:** Requiere usuario autenticado
- **adminProcedure:** Requiere rol de administrador (cuando se implemente)

#### Validación

Todas las entradas se validan con **Zod** en el backend:

```typescript
input: z.object({
  title: z.string().min(1),
  beneficiaryName: z.string().min(1),
  eventDate: z.date(),
})
```

### 3. Capa de Persistencia (Base de Datos)

**Ubicación:** `drizzle/schema.ts`

La capa de persistencia gestiona el almacenamiento y recuperación de datos.

#### Tablas Principales

| Tabla | Descripción |
|-------|-------------|
| `users` | Usuarios del sistema |
| `kermesses` | Eventos benéficos |
| `dishes` | Platos disponibles |
| `collaborators` | Colaboradores de kermesses |
| `ingredients` | Ingredientes necesarios |
| `ingredientDonations` | Registro de donaciones |
| `sales` | Transacciones de venta |
| `saleItems` | Detalles de platos vendidos |
| `deliveries` | Control de entregas |

#### Relaciones

```
users
├── kermesses (1:N) - Usuario crea kermesses
├── collaborators (1:N) - Usuario colabora en kermesses
├── sales (1:N) - Usuario vende platos
└── deliveries (1:N) - Usuario reparte entregas

kermesses
├── dishes (1:N) - Kermesse tiene platos
├── ingredients (1:N) - Kermesse necesita ingredientes
├── collaborators (1:N) - Kermesse tiene colaboradores
└── sales (1:N) - Kermesse genera ventas

dishes
└── saleItems (1:N) - Plato aparece en ventas

ingredients
└── ingredientDonations (1:N) - Ingrediente recibe donaciones

sales
├── saleItems (1:N) - Venta contiene platos
└── deliveries (1:N) - Venta genera entregas
```

#### Tipos de Datos

- **Precios:** Almacenados como enteros (centavos) para evitar problemas de precisión decimal
- **Fechas:** Timestamps UTC en la base de datos, convertidas a zona horaria local en frontend
- **Estados:** Enums para garantizar valores válidos

## Flujo de Autenticación

```
1. Usuario hace clic en "Iniciar Sesión"
                    ↓
2. Redirige a Manus OAuth Portal
                    ↓
3. Usuario se autentica con Manus
                    ↓
4. Manus redirige a /api/oauth/callback con código
                    ↓
5. Servidor intercambia código por token
                    ↓
6. Servidor crea sesión JWT y cookie
                    ↓
7. Usuario redirige a dashboard
                    ↓
8. Cada solicitud incluye cookie de sesión
                    ↓
9. Servidor valida sesión y proporciona contexto de usuario
```

## Flujo de Creación de Kermesse

```
1. Usuario hace clic en "Crear Kermesse"
                    ↓
2. Abre formulario CreateKermesse
                    ↓
3. Usuario completa información
                    ↓
4. Envía mutación tRPC: kermesses.create
                    ↓
5. Servidor valida datos con Zod
                    ↓
6. Servidor verifica autenticación (protectedProcedure)
                    ↓
7. Servidor inserta en tabla kermesses
                    ↓
8. Retorna ID de kermesse creada
                    ↓
9. Frontend redirige a dashboard
                    ↓
10. Usuario ve nueva kermesse en su lista
```

## Flujo de Registro de Venta

```
1. Vendedor abre página RegisterSale
                    ↓
2. Selecciona platos y cantidades
                    ↓
3. Ingresa información del comprador
                    ↓
4. Envía mutación tRPC: sales.create
                    ↓
5. Servidor valida datos
                    ↓
6. Servidor crea registro en tabla sales
                    ↓
7. Servidor crea registros en saleItems para cada plato
                    ↓
8. Servidor actualiza quantitySold en tabla dishes
                    ↓
9. Retorna ID de venta
                    ↓
10. Frontend muestra confirmación
                    ↓
11. Organizador ve venta en reportes
```

## Manejo de Errores

### Frontend

```typescript
const { data, isLoading, error } = trpc.kermesses.getById.useQuery(
  { id: kerMesseId },
  { enabled: kerMesseId > 0 }
);

if (error) {
  // Mostrar toast de error
  toast.error(error.message);
}
```

### Backend

```typescript
throw new TRPCError({
  code: 'UNAUTHORIZED',
  message: 'No tienes permiso para realizar esta acción',
});
```

## Optimizaciones de Rendimiento

### Frontend

- **Code Splitting:** Cada página se carga bajo demanda
- **Lazy Loading:** Componentes se cargan cuando se necesitan
- **Memoización:** Componentes memorizados para evitar re-renders innecesarios
- **Optimistic Updates:** Actualizaciones optimistas para mejor UX

### Backend

- **Connection Pooling:** Reutilización de conexiones a base de datos
- **Índices:** Índices en columnas frecuentemente consultadas
- **Caché:** Caché de sesiones y datos frecuentes

### Base de Datos

- **Índices:** En `id`, `organizerId`, `kerMesseId`, `status`
- **Normalización:** Diseño normalizado para evitar redundancia
- **Particionamiento:** Futuro para tablas grandes

## Seguridad

### Autenticación

- OAuth 2.0 con Manus
- JWT para sesiones
- Cookies seguras (httpOnly, Secure, SameSite)

### Autorización

- Verificación de propiedad en operaciones CRUD
- Roles de usuario (user, admin)
- Procedimientos protegidos en tRPC

### Validación

- Validación en frontend con Zod
- Validación en backend con Zod
- Sanitización de entradas

### Protección de Datos

- HTTPS en producción
- Encriptación de datos sensibles
- No almacenar contraseñas (OAuth)

## Escalabilidad

### Horizontal

- Servidor sin estado (stateless)
- Sesiones en cookies
- Base de datos centralizada

### Vertical

- Índices de base de datos
- Caché en memoria
- Optimización de queries

### Futuro

- CDN para archivos estáticos
- Caché distribuido (Redis)
- Replicación de base de datos
- Microservicios para funcionalidades específicas

## Despliegue

La aplicación está optimizada para despliegue en plataformas modernas:

- **Manus Platform:** Despliegue automático con git push
- **Vercel:** Despliegue de frontend
- **Railway:** Despliegue de backend y base de datos
- **Docker:** Containerización para despliegue flexible

## Monitoreo y Logging

### Logs

- Logs de servidor en stdout
- Logs de errores en stderr
- Logs de base de datos para auditoría

### Métricas

- Tiempo de respuesta de APIs
- Tasa de errores
- Uso de base de datos
- Sesiones activas

## Convenciones de Código

### Nombres

- **Archivos:** camelCase para componentes, kebab-case para utilidades
- **Funciones:** camelCase
- **Constantes:** UPPER_SNAKE_CASE
- **Tipos:** PascalCase

### Estructura

- Importaciones agrupadas (React, librerías, locales)
- Exports nombrados para utilidades
- Exports default para páginas/componentes

### Tipado

- TypeScript estricto
- Tipos inferidos cuando sea posible
- Tipos explícitos para APIs públicas

## Próximas Mejoras Arquitectónicas

1. **Testing:** Agregar vitest para pruebas unitarias e integración
2. **CI/CD:** Pipeline de GitHub Actions
3. **Logging:** Sistema centralizado de logs
4. **Monitoreo:** Integración con Sentry para error tracking
5. **Caché:** Redis para caché distribuido
6. **Búsqueda:** Elasticsearch para búsqueda avanzada
7. **Notificaciones:** Sistema de notificaciones en tiempo real con WebSockets

---

**Última actualización:** Noviembre 2025
