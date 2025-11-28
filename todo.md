# KSol - Gestor de Kermesses Benéficas - TODO

## Funcionalidades Principales

### 1. Visualización Pública de Kermesses
- [x] Página de inicio que muestra todas las kermesses activas
- [x] Visualización de información de cada kermesse (beneficiario, fecha, descripción)
- [x] Listado de platos disponibles con cantidades
- [x] Información de contacto para comprar platos
- [x] Acceso sin necesidad de registrarse

### 2. Autenticación y Gestión de Usuarios
- [x] Sistema de registro de usuarios (integrado con Manus OAuth)
- [x] Sistema de login de usuarios
- [x] Perfil de usuario
- [x] Logout de usuarios

### 3. Creación y Gestión de Kermesses
- [x] Crear nueva kermesse (solo usuarios registrados)
- [ ] Editar información de kermesse (nombre, beneficiario, descripción, fecha)
- [x] Definir fecha de venta de la kermesse
- [x] Agregar información del beneficiario y porqué motivo se realiza esa kermesse
- [x] Listar kermesses creadas por el usuario

### 4. Gestión de Platos
- [x] Agregar platos a una kermesse
- [x] Definir cantidad disponible de cada plato
- [ ] Editar información de platos
- [x] Eliminar platos
- [ ] Listado de platos típicos de Bolivia (pre-configurados)

### 5. Gestión de Colaboradores
- [ ] Agregar colaboradores a una kermesse
- [ ] Asignar roles a colaboradores (cocinero, vendedor, repartidor)
- [x] Ver lista de colaboradores
- [ ] Eliminar colaboradores

### 6. Gestión de Ingredientes
- [x] Agregar ingredientes necesarios para cocinar
- [x] Especificar cantidad de ingredientes
- [x] Marcar ingredientes como donados
- [x] Ver lista de ingredientes faltantes
- [x] Permitir que otros usuarios donen ingredientes

### 7. Gestión de Ventas
- [x] Registrar ventas de platos (nombre del comprador, plato, cantidad, monto)
- [x] Ver historial de ventas
- [x] Calcular total de ventas por vendedor
- [x] Generar reportes de ventas

### 8. Gestión de Entregas
- [x] Ver lista de ventas para repartir
- [x] Marcar ventas como entregadas
- [x] Ver estado de entregas
- [x] Registrar detalles de entregas

### 9. Reportes y Ganancias
- [x] Ver ganancias totales de la kermesse
- [x] Ver ganancias por vendedor
- [x] Generar reportes de recaudación
- [ ] Exportar reportes

### 10. Configuración de Datos
- [x] Base de datos con platos típicos de Bolivia (script de seed)
- [x] Precios en Bolivianos (bs)
- [x] Categorías de platos (Oriente, Occidente)
- [x] Ingredientes comunes (script de seed)

## Modelo de Base de Datos

### Tablas Principales
- [ ] users (ya existe)
- [ ] kermesses
- [ ] dishes
- [ ] collaborators
- [ ] ingredients
- [ ] ingredient_donations
- [ ] sales
- [ ] sale_items
- [ ] deliveries

## Interfaz de Usuario

### Páginas Públicas
- [x] Página de inicio (listado de kermesses activas)
- [x] Detalle de kermesse
- [x] Página de login/registro (integrada con Manus OAuth)

### Páginas de Usuario Autenticado
- [x] Dashboard del usuario
- [x] Crear nueva kermesse
- [x] Gestionar kermesse (editar, agregar platos, colaboradores, ingredientes)
- [x] Ver mis kermesses
- [ ] Ver mis colaboraciones

### Páginas de Organizador
- [x] Panel de control de kermesse
- [x] Gestión de vendedores y ventas
- [x] Gestión de repartidores y entregas
- [x] Reportes y ganancias

## Notas Técnicas
- Usar PostgreSQL como base de datos
- Usar Drizzle ORM para las migraciones
- Usar tRPC para las APIs
- Usar React para la interfaz
- Usar Tailwind CSS para estilos
- Precios en Bolivianos (bs)
- Timestamps en UTC, convertir a zona horaria local en frontend


## Datos de Ejemplo

### Script de Seed (seed.mjs)
- [x] 5 usuarios de ejemplo (organizador, vendedores, repartidor, cocinero)
- [x] 2 kermesses de ejemplo
- [x] 11 platos típicos bolivianos (Oriente y Occidente)
- [x] 10 ingredientes comunes
- [x] 4 colaboradores asignados
- [x] 3 donaciones de ingredientes
- [x] 4 ventas de ejemplo
- [x] 8 items de venta
- [x] 4 entregas de ejemplo
- [x] Documentación de seed (SEED_DATA.md)

## Documentación Completada

- [x] README.md - Documentación principal
- [x] docs/ARCHITECTURE.md - Arquitectura técnica
- [x] docs/API.md - Documentación de APIs tRPC
- [x] docs/DATABASE.md - Esquema de base de datos
- [x] docs/SETUP.md - Guía de instalación
- [x] docs/DEPLOYMENT.md - Guía de despliegue
- [x] docs/CONTRIBUTING.md - Guía para contribuidores
- [x] docs/GITHUB_STRUCTURE.md - Estructura de carpetas
- [x] docs/GITHUB_EXPORT_GUIDE.md - Guía de exportación a GitHub
- [x] docs/INDEX.md - Índice de documentación
- [x] docs/SEED_DATA.md - Guía de datos de ejemplo
- [x] LICENSE - Licencia MIT
- [x] CHANGELOG.md - Historial de cambios
- [x] CONTRIBUTORS.md - Lista de contribuidores

## Estado del Proyecto

**Versión:** 1.0.0
**Estado:** Completado y Documentado
**Listo para:** GitHub, Desarrollo, Despliegue

### Características Implementadas
- ✅ Visualización pública de kermesses
- ✅ Autenticación con Manus OAuth
- ✅ Creación y gestión de kermesses
- ✅ Gestión de platos e ingredientes
- ✅ Sistema de donación de ingredientes
- ✅ Registro de ventas
- ✅ Control de entregas
- ✅ Reportes de ganancias
- ✅ Datos de ejemplo con script de seed
- ✅ Documentación completa para GitHub

### Próximas Mejoras (Futuro)
- [ ] Exportar reportes a PDF
- [ ] Notificaciones por email
- [ ] Integración con WhatsApp
- [ ] Aplicación móvil
- [ ] Pagos en línea
- [ ] Análisis avanzado


## Nuevas Características (En Desarrollo)

### Galería de Fotos
- [ ] Agregar tabla de imágenes en base de datos
- [ ] Crear API para subir imágenes
- [ ] Crear componente de galería
- [ ] Permitir que organizadores suban fotos de platos
- [ ] Mostrar galería en detalle de kermesse
- [ ] Integración con almacenamiento S3

### Dashboard de Estadísticas
- [ ] Crear página de estadísticas
- [ ] Gráfico de ventas por día
- [ ] Gráfico de platos más vendidos
- [ ] Gráfico de progreso hacia meta de recaudación
- [ ] Estadísticas de colaboradores
- [ ] Métricas en tiempo real
