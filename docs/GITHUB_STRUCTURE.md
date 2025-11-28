# Estructura de Carpetas para GitHub - KSol

Esta guía describe cómo organizar el repositorio de KSol en GitHub para facilitar el desarrollo colaborativo.

## Estructura Recomendada

```
ksol/
├── .github/                           # Configuración de GitHub
│   ├── workflows/                     # GitHub Actions
│   │   ├── ci.yml                     # Pipeline de CI/CD
│   │   ├── tests.yml                  # Ejecución de tests
│   │   └── deploy.yml                 # Despliegue automático
│   ├── ISSUE_TEMPLATE/                # Plantillas de issues
│   │   ├── bug_report.md              # Plantilla para bugs
│   │   ├── feature_request.md         # Plantilla para features
│   │   └── question.md                # Plantilla para preguntas
│   └── PULL_REQUEST_TEMPLATE.md       # Plantilla de PR
│
├── client/                            # Frontend (React)
│   ├── src/
│   │   ├── pages/                     # Páginas principales
│   │   │   ├── Home.tsx
│   │   │   ├── KermesseDetail.tsx
│   │   │   ├── CreateKermesse.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ManageKermesse.tsx
│   │   │   ├── DonateIngredient.tsx
│   │   │   ├── RegisterSale.tsx
│   │   │   ├── ManageDeliveries.tsx
│   │   │   ├── SalesReport.tsx
│   │   │   └── NotFound.tsx
│   │   ├── components/                # Componentes reutilizables
│   │   │   ├── ui/                    # Componentes de shadcn/ui
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   └── ...
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── ...
│   │   ├── lib/                       # Utilidades
│   │   │   ├── trpc.ts                # Cliente tRPC
│   │   │   ├── utils.ts               # Funciones auxiliares
│   │   │   └── ...
│   │   ├── contexts/                  # Contextos de React
│   │   │   ├── ThemeContext.tsx
│   │   │   └── ...
│   │   ├── hooks/                     # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   └── ...
│   │   ├── _core/                     # Código base
│   │   │   └── ...
│   │   ├── App.tsx                    # Componente raíz
│   │   ├── main.tsx                   # Punto de entrada
│   │   └── index.css                  # Estilos globales
│   ├── public/                        # Archivos estáticos
│   │   ├── logo.svg
│   │   ├── favicon.ico
│   │   └── ...
│   ├── index.html                     # HTML principal
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                            # Backend (Express + tRPC)
│   ├── routers.ts                     # Definición de procedimientos tRPC
│   ├── db.ts                          # Helpers de base de datos
│   ├── storage.ts                     # Helpers de almacenamiento S3
│   ├── _core/                         # Código base del framework
│   │   ├── index.ts
│   │   ├── context.ts
│   │   ├── trpc.ts
│   │   ├── env.ts
│   │   ├── cookies.ts
│   │   ├── llm.ts
│   │   ├── voiceTranscription.ts
│   │   ├── imageGeneration.ts
│   │   ├── notification.ts
│   │   ├── map.ts
│   │   └── systemRouter.ts
│   └── package.json
│
├── drizzle/                           # Esquema y migraciones
│   ├── schema.ts                      # Definición de tablas
│   ├── migrations/                    # Archivos de migración
│   │   ├── 0000_initial.sql
│   │   ├── 0001_add_fields.sql
│   │   └── ...
│   └── meta/                          # Metadatos de migraciones
│
├── shared/                            # Código compartido
│   ├── const.ts                       # Constantes globales
│   ├── types.ts                       # Tipos compartidos
│   └── utils.ts                       # Utilidades compartidas
│
├── docs/                              # Documentación
│   ├── README.md                      # Índice de documentación
│   ├── ARCHITECTURE.md                # Arquitectura del sistema
│   ├── API.md                         # Documentación de APIs
│   ├── DATABASE.md                    # Esquema de base de datos
│   ├── SETUP.md                       # Guía de instalación
│   ├── DEPLOYMENT.md                  # Guía de despliegue
│   ├── CONTRIBUTING.md                # Guía para contribuidores
│   ├── GITHUB_STRUCTURE.md            # Este archivo
│   ├── CHANGELOG.md                   # Historial de cambios
│   └── images/                        # Imágenes para documentación
│       ├── architecture.png
│       ├── database-diagram.png
│       └── ...
│
├── .github/                           # (Repetido arriba para claridad)
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── tests.yml
│   │   └── deploy.yml
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
│
├── .gitignore                         # Archivos a ignorar en git
├── .env.example                       # Variables de entorno de ejemplo
├── .eslintrc.json                     # Configuración de ESLint
├── .prettierrc.json                   # Configuración de Prettier
├── package.json                       # Dependencias del proyecto
├── pnpm-workspace.yaml                # Configuración de workspace
├── tsconfig.json                      # Configuración de TypeScript
├── vite.config.ts                     # Configuración de Vite
├── drizzle.config.ts                  # Configuración de Drizzle
├── vitest.config.ts                   # Configuración de Vitest
├── README.md                          # Documentación principal
├── LICENSE                            # Licencia del proyecto
├── CHANGELOG.md                       # Historial de cambios
└── CONTRIBUTORS.md                    # Lista de contribuidores
```

## Descripción de Carpetas

### `.github/`

Contiene configuración específica de GitHub:

- **workflows/:** Scripts de GitHub Actions para CI/CD
- **ISSUE_TEMPLATE/:** Plantillas para crear issues
- **PULL_REQUEST_TEMPLATE.md:** Plantilla para pull requests

### `client/`

Código del frontend (React):

- **src/pages/:** Componentes de página (rutas principales)
- **src/components/:** Componentes reutilizables
- **src/lib/:** Utilidades y helpers
- **src/contexts/:** Contextos de React para estado global
- **src/hooks/:** Custom hooks
- **src/_core/:** Código base del framework
- **public/:** Archivos estáticos (logo, favicon, etc.)

### `server/`

Código del backend (Express + tRPC):

- **routers.ts:** Definición de todos los procedimientos tRPC
- **db.ts:** Funciones para interactuar con la base de datos
- **storage.ts:** Funciones para almacenamiento S3
- **_core/:** Código base del framework (autenticación, contexto, etc.)

### `drizzle/`

Configuración de base de datos:

- **schema.ts:** Definición de tablas y relaciones
- **migrations/:** Archivos SQL de migraciones
- **meta/:** Metadatos de migraciones

### `shared/`

Código compartido entre frontend y backend:

- **const.ts:** Constantes globales
- **types.ts:** Tipos TypeScript compartidos
- **utils.ts:** Funciones auxiliares compartidas

### `docs/`

Documentación del proyecto:

- **ARCHITECTURE.md:** Descripción de la arquitectura
- **API.md:** Documentación de APIs tRPC
- **DATABASE.md:** Esquema y documentación de BD
- **SETUP.md:** Guía de instalación
- **DEPLOYMENT.md:** Guía de despliegue
- **CONTRIBUTING.md:** Guía para contribuidores
- **images/:** Imágenes para documentación

## Configuración de GitHub

### 1. Crear Repositorio

```bash
# Crear repositorio en GitHub
# Nombre: ksol
# Descripción: Gestor de Kermesses Benéficas
# Visibilidad: Public
# Agregar .gitignore: Node
# Agregar licencia: MIT
```

### 2. Clonar Repositorio

```bash
git clone https://github.com/tu-usuario/ksol.git
cd ksol
```

### 3. Configurar Ramas

Crear ramas principales:

```bash
# Rama main (producción)
git checkout -b main

# Rama develop (desarrollo)
git checkout -b develop
git push -u origin develop

# Rama staging (pre-producción)
git checkout -b staging
git push -u origin staging
```

Configurar protecciones de rama en GitHub:

1. Ve a Settings → Branches
2. Agrega reglas de protección para `main` y `develop`:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Require branches to be up to date before merging

### 4. Configurar GitHub Actions

Crear `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop, staging]
  pull_request:
    branches: [main, develop, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm check
      - run: pnpm test
      - run: pnpm build
```

### 5. Configurar Protecciones

En Settings → Security:

- Habilitar "Require status checks to pass"
- Habilitar "Require branches to be up to date"
- Habilitar "Require code reviews"

## Flujo de Trabajo Git

### Crear Feature

```bash
# Crear rama desde develop
git checkout develop
git pull origin develop
git checkout -b feature/descripcion-corta

# Hacer cambios
git add .
git commit -m "feat: descripción del cambio"

# Push a GitHub
git push -u origin feature/descripcion-corta

# Crear Pull Request en GitHub
```

### Merge a Develop

1. Crear Pull Request
2. Pasar revisión de código
3. Pasar tests automáticos
4. Merge a `develop`

### Release a Producción

```bash
# Crear rama de release
git checkout -b release/v1.0.0 develop

# Actualizar versión
npm version patch  # o minor, major

# Merge a main
git checkout main
git merge --no-ff release/v1.0.0

# Tag de versión
git tag -a v1.0.0 -m "Release v1.0.0"

# Push
git push origin main develop --tags
```

## Archivos Importantes

### `.env.example`

Plantilla de variables de entorno:

```env
# Copiar a .env.local y completar con valores reales
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/ksol
JWT_SECRET=tu-secreto-aqui
VITE_APP_ID=tu-app-id
# ... más variables
```

### `package.json`

Dependencias del proyecto:

```json
{
  "name": "ksol",
  "version": "1.0.0",
  "description": "Gestor de Kermesses Benéficas",
  "scripts": {
    "dev": "...",
    "build": "...",
    "test": "...",
    "check": "..."
  },
  "dependencies": { ... },
  "devDependencies": { ... }
}
```

### `tsconfig.json`

Configuración de TypeScript:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./client/src/*"]
    }
  }
}
```

### `README.md`

Documentación principal del proyecto.

### `LICENSE`

Licencia MIT del proyecto.

## Mejores Prácticas

### Commits

- Commits pequeños y enfocados
- Mensajes claros y descriptivos
- Usar Conventional Commits

### Pull Requests

- Descripciones claras
- Referenciar issues relacionados
- Incluir screenshots si es relevante
- Pasar todos los tests

### Documentación

- Mantener documentación actualizada
- Agregar comentarios en código complejo
- Usar ejemplos claros
- Mantener CHANGELOG.md actualizado

### Código

- Seguir convenciones de código
- Pasar linter y tests
- Revisar cambios antes de commit
- Evitar commits grandes

## Recursos

- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions](https://github.com/features/actions)
- [GitHub Issues](https://guides.github.com/features/issues/)

---

**Última actualización:** Noviembre 2025
