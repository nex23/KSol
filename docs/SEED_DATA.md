# Guía de Datos de Ejemplo - KSol

Este documento describe cómo usar el script de seed para crear datos de ejemplo en la base de datos de KSol.

## ¿Qué es el Script de Seed?

El script `seed.mjs` crea automáticamente datos de ejemplo en la base de datos para que puedas:

- Ver cómo funciona la aplicación sin crear datos manualmente
- Probar todas las funcionalidades
- Demostrar la aplicación a otros usuarios
- Desarrollar nuevas características con datos realistas

## Datos que se Crean

### 1. Usuarios (5 usuarios)

| Nombre | Email | Rol | Descripción |
|--------|-------|-----|-------------|
| María García | maria@example.com | Organizadora | Crea y organiza kermesses |
| Juan Pérez | juan@example.com | Vendedor | Vende platos |
| Rosa López | rosa@example.com | Vendedora | Vende platos |
| Carlos Rodríguez | carlos@example.com | Repartidor | Entrega pedidos |
| Ana Martínez | ana@example.com | Cocinera | Prepara los platos |

### 2. Kermesses (2 kermesses)

#### Kermesse 1: "Kermesse para la Salud de María"
- **Organizador:** María García
- **Beneficiario:** María García López
- **Motivo:** Operación de corazón - Gastos médicos urgentes
- **Fecha:** 15 de Diciembre 2025
- **Estado:** Activa
- **Contacto:** +591 7123456

#### Kermesse 2: "Kermesse Solidaria - Educación para Juanito"
- **Organizador:** María García
- **Beneficiario:** Juanito Flores
- **Motivo:** Educación - Gastos escolares y útiles
- **Fecha:** 22 de Diciembre 2025
- **Estado:** En Planificación
- **Contacto:** +591 7654321

### 3. Platos Típicos Bolivianos (11 platos)

#### Oriente (5 platos)

| Plato | Descripción | Precio | Cantidad |
|-------|-------------|--------|----------|
| Salteña | Empanada rellena de carne, papa y salsa picante | 15 bs | 100 |
| Empanada de Queso | Empanada rellena de queso fresco y cebolla | 12 bs | 80 |
| Pastel de Choclo | Pastel de maíz tierno con relleno de carne y huevo | 20 bs | 50 |
| Sopa de Maní | Sopa tradicional de maní con carne y verduras | 18 bs | 60 |
| Locro | Guiso de maíz, papa y carne | 22 bs | 40 |

#### Occidente (6 platos)

| Plato | Descripción | Precio | Cantidad |
|-------|-------------|--------|----------|
| Anticuchos | Brochetas de carne marinada en vinagre y especias | 25 bs | 70 |
| Huminta | Pastel de maíz tierno envuelto en hojas de choclo | 15 bs | 90 |
| Caldo de Camarones | Caldo tradicional con camarones y verduras | 28 bs | 30 |
| Picante de Pollo | Pollo en salsa picante con papas | 25 bs | 60 |
| Causa Limeña | Puré de papa con relleno de pollo o atún | 18 bs | 50 |
| Ceviche | Pescado marinado en limón con cebolla y ají | 30 bs | 25 |

### 4. Ingredientes (10 ingredientes)

| Ingrediente | Cantidad Necesaria | Unidad |
|-------------|-------------------|--------|
| Harina de trigo | 10 | kg |
| Carne molida | 15 | kg |
| Papa | 20 | kg |
| Cebolla | 5 | kg |
| Ají rojo | 2 | kg |
| Queso fresco | 8 | kg |
| Huevos | 5 | docena |
| Leche | 10 | litro |
| Maní molido | 3 | kg |
| Pollo | 12 | kg |

### 5. Donaciones de Ingredientes (3 donaciones)

| Donante | Ingrediente | Cantidad | Teléfono |
|---------|------------|----------|----------|
| Supermercado Central | Harina de trigo | 5 kg | +591 7111111 |
| Carnicería Don José | Carne molida | 8 kg | +591 7222222 |
| Quesería Familiar | Queso fresco | 4 kg | +591 7333333 |

### 6. Colaboradores (4 colaboradores)

| Nombre | Rol | Kermesse |
|--------|-----|----------|
| Juan Pérez | Vendedor | Kermesse para la Salud de María |
| Rosa López | Vendedora | Kermesse para la Salud de María |
| Carlos Rodríguez | Repartidor | Kermesse para la Salud de María |
| Ana Martínez | Cocinera | Kermesse para la Salud de María |

### 7. Ventas (4 ventas)

| Comprador | Vendedor | Platos | Total | Estado |
|-----------|----------|--------|-------|--------|
| Pedro Gómez | Juan Pérez | 2 Salteñas + 1 Empanada | 45 bs | Entregado |
| Laura Sánchez | Rosa López | 2 Anticuchos + 1 Huminta | 60 bs | Entregado |
| Miguel Torres | Juan Pérez | 2 Pasteles + 1 Sopa | 55 bs | Pendiente |
| Carmen Flores | Rosa López | 2 Huminta + 1 Caldo | 35 bs | Pendiente |

### 8. Entregas (4 entregas)

| Comprador | Repartidor | Estado | Notas |
|-----------|-----------|--------|-------|
| Pedro Gómez | Carlos Rodríguez | Entregado | Entrega completada sin problemas |
| Laura Sánchez | Carlos Rodríguez | Entregado | Cliente muy satisfecho |
| Miguel Torres | Carlos Rodríguez | Pendiente | Pendiente de entrega |
| Carmen Flores | Carlos Rodríguez | En Tránsito | En camino hacia el cliente |

## Cómo Usar el Script

### Requisitos Previos

1. **Base de datos creada:**
   ```bash
   # Crear base de datos
   psql -U postgres
   CREATE DATABASE ksol;
   \q
   ```

2. **Migraciones ejecutadas:**
   ```bash
   pnpm db:push
   ```

3. **Variables de entorno configuradas:**
   ```bash
   # Copiar .env.example a .env.local
   cp .env.example .env.local
   
   # Editar .env.local con tu DATABASE_URL
   nano .env.local
   ```

### Ejecutar el Script

#### Opción 1: Crear Datos de Ejemplo

```bash
# Ejecutar el script de seed
pnpm seed
```

**Salida esperada:**
```
🌱 Iniciando seed de datos...

👥 Creando usuarios...
✅ 5 usuarios creados

🎉 Creando kermesses...
✅ 2 kermesses creadas

🍽️  Creando platos...
✅ 11 platos creados

🥘 Creando ingredientes...
✅ 10 ingredientes creados

🤝 Creando colaboradores...
✅ 4 colaboradores creados

🎁 Creando donaciones de ingredientes...
✅ 3 donaciones creadas

💰 Creando ventas...
✅ 4 ventas creadas

🛒 Creando items de venta...
✅ 8 items de venta creados

🚚 Creando entregas...
✅ 4 entregas creadas

═══════════════════════════════════════════
✨ SEED COMPLETADO EXITOSAMENTE ✨
═══════════════════════════════════════════

📊 Resumen de datos creados:
   • Usuarios: 5
   • Kermesses: 2
   • Platos: 11
   • Ingredientes: 10
   • Colaboradores: 4
   • Donaciones: 3
   • Ventas: 4
   • Items de venta: 8
   • Entregas: 4

📝 Usuarios de prueba:
   • María García (Organizadora): maria@example.com
   • Juan Pérez (Vendedor): juan@example.com
   • Rosa López (Vendedora): rosa@example.com
   • Carlos Rodríguez (Repartidor): carlos@example.com
   • Ana Martínez (Cocinera): ana@example.com

🎉 ¡La base de datos está lista para usar!
═══════════════════════════════════════════
```

#### Opción 2: Resetear y Crear Datos (Futuro)

```bash
# Nota: Esta opción está disponible para futuras versiones
pnpm seed:reset
```

## Cómo Probar los Datos

### 1. Iniciar la Aplicación

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

### 2. Ver Kermesses Públicas

1. Ve a la página de inicio
2. Deberías ver 2 kermesses listadas:
   - "Kermesse para la Salud de María" (Activa)
   - "Kermesse Solidaria - Educación para Juanito" (Planificación)

### 3. Ver Detalles de una Kermesse

1. Haz clic en "Kermesse para la Salud de María"
2. Deberías ver:
   - Información del beneficiario
   - 11 platos disponibles con precios
   - 10 ingredientes necesarios
   - 3 donaciones de ingredientes

### 4. Ingresar como Usuario

Para probar funcionalidades de usuario, necesitas ingresar como uno de los usuarios de ejemplo. Debido a que usamos Manus OAuth, deberás:

1. Usar la función de login de la aplicación
2. Crear una cuenta con uno de los emails de ejemplo
3. O contactar al administrador para obtener acceso directo

### 5. Probar Funcionalidades

#### Como Organizador (María García)
- Ver tus kermesses en el dashboard
- Editar información de kermesses
- Ver reportes de ventas
- Ver ganancias por vendedor

#### Como Vendedor (Juan o Rosa)
- Ver kermesses disponibles
- Registrar ventas
- Ver mis ventas

#### Como Repartidor (Carlos)
- Ver entregas pendientes
- Marcar entregas como completadas

#### Como Cocinero (Ana)
- Ver ingredientes necesarios
- Contribuir a la preparación

## Modificar Datos de Ejemplo

Si quieres cambiar los datos de ejemplo, edita el archivo `seed.mjs`:

```javascript
// Cambiar datos de usuarios
const exampleUsers = [
  {
    openId: 'user_organizer_1',
    name: 'Tu Nombre', // Cambiar aquí
    email: 'tu@email.com', // Cambiar aquí
    // ...
  },
  // ...
];

// Cambiar datos de kermesses
const exampleKermesses = [
  {
    title: 'Tu Kermesse', // Cambiar aquí
    beneficiaryName: 'Nombre del Beneficiario', // Cambiar aquí
    // ...
  },
  // ...
];

// Cambiar datos de platos
const dishesOriente = [
  {
    name: 'Tu Plato', // Cambiar aquí
    priceInBs: 1500, // Cambiar precio aquí
    // ...
  },
  // ...
];
```

Luego ejecuta el script nuevamente:

```bash
pnpm seed
```

## Limpiar Datos

Si quieres eliminar todos los datos de ejemplo y empezar de nuevo:

### Opción 1: Usar Drizzle Studio

```bash
pnpm db:studio
```

Luego elimina manualmente los datos en la interfaz.

### Opción 2: Usar SQL

```bash
psql -U ksol_user -d ksol -h localhost

-- Eliminar todos los datos
DELETE FROM ingredientDonations;
DELETE FROM deliveries;
DELETE FROM saleItems;
DELETE FROM sales;
DELETE FROM collaborators;
DELETE FROM ingredients;
DELETE FROM dishes;
DELETE FROM kermesses;
DELETE FROM users;

-- Salir
\q
```

### Opción 3: Recrear la Base de Datos

```bash
# Eliminar base de datos
psql -U postgres
DROP DATABASE ksol;

# Crear nueva base de datos
CREATE DATABASE ksol;
\q

# Ejecutar migraciones
pnpm db:push

# Ejecutar seed
pnpm seed
```

## Preguntas Frecuentes

**P: ¿Puedo agregar más datos de ejemplo?**
R: Sí, edita `seed.mjs` y agrega más elementos a los arrays de ejemplo.

**P: ¿Puedo usar datos reales en lugar de ejemplo?**
R: Sí, reemplaza los datos de ejemplo con datos reales en `seed.mjs`.

**P: ¿El script elimina datos existentes?**
R: No, el script está configurado para NO eliminar datos existentes. Si quieres limpiar primero, descomenta las líneas de `DELETE` en `seed.mjs`.

**P: ¿Puedo ejecutar el script múltiples veces?**
R: Sí, pero creará datos duplicados. Si quieres evitar duplicados, limpia la base de datos primero.

**P: ¿Cómo cambio los precios de los platos?**
R: Edita el valor `priceInBs` en los arrays `dishesOriente` y `dishesOccidente`. Los precios están en centavos (ej: 1500 = 15 bs).

## Próximos Pasos

1. **Ejecutar el script:** `pnpm seed`
2. **Iniciar la aplicación:** `pnpm dev`
3. **Explorar los datos:** Navega por la aplicación
4. **Probar funcionalidades:** Crea ventas, entregas, etc.
5. **Modificar datos:** Edita `seed.mjs` según necesites

---

**Última actualización:** Noviembre 2025
