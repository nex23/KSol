# Guía de Exportación a GitHub - KSol

Esta guía te ayudará a exportar el proyecto KSol a GitHub de manera correcta y profesional.

## Paso 1: Preparar el Repositorio Local

### 1.1 Verificar que Git está inicializado

```bash
cd /home/ubuntu/ksol
git status
```

Si no está inicializado, ejecuta:

```bash
git init
git config user.name "Tu Nombre"
git config user.email "tu@email.com"
```

### 1.2 Verificar archivos importantes

Asegúrate de que estos archivos existan:

```bash
ls -la
# Debe mostrar:
# - .gitignore
# - README.md
# - package.json
# - tsconfig.json
# - vite.config.ts
# - drizzle.config.ts
# - .env.example
```

Verifica que la carpeta `docs/` existe con toda la documentación:

```bash
ls -la docs/
# Debe mostrar:
# - ARCHITECTURE.md
# - API.md
# - DATABASE.md
# - SETUP.md
# - DEPLOYMENT.md
# - CONTRIBUTING.md
# - GITHUB_STRUCTURE.md
```

### 1.3 Crear archivo .gitignore actualizado

Verifica que `.gitignore` contiene:

```
node_modules/
dist/
build/
.env
.env.local
.env.*.local
.vscode/
.idea/
*.log
coverage/
.DS_Store
.turbo/
pnpm-lock.yaml
```

### 1.4 Crear .env.example

Asegúrate de que `.env.example` existe con todas las variables necesarias (sin valores reales):

```env
# Database
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/ksol

# Authentication
JWT_SECRET=tu-secreto-jwt-aqui
VITE_APP_ID=tu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# Owner Info
OWNER_NAME=Tu Nombre
OWNER_OPEN_ID=tu-open-id

# App Config
VITE_APP_TITLE=KSol - Gestor de Kermesses Benéficas
VITE_APP_LOGO=/logo.svg

# APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=tu-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=tu-frontend-api-key

# Analytics (Optional)
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=tu-website-id
```

## Paso 2: Crear Repositorio en GitHub

### 2.1 Crear nuevo repositorio

1. Ve a [GitHub.com](https://github.com)
2. Haz clic en el ícono "+" en la esquina superior derecha
3. Selecciona "New repository"
4. Completa los campos:
   - **Repository name:** `ksol`
   - **Description:** `Gestor de Kermesses Benéficas - Plataforma para organizar eventos benéficos de venta de comida típica boliviana`
   - **Visibility:** Public
   - **Initialize repository:** No (ya tenemos archivos locales)

5. Haz clic en "Create repository"

### 2.2 Copiar URL del repositorio

Copia la URL HTTPS o SSH:

```
https://github.com/tu-usuario/ksol.git
# o
git@github.com:tu-usuario/ksol.git
```

## Paso 3: Subir Código a GitHub

### 3.1 Agregar remote

```bash
cd /home/ubuntu/ksol

# Agregar remote (reemplaza con tu URL)
git remote add origin https://github.com/tu-usuario/ksol.git

# Verificar
git remote -v
```

### 3.2 Hacer commit inicial

```bash
# Agregar todos los archivos
git add .

# Crear commit inicial
git commit -m "Initial commit: KSol - Gestor de Kermesses Benéficas

- Implementación completa del frontend con React 19
- Backend con Express + tRPC
- Base de datos PostgreSQL con Drizzle ORM
- Autenticación con Manus OAuth
- Documentación completa
- Guías de instalación y despliegue"

# Ver el commit
git log --oneline -1
```

### 3.3 Crear rama main y push

```bash
# Renombrar rama a main
git branch -M main

# Push a GitHub
git push -u origin main

# Verificar
git branch -a
```

### 3.4 Crear rama develop

```bash
# Crear rama develop
git checkout -b develop

# Push a GitHub
git push -u origin develop

# Volver a main
git checkout main
```

## Paso 4: Configurar GitHub

### 4.1 Configurar ramas principales

1. Ve a tu repositorio en GitHub
2. Haz clic en "Settings"
3. Ve a "Branches" en el menú izquierdo
4. En "Default branch", selecciona `main`
5. Haz clic en "Update"

### 4.2 Proteger rama main

1. En "Branches"
2. Haz clic en "Add rule"
3. Configura:
   - **Branch name pattern:** `main`
   - **Require pull request reviews before merging:** ✓
   - **Require status checks to pass before merging:** ✓
   - **Require branches to be up to date before merging:** ✓
   - **Include administrators:** ✓

4. Haz clic en "Create"

### 4.3 Proteger rama develop

Repite el proceso anterior para la rama `develop` (opcional, pero recomendado).

### 4.4 Configurar temas

1. Ve a "Settings"
2. Ve a "Code and automation" → "Pages"
3. Haz clic en "Choose a theme" para agregar un tema a la documentación (opcional)

## Paso 5: Agregar Archivos Adicionales

### 5.1 Crear LICENSE

Crea archivo `LICENSE` en la raíz:

```
MIT License

Copyright (c) 2025 KSol Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 5.2 Crear CHANGELOG.md

Crea archivo `CHANGELOG.md`:

```markdown
# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [1.0.0] - 2025-11-23

### Agregado
- Visualización pública de kermesses activas
- Sistema de autenticación con Manus OAuth
- Creación y gestión de kermesses
- Gestión de platos e ingredientes
- Sistema de donación de ingredientes
- Registro de ventas
- Control de entregas
- Reportes de ganancias
- Documentación completa

### Cambios
- Inicialización del proyecto

### Corregido
- N/A

## Futuro

### Planeado para v1.1
- Exportar reportes a PDF
- Notificaciones por email
- Integración con WhatsApp
- Galería de fotos

### Planeado para v2.0
- Aplicación móvil
- Pagos en línea
- Análisis avanzado
```

### 5.3 Crear CONTRIBUTORS.md

Crea archivo `CONTRIBUTORS.md`:

```markdown
# Contribuidores

Agradecemos a todos los que han contribuido a KSol.

## Contribuidores Principales

- **Tu Nombre** - Creador y Mantenedor Principal

## Cómo Contribuir

¿Quieres contribuir? Lee [CONTRIBUTING.md](./docs/CONTRIBUTING.md) para instrucciones.

---

Los contribuidores aparecerán aquí automáticamente cuando hagan pull requests.
```

### 5.4 Push de nuevos archivos

```bash
git add LICENSE CHANGELOG.md CONTRIBUTORS.md
git commit -m "docs: agregar LICENSE, CHANGELOG y CONTRIBUTORS"
git push origin main
```

## Paso 6: Crear GitHub Actions (CI/CD)

### 6.1 Crear carpeta de workflows

```bash
mkdir -p .github/workflows
```

### 6.2 Crear workflow de CI

Crea `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [22.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run type check
        run: pnpm check
      
      - name: Build
        run: pnpm build
```

### 6.3 Push del workflow

```bash
git add .github/workflows/ci.yml
git commit -m "ci: agregar GitHub Actions workflow"
git push origin main
```

## Paso 7: Crear Plantillas de Issues

### 7.1 Crear carpeta de templates

```bash
mkdir -p .github/ISSUE_TEMPLATE
```

### 7.2 Crear template de bug

Crea `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Reportar Bug
about: Ayuda a mejorar KSol reportando bugs
title: '[BUG] '
labels: 'bug'
assignees: ''
---

## Descripción del Bug
Descripción clara del problema.

## Pasos para Reproducir
1. Ir a...
2. Hacer clic en...
3. Ver error...

## Comportamiento Esperado
Debería...

## Comportamiento Actual
Sucede...

## Entorno
- OS: 
- Node: 
- Browser: 

## Screenshots
Si es relevante, agrega screenshots.
```

### 7.3 Crear template de feature

Crea `.github/ISSUE_TEMPLATE/feature_request.md`:

```markdown
---
name: Solicitar Feature
about: Sugiere una idea para mejorar KSol
title: '[FEATURE] '
labels: 'enhancement'
assignees: ''
---

## Descripción
Descripción clara de la funcionalidad deseada.

## Motivación
Por qué esta funcionalidad sería útil.

## Ejemplos
Cómo debería funcionar.

## Contexto Adicional
Información adicional relevante.
```

### 7.4 Push de templates

```bash
git add .github/ISSUE_TEMPLATE/
git commit -m "ci: agregar plantillas de issues"
git push origin main
```

## Paso 8: Verificar Visibilidad

### 8.1 Hacer repositorio público

1. Ve a "Settings"
2. Ve a "Danger Zone"
3. Haz clic en "Change repository visibility"
4. Selecciona "Public"
5. Confirma

### 8.2 Agregar topics

1. En la página principal del repositorio
2. Haz clic en el ícono de engranaje junto a "About"
3. Agrega topics:
   - `kermesse`
   - `bolivia`
   - `charity`
   - `react`
   - `trpc`
   - `postgresql`
   - `typescript`

### 8.3 Agregar descripción

En el mismo lugar, agrega:

- **Description:** Gestor de Kermesses Benéficas - Plataforma para organizar eventos benéficos
- **Website:** (si tienes un sitio web)

## Paso 9: Verificación Final

### Checklist

- [ ] Repositorio creado en GitHub
- [ ] Código subido a rama `main`
- [ ] Rama `develop` creada
- [ ] Rama `main` protegida
- [ ] LICENSE agregado
- [ ] CHANGELOG.md agregado
- [ ] CONTRIBUTORS.md agregado
- [ ] GitHub Actions configurado
- [ ] Plantillas de issues creadas
- [ ] Repositorio es público
- [ ] Topics agregados
- [ ] Descripción completada
- [ ] README visible en GitHub
- [ ] Documentación accesible

### Verificar en GitHub

1. Ve a tu repositorio
2. Verifica que:
   - El README se muestra correctamente
   - Los archivos están presentes
   - La carpeta `docs/` está visible
   - Los workflows están ejecutándose

## Paso 10: Promoción (Opcional)

### Compartir en redes sociales

```
🎉 ¡Acabo de publicar KSol en GitHub!

KSol es una plataforma para gestionar kermesses benéficas en Bolivia.

✨ Características:
- Crear y gestionar eventos benéficos
- Vender platos típicos bolivianos
- Rastrear entregas
- Reportes de ganancias

🔗 https://github.com/tu-usuario/ksol

¡Contribuciones bienvenidas! 🇧🇴
```

### Agregar a listas de GitHub

- [Awesome Bolivia](https://github.com/topics/bolivia)
- [Awesome Charity](https://github.com/topics/charity)
- [Awesome React](https://github.com/topics/react)

## Troubleshooting

### Error: "fatal: not a git repository"

```bash
cd /home/ubuntu/ksol
git init
```

### Error: "Permission denied"

Usa SSH en lugar de HTTPS:

```bash
git remote remove origin
git remote add origin git@github.com:tu-usuario/ksol.git
```

### Error: "Repository not found"

Verifica que:
1. El repositorio existe en GitHub
2. La URL es correcta
3. Tienes acceso (si es privado)

### Cambios no se ven en GitHub

```bash
git status  # Ver cambios
git add .
git commit -m "mensaje"
git push origin main
```

## Próximos Pasos

1. **Invitar colaboradores:**
   - Ve a Settings → Collaborators
   - Agrega colaboradores

2. **Configurar Projects:**
   - Crea un Project para rastrear tareas
   - Agrega issues al proyecto

3. **Configurar Discussions:**
   - Habilita Discussions en Settings
   - Crea categorías para discusiones

4. **Configurar Wiki:**
   - Habilita Wiki en Settings
   - Agrega documentación adicional

---

**Última actualización:** Noviembre 2025

¡Tu proyecto está listo para GitHub! 🚀
