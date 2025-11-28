# Guía de Instalación y Configuración - KSol

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados:

- **Node.js** 18.0.0 o superior ([descargar](https://nodejs.org/))
- **npm** o **pnpm** (se recomienda pnpm)
- **PostgreSQL** 12 o superior ([descargar](https://www.postgresql.org/download/))
- **Git** ([descargar](https://git-scm.com/))

### Verificar Instalación

```bash
# Verificar Node.js
node --version  # Debe ser v18.0.0 o superior

# Verificar npm
npm --version

# Verificar pnpm (si está instalado)
pnpm --version

# Verificar PostgreSQL
psql --version
```

## Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/ksol.git
cd ksol
```

### 2. Instalar Dependencias

```bash
# Usando pnpm (recomendado)
pnpm install

# O usando npm
npm install
```

### 3. Configurar Variables de Entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores:

```env
# Base de Datos
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/ksol

# Autenticación
JWT_SECRET=tu-secreto-jwt-muy-seguro-aqui
VITE_APP_ID=tu-app-id-de-manus
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# Información del Propietario
OWNER_NAME=Tu Nombre
OWNER_OPEN_ID=tu-open-id

# Título y Logo
VITE_APP_TITLE=KSol - Gestor de Kermesses Benéficas
VITE_APP_LOGO=/logo.svg

# APIs Internas
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=tu-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=tu-frontend-api-key

# Analytics (Opcional)
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=tu-website-id
```

### 4. Crear Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE ksol;
CREATE USER ksol_user WITH PASSWORD 'contraseña_segura';
GRANT ALL PRIVILEGES ON DATABASE ksol TO ksol_user;

# Salir
\q
```

Actualiza `DATABASE_URL` en `.env.local`:

```env
DATABASE_URL=postgresql://ksol_user:contraseña_segura@localhost:5432/ksol
```

### 5. Ejecutar Migraciones

```bash
# Generar migraciones
pnpm drizzle-kit generate

# Ejecutar migraciones
pnpm drizzle-kit migrate

# O usar el comando combinado
pnpm db:push
```

### 6. Iniciar Servidor de Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## Configuración de Manus OAuth

Para que la autenticación funcione, necesitas configurar Manus OAuth:

### 1. Crear Aplicación en Manus

1. Ve a [Manus Dashboard](https://dashboard.manus.im)
2. Crea una nueva aplicación
3. Configura los siguientes URLs de redirección:
   - `http://localhost:3000/api/oauth/callback` (desarrollo)
   - `https://tu-dominio.com/api/oauth/callback` (producción)

### 2. Obtener Credenciales

Copia las credenciales de tu aplicación:
- `VITE_APP_ID` - ID de la aplicación
- `BUILT_IN_FORGE_API_KEY` - Clave API

### 3. Actualizar `.env.local`

```env
VITE_APP_ID=tu-app-id-obtenido
BUILT_IN_FORGE_API_KEY=tu-api-key-obtenido
```

## Estructura de Carpetas

```
ksol/
├── client/                    # Frontend (React)
│   ├── src/
│   │   ├── pages/            # Páginas principales
│   │   ├── components/       # Componentes reutilizables
│   │   ├── lib/              # Utilidades
│   │   ├── contexts/         # Contextos de React
│   │   ├── App.tsx           # Componente raíz
│   │   └── main.tsx          # Punto de entrada
│   ├── public/               # Archivos estáticos
│   └── index.html            # HTML principal
│
├── server/                    # Backend (Express + tRPC)
│   ├── routers.ts            # Definición de APIs
│   ├── db.ts                 # Helpers de BD
│   └── _core/                # Código base
│
├── drizzle/                   # Esquema y migraciones
│   ├── schema.ts             # Definición de tablas
│   └── migrations/           # Archivos de migración
│
├── docs/                      # Documentación
│   ├── ARCHITECTURE.md       # Arquitectura
│   ├── API.md                # Documentación de APIs
│   ├── DATABASE.md           # Esquema de BD
│   ├── SETUP.md              # Este archivo
│   ├── DEPLOYMENT.md         # Despliegue
│   └── CONTRIBUTING.md       # Contribución
│
├── .env.example              # Variables de entorno de ejemplo
├── package.json              # Dependencias
├── tsconfig.json             # Configuración de TypeScript
├── vite.config.ts            # Configuración de Vite
├── drizzle.config.ts         # Configuración de Drizzle
└── README.md                 # Documentación principal
```

## Desarrollo

### Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
pnpm dev

# Compilar para producción
pnpm build

# Previsualizar build de producción
pnpm preview

# Ejecutar linter (TypeScript)
pnpm check

# Ejecutar pruebas
pnpm test

# Generar migraciones de BD
pnpm drizzle-kit generate

# Ejecutar migraciones de BD
pnpm drizzle-kit migrate

# Abrir Drizzle Studio (interfaz de BD)
pnpm drizzle-kit studio
```

### Desarrollo con Hot Reload

El servidor de desarrollo incluye hot reload automático:

- Cambios en archivos React se reflejan inmediatamente
- Cambios en archivos TypeScript se validan automáticamente
- Los errores se muestran en la consola del navegador

### Debugging

#### Frontend

1. Abre las DevTools del navegador (F12)
2. Ve a la pestaña "Console" para ver logs
3. Ve a "Sources" para depuración paso a paso

#### Backend

```bash
# Iniciar con debugging
node --inspect server.js

# Luego abre chrome://inspect en Chrome
```

## Pruebas

### Crear Datos de Prueba

```bash
# Abre Drizzle Studio
pnpm drizzle-kit studio

# Luego inserta datos manualmente o usa scripts
```

### Pruebas Manuales

1. **Crear Kermesse:**
   - Inicia sesión
   - Haz clic en "Crear Kermesse"
   - Completa el formulario
   - Verifica que aparezca en el dashboard

2. **Agregar Platos:**
   - Abre una kermesse
   - Haz clic en "Gestionar"
   - Agrega platos con precios

3. **Registrar Venta:**
   - Abre una kermesse
   - Haz clic en "Registrar Venta"
   - Selecciona platos y cantidad
   - Verifica que aparezca en reportes

## Solución de Problemas

### Error: "Cannot find module"

```bash
# Reinstalar dependencias
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Error: "Database connection failed"

Verifica que:
1. PostgreSQL está ejecutándose
2. Las credenciales en `.env.local` son correctas
3. La base de datos existe

```bash
# Conectar a PostgreSQL
psql -U postgres -h localhost

# Listar bases de datos
\l

# Conectar a ksol
\c ksol
```

### Error: "OAuth callback failed"

Verifica que:
1. `VITE_APP_ID` es correcto
2. La URL de redirección está configurada en Manus
3. `OAUTH_SERVER_URL` es correcto

### Error: "TypeScript compilation failed"

```bash
# Limpiar caché de TypeScript
rm -rf .tsc-cache

# Ejecutar check nuevamente
pnpm check
```

### Puerto 3000 en uso

```bash
# Encontrar proceso usando puerto 3000
lsof -i :3000

# Matar proceso
kill -9 <PID>

# O usar puerto diferente
PORT=3001 pnpm dev
```

## Configuración Avanzada

### Variables de Entorno Adicionales

```env
# Logging
LOG_LEVEL=debug  # debug, info, warn, error

# Caché
CACHE_ENABLED=true
CACHE_TTL=3600

# Límites de Rate
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=900000

# Almacenamiento S3
S3_BUCKET=ksol-storage
S3_REGION=us-east-1
S3_ACCESS_KEY=tu-access-key
S3_SECRET_KEY=tu-secret-key
```

### Configuración de Base de Datos

Edita `drizzle.config.ts` para cambiar opciones de Drizzle:

```typescript
export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
});
```

### Configuración de Vite

Edita `vite.config.ts` para cambiar opciones de Vite:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
```

## Próximos Pasos

1. **Leer Documentación:**
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - Entender la arquitectura
   - [API.md](./API.md) - Documentación de APIs
   - [DATABASE.md](./DATABASE.md) - Esquema de base de datos

2. **Crear tu Primera Kermesse:**
   - Inicia sesión
   - Crea una kermesse de prueba
   - Agrega platos e ingredientes
   - Prueba registrar una venta

3. **Personalizar:**
   - Cambiar logo en `client/src/const.ts`
   - Cambiar colores en `client/src/index.css`
   - Agregar nuevas páginas en `client/src/pages/`

4. **Desplegar:**
   - Lee [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Configura tu hosting
   - Despliega la aplicación

## Soporte

Si encuentras problemas:

1. Revisa los logs en la consola
2. Abre un issue en GitHub
3. Consulta la documentación
4. Contacta al equipo de desarrollo

---

**Última actualización:** Noviembre 2025
