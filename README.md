# KSol - Gestor de Kermesses Benéficas

![KSol Logo](https://img.shields.io/badge/KSol-Kermesses%20Ben%C3%A9ficas-red?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-green?style=flat-square)
![Status](https://img.shields.io/badge/status-Active%20Development-yellow?style=flat-square)

## Descripción del Proyecto

**KSol** es una plataforma web integral diseñada para facilitar la organización y gestión de **kermesses benéficas** en Bolivia. Una kermesse es un evento de venta de comida típica boliviana donde toda la ganancia se destina a ayudar a personas que necesitan asistencia médica, medicamentos u operaciones.

La aplicación permite que cualquier persona pueda crear una kermesse, gestionar platos, coordinar colaboradores, registrar ventas, controlar entregas y generar reportes transparentes de recaudación. Todo esto con una interfaz intuitiva y accesible para usuarios sin experiencia técnica.

## Características Principales

### Para Visitantes (Acceso Público)

- **Descubrimiento de Kermesses:** Visualizar todas las kermesses activas sin necesidad de registrarse
- **Información Detallada:** Ver detalles del beneficiario, fecha del evento, descripción y motivo de la ayuda
- **Catálogo de Platos:** Consultar platos disponibles, precios en Bolivianos y cantidades
- **Donación de Ingredientes:** Contribuir con ingredientes necesarios para la preparación de platos
- **Contacto Directo:** Acceder a información de contacto para realizar compras

### Para Usuarios Registrados

- **Crear Kermesses:** Organizar nuevas kermesses benéficas con información del beneficiario
- **Gestión de Platos:** Agregar, editar y eliminar platos con precios y cantidades
- **Gestión de Ingredientes:** Listar ingredientes necesarios y rastrear donaciones
- **Colaboradores:** Invitar y asignar roles (cocinero, vendedor, repartidor)
- **Dashboard Personal:** Panel de control con estadísticas y resumen de actividades

### Para Organizadores

- **Registro de Ventas:** Registrar ventas con nombre del comprador, platos y montos
- **Control de Entregas:** Rastrear estado de entregas (pendiente, en tránsito, entregado)
- **Reportes de Ganancias:** Generar reportes detallados de recaudación por vendedor
- **Gestión de Inventario:** Monitorear disponibilidad de platos en tiempo real
- **Transparencia:** Visualizar ganancias totales y por vendedor para máxima transparencia

## Stack Tecnológico

### Frontend

- **React 19** - Interfaz de usuario moderna
- **TypeScript** - Tipado estático para mayor seguridad
- **Tailwind CSS 4** - Estilos responsivos y accesibles
- **shadcn/ui** - Componentes reutilizables de alta calidad
- **Wouter** - Enrutamiento ligero y eficiente
- **tRPC** - Llamadas a API type-safe

### Backend

- **Express 4** - Servidor web robusto
- **tRPC 11** - Framework RPC type-safe
- **Node.js 22** - Runtime de JavaScript
- **Drizzle ORM** - ORM moderno y type-safe

### Base de Datos

- **PostgreSQL** - Base de datos relacional robusta
- **Drizzle Kit** - Herramienta de migraciones

### Autenticación

- **Manus OAuth** - Sistema de autenticación integrado
- **JWT** - Tokens seguros para sesiones

## Estructura del Proyecto

```
ksol/
├── client/                          # Aplicación frontend (React)
│   ├── src/
│   │   ├── pages/                   # Páginas principales
│   │   │   ├── Home.tsx             # Página de inicio pública
│   │   │   ├── KermesseDetail.tsx   # Detalle de kermesse
│   │   │   ├── CreateKermesse.tsx   # Crear nueva kermesse
│   │   │   ├── Dashboard.tsx        # Panel del usuario
│   │   │   ├── ManageKermesse.tsx   # Gestionar kermesse
│   │   │   ├── DonateIngredient.tsx # Donar ingredientes
│   │   │   ├── RegisterSale.tsx     # Registrar ventas
│   │   │   ├── ManageDeliveries.tsx # Gestionar entregas
│   │   │   └── SalesReport.tsx      # Reportes de ventas
│   │   ├── components/              # Componentes reutilizables
│   │   ├── lib/                     # Utilidades y helpers
│   │   ├── contexts/                # Contextos de React
│   │   ├── App.tsx                  # Componente raíz
│   │   └── main.tsx                 # Punto de entrada
│   ├── public/                      # Archivos estáticos
│   └── index.html                   # HTML principal
│
├── server/                          # Aplicación backend (Express + tRPC)
│   ├── routers.ts                   # Definición de procedimientos tRPC
│   ├── db.ts                        # Helpers de base de datos
│   ├── storage.ts                   # Helpers de almacenamiento S3
│   └── _core/                       # Código base del framework
│
├── drizzle/                         # Esquema y migraciones
│   ├── schema.ts                    # Definición de tablas
│   └── migrations/                  # Archivos de migración
│
├── shared/                          # Código compartido
│   └── const.ts                     # Constantes globales
│
├── docs/                            # Documentación
│   ├── ARCHITECTURE.md              # Arquitectura del sistema
│   ├── API.md                       # Documentación de APIs
│   ├── DATABASE.md                  # Esquema de base de datos
│   ├── SETUP.md                     # Guía de instalación
│   ├── DEPLOYMENT.md                # Guía de despliegue
│   └── CONTRIBUTING.md              # Guía para contribuidores
│
├── .env.example                     # Variables de entorno de ejemplo
├── package.json                     # Dependencias del proyecto
├── tsconfig.json                    # Configuración de TypeScript
├── vite.config.ts                   # Configuración de Vite
├── drizzle.config.ts                # Configuración de Drizzle
└── README.md                        # Este archivo
```

## Instalación y Configuración

### Requisitos Previos

- Node.js 18.0.0 o superior
- npm o pnpm
- PostgreSQL 12 o superior
- Git

### Pasos de Instalación

Consulta [SETUP.md](./docs/SETUP.md) para instrucciones detalladas de instalación y configuración.

## Uso Rápido

### Iniciar el Servidor de Desarrollo

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar migraciones de base de datos
pnpm db:push

# Iniciar servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Documentación

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Arquitectura técnica, patrones de diseño y decisiones de arquitectura
- **[API.md](./docs/API.md)** - Documentación completa de todas las APIs tRPC
- **[DATABASE.md](./docs/DATABASE.md)** - Esquema de base de datos, relaciones y tipos
- **[SETUP.md](./docs/SETUP.md)** - Guía de instalación, configuración y primeros pasos
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Guía de despliegue a producción
- **[CONTRIBUTING.md](./docs/CONTRIBUTING.md)** - Guía para contribuidores y estándares de código

## Flujo de Trabajo Principal

### 1. Crear una Kermesse

Un usuario registrado puede crear una nueva kermesse proporcionando:
- Nombre y descripción del evento
- Información del beneficiario y motivo de la ayuda
- Fecha del evento
- Contacto (teléfono y email)

### 2. Agregar Platos e Ingredientes

El organizador agrega platos típicos de Bolivia con:
- Nombre, descripción y categoría (Oriente/Occidente)
- Precio en Bolivianos
- Cantidad disponible

También lista ingredientes necesarios para que otros usuarios puedan donarlos.

### 3. Invitar Colaboradores

El organizador invita a colaboradores asignándoles roles:
- **Cocinero:** Prepara los platos
- **Vendedor:** Vende los platos a los clientes
- **Repartidor:** Entrega los platos a los compradores

### 4. Registrar Ventas

Los vendedores registran cada venta con:
- Nombre del comprador
- Platos vendidos y cantidades
- Monto total en Bolivianos

### 5. Gestionar Entregas

Los repartidores marcan las entregas como:
- Pendiente
- En tránsito
- Entregado

### 6. Generar Reportes

El organizador puede ver reportes detallados con:
- Total recaudado
- Ganancias por vendedor
- Estado de entregas
- Transparencia completa de fondos

## Características de Seguridad

- **Autenticación OAuth:** Integración segura con Manus OAuth
- **Autorización por Roles:** Control de acceso basado en roles (usuario, organizador, admin)
- **Validación de Datos:** Validación exhaustiva con Zod en frontend y backend
- **Protección CSRF:** Tokens CSRF para prevenir ataques
- **Encriptación:** Datos sensibles encriptados en tránsito (HTTPS)
- **Sesiones Seguras:** Cookies seguras y httpOnly

## Platos Típicos de Bolivia

La aplicación incluye categorías para platos del Oriente y Occidente de Bolivia:

**Oriente:** Salteñas, Empanadas, Pastel de Queso, Locro, Arroz con Pollo

**Occidente:** Chuño, Papa a la Huancaína, Humita, Tamales, Quinua

Los precios están configurados en Bolivianos (bs) para facilidad local.

## Contribución

¡Las contribuciones son bienvenidas! Consulta [CONTRIBUTING.md](./docs/CONTRIBUTING.md) para:
- Estándares de código
- Proceso de pull requests
- Convenciones de commits
- Cómo reportar bugs

## Roadmap

### v1.1 (Próximas Mejoras)

- [ ] Exportar reportes a PDF
- [ ] Sistema de notificaciones por email
- [ ] Integración con WhatsApp para confirmaciones
- [ ] Galería de fotos de kermesses
- [ ] Sistema de calificaciones y comentarios

### v2.0 (Futuro)

- [ ] Aplicación móvil (React Native)
- [ ] Integración de pagos en línea
- [ ] Sistema de análisis avanzado
- [ ] Soporte multiidioma
- [ ] Marketplace de kermesses

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

## Soporte y Contacto

Para reportar bugs, sugerencias o preguntas:

- **Issues:** Abre un issue en GitHub
- **Discussions:** Participa en las discusiones del proyecto
- **Email:** yo@hugonex.com - thenex@gmail.com

## Créditos

Desarrollado por HugoNex con ❤️ para la comunidad boliviana.

---

**Última actualización:** Noviembre 2025

**Versión:** 1.0.0

**Estado:** En desarrollo activo
