# Índice de Documentación - KSol

Bienvenido a la documentación completa de **KSol - Gestor de Kermesses Benéficas**. Esta página te ayudará a navegar por toda la documentación disponible.

## 📚 Documentación Principal

### [README.md](../README.md)
**Descripción:** Documentación principal del proyecto
- Descripción general del proyecto
- Características principales
- Stack tecnológico
- Estructura del proyecto
- Instalación rápida
- Roadmap del proyecto

**Para quién:** Todos los usuarios, especialmente nuevos

---

## 🏗️ Documentación Técnica

### [ARCHITECTURE.md](./ARCHITECTURE.md)
**Descripción:** Arquitectura técnica del sistema
- Diagrama de arquitectura
- Capas de la aplicación (presentación, lógica, persistencia)
- Estructura de tRPC routers
- Flujos de autenticación y datos
- Patrones de seguridad
- Optimizaciones de rendimiento
- Escalabilidad futura

**Para quién:** Desarrolladores, arquitectos, contribuidores

**Leer si:** Necesitas entender cómo está construida la aplicación

---

### [DATABASE.md](./DATABASE.md)
**Descripción:** Esquema y documentación de base de datos
- Descripción general de PostgreSQL
- Diagrama de relaciones
- Documentación de 9 tablas principales
- Relaciones entre tablas
- Consultas comunes
- Migraciones con Drizzle
- Optimizaciones de rendimiento
- Escalabilidad futura

**Para quién:** Desarrolladores backend, DBA, contribuidores

**Leer si:** Necesitas entender la estructura de datos

---

### [API.md](./API.md)
**Descripción:** Documentación completa de APIs tRPC
- Introducción a tRPC
- Autenticación (auth.me, auth.logout)
- Kermesses (crear, listar, actualizar)
- Platos (dishes)
- Ingredientes (ingredients)
- Donaciones de ingredientes
- Ventas (sales)
- Entregas (deliveries)
- Colaboradores
- Manejo de errores
- Mejores prácticas

**Para quién:** Desarrolladores frontend, desarrolladores backend

**Leer si:** Necesitas llamar a las APIs desde el frontend

---

## 🚀 Guías de Instalación y Despliegue

### [SETUP.md](./SETUP.md)
**Descripción:** Guía completa de instalación y configuración
- Requisitos previos
- Instalación paso a paso
- Configuración de variables de entorno
- Creación de base de datos
- Ejecución de migraciones
- Inicio del servidor de desarrollo
- Configuración de Manus OAuth
- Estructura de carpetas
- Scripts disponibles
- Desarrollo con hot reload
- Debugging
- Solución de problemas

**Para quién:** Nuevos desarrolladores, contribuidores

**Leer si:** Quieres instalar y ejecutar el proyecto localmente

---

### [DEPLOYMENT.md](./DEPLOYMENT.md)
**Descripción:** Guía de despliegue en múltiples plataformas
- Despliegue en Manus Platform
- Despliegue en Vercel + Railway
- Despliegue con Docker
- Despliegue en AWS
- Despliegue en DigitalOcean
- Checklist de despliegue
- Monitoreo en producción
- Escalabilidad
- Troubleshooting

**Para quién:** DevOps, administradores de sistemas, desarrolladores

**Leer si:** Necesitas desplegar la aplicación a producción

---

## 👥 Guías para Colaboradores

### [CONTRIBUTING.md](./CONTRIBUTING.md)
**Descripción:** Guía completa para contribuidores
- Código de conducta
- Cómo reportar bugs
- Cómo sugerir mejoras
- Cómo enviar pull requests
- Convenciones de código
- Convenciones de commits
- Estructura de componentes
- Testing
- Documentación
- Proceso de revisión
- Estándares de calidad
- Preguntas frecuentes

**Para quién:** Contribuidores, desarrolladores que quieren participar

**Leer si:** Quieres contribuir al proyecto

---

## 📁 Guías de Estructura

### [GITHUB_STRUCTURE.md](./GITHUB_STRUCTURE.md)
**Descripción:** Estructura recomendada de carpetas para GitHub
- Estructura completa de carpetas
- Descripción de cada carpeta
- Configuración de GitHub
- Flujo de trabajo Git
- Archivos importantes
- Mejores prácticas

**Para quién:** Mantenedores, desarrolladores

**Leer si:** Necesitas entender la organización del proyecto

---

### [GITHUB_EXPORT_GUIDE.md](./GITHUB_EXPORT_GUIDE.md)
**Descripción:** Guía paso a paso para exportar a GitHub
- Preparación del repositorio local
- Creación de repositorio en GitHub
- Subida de código
- Configuración de GitHub
- Archivos adicionales
- GitHub Actions
- Plantillas de issues
- Verificación final
- Promoción

**Para quién:** Propietarios del proyecto, administradores

**Leer si:** Quieres subir el proyecto a GitHub

---

## 🗂️ Estructura de Carpetas del Proyecto

```
ksol/
├── client/                    # Frontend (React)
│   ├── src/pages/            # Páginas principales
│   ├── src/components/       # Componentes reutilizables
│   ├── src/lib/              # Utilidades
│   └── src/contexts/         # Contextos de React
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
│   ├── API.md                # APIs tRPC
│   ├── DATABASE.md           # Esquema de BD
│   ├── SETUP.md              # Instalación
│   ├── DEPLOYMENT.md         # Despliegue
│   ├── CONTRIBUTING.md       # Contribución
│   ├── GITHUB_STRUCTURE.md   # Estructura
│   ├── GITHUB_EXPORT_GUIDE.md # Exportación
│   └── INDEX.md              # Este archivo
│
├── .github/                   # Configuración de GitHub
│   ├── workflows/            # GitHub Actions
│   └── ISSUE_TEMPLATE/       # Plantillas de issues
│
├── README.md                  # Documentación principal
├── LICENSE                    # Licencia MIT
├── CHANGELOG.md              # Historial de cambios
├── CONTRIBUTORS.md           # Lista de contribuidores
├── .env.example              # Variables de entorno
├── .gitignore                # Archivos a ignorar
└── package.json              # Dependencias
```

---

## 🎯 Guía Rápida por Rol

### Soy un Usuario Final
1. Lee [README.md](../README.md) - Descripción general
2. Ve a [SETUP.md](./SETUP.md) - Cómo instalar
3. Comienza a crear kermesses

### Soy un Desarrollador Frontend
1. Lee [SETUP.md](./SETUP.md) - Instalación
2. Lee [API.md](./API.md) - Documentación de APIs
3. Lee [ARCHITECTURE.md](./ARCHITECTURE.md) - Entender la arquitectura
4. Comienza a desarrollar

### Soy un Desarrollador Backend
1. Lee [SETUP.md](./SETUP.md) - Instalación
2. Lee [DATABASE.md](./DATABASE.md) - Esquema de BD
3. Lee [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura
4. Lee [API.md](./API.md) - APIs tRPC
5. Comienza a desarrollar

### Quiero Contribuir
1. Lee [CONTRIBUTING.md](./CONTRIBUTING.md) - Guía de contribución
2. Lee [SETUP.md](./SETUP.md) - Instalación
3. Lee [ARCHITECTURE.md](./ARCHITECTURE.md) - Entender el código
4. Abre un issue o PR

### Necesito Desplegar a Producción
1. Lee [DEPLOYMENT.md](./DEPLOYMENT.md) - Opciones de despliegue
2. Elige tu plataforma
3. Sigue los pasos específicos
4. Configura monitoreo

### Soy un Administrador de Sistemas
1. Lee [DEPLOYMENT.md](./DEPLOYMENT.md) - Opciones de despliegue
2. Lee [GITHUB_EXPORT_GUIDE.md](./GITHUB_EXPORT_GUIDE.md) - Configuración
3. Configura CI/CD
4. Configura monitoreo

---

## 📖 Recursos Adicionales

### Documentación Externa

- [React 19 Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [tRPC Docs](https://trpc.io)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Express Docs](https://expressjs.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Herramientas Recomendadas

- **Editor:** VS Code con extensiones TypeScript
- **Base de datos:** PostgreSQL + pgAdmin
- **Testing:** Vitest
- **Linting:** ESLint + Prettier
- **Git:** GitHub Desktop o Git CLI

---

## 🔍 Búsqueda Rápida

### Por Tema

**Autenticación:**
- [ARCHITECTURE.md - Flujo de Autenticación](./ARCHITECTURE.md#flujo-de-autenticación)
- [API.md - auth.me, auth.logout](./API.md#autenticación)
- [SETUP.md - Configuración de Manus OAuth](./SETUP.md#configuración-de-manus-oauth)

**Base de Datos:**
- [DATABASE.md](./DATABASE.md) - Esquema completo
- [ARCHITECTURE.md - Capa de Persistencia](./ARCHITECTURE.md#3-capa-de-persistencia-base-de-datos)

**APIs:**
- [API.md](./API.md) - Documentación completa
- [ARCHITECTURE.md - Estructura de tRPC](./ARCHITECTURE.md#estructura-de-trpc-routers)

**Despliegue:**
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Múltiples opciones
- [SETUP.md - Desarrollo Local](./SETUP.md)

**Contribución:**
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guía completa
- [GITHUB_STRUCTURE.md](./GITHUB_STRUCTURE.md) - Organización

---

## ❓ Preguntas Frecuentes

**P: ¿Por dónde empiezo?**
R: Lee [README.md](../README.md) y luego [SETUP.md](./SETUP.md)

**P: ¿Cómo contribuyo?**
R: Lee [CONTRIBUTING.md](./CONTRIBUTING.md)

**P: ¿Cómo despliego a producción?**
R: Lee [DEPLOYMENT.md](./DEPLOYMENT.md)

**P: ¿Cómo uso las APIs?**
R: Lee [API.md](./API.md)

**P: ¿Cómo entiendo la arquitectura?**
R: Lee [ARCHITECTURE.md](./ARCHITECTURE.md)

**P: ¿Cómo entiendo la base de datos?**
R: Lee [DATABASE.md](./DATABASE.md)

---

## 📞 Contacto y Soporte

- **Issues:** Abre un issue en GitHub
- **Discussions:** Participa en las discusiones
- **Email:** contacto@ksol.dev (si está disponible)

---

## 📝 Última Actualización

**Fecha:** Noviembre 2025
**Versión:** 1.0.0
**Estado:** Documentación Completa

---

¡Gracias por usar KSol! 🇧🇴❤️
