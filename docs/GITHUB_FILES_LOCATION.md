# Guía de Ubicación de Archivos para GitHub - KSol

Esta guía te ayudará a encontrar todos los archivos del proyecto KSol y cómo organizarlos para subirlos a GitHub.

## 📂 Estructura Completa del Proyecto

```
ksol/
├── client/                          # Frontend React
│   ├── public/                      # Archivos estáticos
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── robots.txt
│   ├── src/
│   │   ├── pages/                   # Páginas principales
│   │   │   ├── Home.tsx             # Página de inicio pública
│   │   │   ├── KermesseDetail.tsx   # Detalle de kermesse
│   │   │   ├── CreateKermesse.tsx   # Crear kermesse
│   │   │   ├── Dashboard.tsx        # Dashboard del usuario
│   │   │   ├── ManageKermesse.tsx   # Gestionar kermesse
│   │   │   ├── DonateIngredient.tsx # Donar ingredientes
│   │   │   ├── RegisterSale.tsx     # Registrar ventas
│   │   │   ├── ManageDeliveries.tsx # Gestionar entregas
│   │   │   ├── SalesReport.tsx      # Reportes de ventas
│   │   │   ├── DishGallery.tsx      # Galería de fotos (NUEVO)
│   │   │   ├── KermesseStatistics.tsx # Estadísticas (NUEVO)
│   │   │   └── NotFound.tsx         # Página 404
│   │   ├── components/              # Componentes reutilizables
│   │   │   ├── ui/                  # Componentes shadcn/ui
│   │   │   ├── DashboardLayout.tsx  # Layout del dashboard
│   │   │   ├── ErrorBoundary.tsx    # Error boundary
│   │   │   └── ...
│   │   ├── contexts/                # React contexts
│   │   ├── hooks/                   # Custom hooks
│   │   ├── lib/
│   │   │   ├── trpc.ts              # Cliente tRPC
│   │   │   └── utils.ts             # Utilidades
│   │   ├── _core/                   # Core interno
│   │   ├── App.tsx                  # Componente raíz
│   │   ├── main.tsx                 # Punto de entrada
│   │   ├── index.css                # Estilos globales
│   │   └── const.ts                 # Constantes
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.ts
│
├── server/                          # Backend Express + tRPC
│   ├── _core/                       # Core interno (no editar)
│   │   ├── index.ts                 # Punto de entrada del servidor
│   │   ├── context.ts               # Contexto tRPC
│   │   ├── trpc.ts                  # Configuración tRPC
│   │   ├── env.ts                   # Variables de entorno
│   │   ├── cookies.ts               # Gestión de cookies
│   │   ├── llm.ts                   # Integración LLM
│   │   ├── imageGeneration.ts       # Generación de imágenes
│   │   ├── voiceTranscription.ts    # Transcripción de voz
│   │   ├── map.ts                   # Integración de mapas
│   │   ├── notification.ts          # Notificaciones
│   │   └── ...
│   ├── db.ts                        # Helpers de base de datos
│   ├── routers.ts                   # APIs tRPC
│   ├── storage.ts                   # Almacenamiento S3
│   └── package.json
│
├── drizzle/                         # Base de datos
│   ├── schema.ts                    # Esquema de base de datos
│   │   ├── users
│   │   ├── kermesses
│   │   ├── dishes
│   │   ├── dishImages (NUEVO)
│   │   ├── ingredients
│   │   ├── ingredientDonations
│   │   ├── collaborators
│   │   ├── sales
│   │   ├── saleItems
│   │   └── deliveries
│   ├── migrations/                  # Migraciones automáticas
│   └── drizzle.config.ts
│
├── docs/                            # Documentación
│   ├── README.md                    # Documentación principal
│   ├── ARCHITECTURE.md              # Arquitectura técnica
│   ├── API.md                       # Documentación de APIs
│   ├── DATABASE.md                  # Esquema de base de datos
│   ├── SETUP.md                     # Guía de instalación
│   ├── DEPLOYMENT.md                # Guía de despliegue
│   ├── CONTRIBUTING.md              # Guía para contribuidores
│   ├── GITHUB_STRUCTURE.md          # Estructura de GitHub
│   ├── GITHUB_EXPORT_GUIDE.md       # Guía de exportación
│   ├── SEED_DATA.md                 # Guía de datos de ejemplo
│   ├── GITHUB_FILES_LOCATION.md     # Este archivo
│   ├── INDEX.md                     # Índice de documentación
│   └── ...
│
├── shared/                          # Código compartido
│   ├── const.ts                     # Constantes compartidas
│   └── types.ts                     # Tipos compartidos
│
├── storage/                         # Helpers de almacenamiento
│   └── index.ts                     # Funciones de S3
│
├── seed.mjs                         # Script de seed con datos de ejemplo
├── package.json                     # Dependencias del proyecto
├── tsconfig.json                    # Configuración TypeScript
├── pnpm-lock.yaml                   # Lock file de dependencias
├── .gitignore                       # Archivos ignorados por Git
├── .env.example                     # Variables de entorno de ejemplo
├── LICENSE                          # Licencia MIT
├── README.md                        # Documentación principal (raíz)
├── CHANGELOG.md                     # Historial de cambios
├── CONTRIBUTORS.md                  # Lista de contribuidores
├── todo.md                          # Lista de tareas
└── vite.config.ts                   # Configuración Vite
```

## 📍 Ubicación de Archivos Clave

### Archivos de Configuración (Raíz del Proyecto)

| Archivo | Ubicación | Descripción |
|---------|-----------|-------------|
| `package.json` | `/home/ubuntu/ksol/package.json` | Dependencias y scripts |
| `tsconfig.json` | `/home/ubuntu/ksol/tsconfig.json` | Configuración TypeScript |
| `.env.example` | `/home/ubuntu/ksol/.env.example` | Variables de entorno |
| `.gitignore` | `/home/ubuntu/ksol/.gitignore` | Archivos ignorados |
| `README.md` | `/home/ubuntu/ksol/README.md` | Documentación principal |
| `LICENSE` | `/home/ubuntu/ksol/LICENSE` | Licencia MIT |

### Frontend (React)

| Archivo | Ubicación | Descripción |
|---------|-----------|-------------|
| Páginas | `/home/ubuntu/ksol/client/src/pages/` | Todas las páginas |
| Componentes | `/home/ubuntu/ksol/client/src/components/` | Componentes reutilizables |
| Estilos | `/home/ubuntu/ksol/client/src/index.css` | Estilos globales |
| Cliente tRPC | `/home/ubuntu/ksol/client/src/lib/trpc.ts` | Configuración tRPC |

### Backend (Express + tRPC)

| Archivo | Ubicación | Descripción |
|---------|-----------|-------------|
| Routers | `/home/ubuntu/ksol/server/routers.ts` | APIs tRPC |
| Helpers DB | `/home/ubuntu/ksol/server/db.ts` | Funciones de base de datos |
| Almacenamiento | `/home/ubuntu/ksol/server/storage.ts` | Funciones S3 |

### Base de Datos

| Archivo | Ubicación | Descripción |
|---------|-----------|-------------|
| Schema | `/home/ubuntu/ksol/drizzle/schema.ts` | Esquema de tablas |
| Config | `/home/ubuntu/ksol/drizzle/drizzle.config.ts` | Configuración Drizzle |

### Documentación

| Archivo | Ubicación | Descripción |
|---------|-----------|-------------|
| README | `/home/ubuntu/ksol/README.md` | Documentación principal |
| Arquitectura | `/home/ubuntu/ksol/docs/ARCHITECTURE.md` | Arquitectura técnica |
| APIs | `/home/ubuntu/ksol/docs/API.md` | Documentación de APIs |
| Base de datos | `/home/ubuntu/ksol/docs/DATABASE.md` | Esquema de DB |
| Setup | `/home/ubuntu/ksol/docs/SETUP.md` | Instalación |
| Deployment | `/home/ubuntu/ksol/docs/DEPLOYMENT.md` | Despliegue |

### Datos de Ejemplo

| Archivo | Ubicación | Descripción |
|---------|-----------|-------------|
| Script Seed | `/home/ubuntu/ksol/seed.mjs` | Datos de ejemplo |
| Guía Seed | `/home/ubuntu/ksol/docs/SEED_DATA.md` | Cómo usar seed |

## 🚀 Cómo Subir a GitHub

### Paso 1: Clonar o Crear Repositorio

```bash
# Si es un repositorio nuevo
cd /home/ubuntu/ksol
git init

# Si ya existe
git clone https://github.com/tu-usuario/ksol.git
cd ksol
```

### Paso 2: Agregar Archivos

```bash
# Agregar todos los archivos
git add .

# O agregar archivos específicos
git add client/
git add server/
git add drizzle/
git add docs/
git add seed.mjs
git add package.json
git add README.md
git add LICENSE
```

### Paso 3: Crear Commit

```bash
git commit -m "Initial commit: KSol - Gestor de Kermesses Benéficas

- Frontend React 19 con 11 páginas
- Backend Express + tRPC
- Base de datos PostgreSQL con 9 tablas
- Galería de fotos para platos
- Dashboard de estadísticas
- Script de seed con datos de ejemplo
- Documentación completa"
```

### Paso 4: Subir a GitHub

```bash
# Agregar remoto (si no existe)
git remote add origin https://github.com/tu-usuario/ksol.git

# Cambiar rama a main
git branch -M main

# Subir cambios
git push -u origin main
```

## 📋 Archivos Importantes para GitHub

### Debe Incluir

- ✅ `README.md` - Documentación principal
- ✅ `LICENSE` - Licencia del proyecto
- ✅ `.gitignore` - Archivos ignorados
- ✅ `package.json` - Dependencias
- ✅ `docs/` - Toda la documentación
- ✅ `client/src/` - Código frontend
- ✅ `server/` - Código backend
- ✅ `drizzle/schema.ts` - Esquema de DB
- ✅ `seed.mjs` - Script de datos de ejemplo
- ✅ `.env.example` - Variables de entorno

### NO Debe Incluir

- ❌ `node_modules/` - Instaladas con `pnpm install`
- ❌ `.env` - Contiene secretos
- ❌ `dist/` - Generado en build
- ❌ `.DS_Store` - Archivos del sistema
- ❌ `*.log` - Archivos de log

## 🔧 Configuración de .gitignore

El archivo `.gitignore` ya está configurado para excluir:

```
node_modules/
dist/
build/
.env
.env.local
.env.*.local
*.log
.DS_Store
.vscode/
.idea/
*.swp
*.swo
pnpm-lock.yaml (opcional)
```

## 📊 Estadísticas del Proyecto

| Métrica | Cantidad |
|---------|----------|
| Páginas Frontend | 11 |
| Componentes | 20+ |
| APIs tRPC | 30+ |
| Tablas de Base de Datos | 9 |
| Archivos de Documentación | 12 |
| Líneas de Código | 5,000+ |
| Platos de Ejemplo | 11 |
| Usuarios de Ejemplo | 5 |

## 🎯 Estructura Recomendada en GitHub

```
ksol/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                   # CI/CD
│   │   └── deploy.yml               # Despliegue automático
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
├── docs/                            # Documentación
├── client/                          # Frontend
├── server/                          # Backend
├── drizzle/                         # Base de datos
├── shared/                          # Código compartido
├── storage/                         # Almacenamiento
├── seed.mjs                         # Datos de ejemplo
├── package.json
├── README.md
├── LICENSE
├── CHANGELOG.md
└── .gitignore
```

## 📝 Pasos Finales

1. **Crear repositorio en GitHub** - Visita github.com/new
2. **Copiar URL del repositorio**
3. **Agregar remoto** - `git remote add origin <URL>`
4. **Hacer push** - `git push -u origin main`
5. **Configurar settings** - Descripción, topics, etc.
6. **Agregar colaboradores** - Si es necesario

## 🔗 Enlaces Útiles

- [GitHub - Crear Repositorio](https://github.com/new)
- [Git - Guía Oficial](https://git-scm.com/doc)
- [GitHub - Primeros Pasos](https://docs.github.com/es/get-started)

---

**Última actualización:** Noviembre 2025
