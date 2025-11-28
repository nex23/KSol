# Documentación de Base de Datos - KSol

## Descripción General

KSol utiliza **PostgreSQL** como base de datos relacional, con **Drizzle ORM** para gestionar el esquema y las migraciones. La base de datos está diseñada para soportar la gestión completa de kermesses benéficas.

## Diagrama de Relaciones

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ openId (UNIQUE) │
│ name            │
│ email           │
│ role            │
│ createdAt       │
│ updatedAt       │
│ lastSignedIn    │
└────────┬────────┘
         │
         ├─────────────────────────────────────────────────────┐
         │                                                     │
         ▼                                                     ▼
┌─────────────────────┐                          ┌──────────────────────┐
│    kermesses        │                          │   collaborators      │
├─────────────────────┤                          ├──────────────────────┤
│ id (PK)             │◄──────────────────────────│ id (PK)              │
│ organizerId (FK)    │                          │ kerMesseId (FK)      │
│ title               │                          │ userId (FK)          │
│ description         │                          │ role                 │
│ beneficiaryName     │                          │ joinedAt             │
│ beneficiaryReason   │                          │ createdAt            │
│ contactPhone        │                          │ updatedAt            │
│ contactEmail        │                          └──────────────────────┘
│ eventDate           │
│ status              │
│ createdAt           │
│ updatedAt           │
└────────┬────────────┘
         │
         ├──────────────────┬──────────────────┬──────────────────┐
         │                  │                  │                  │
         ▼                  ▼                  ▼                  ▼
    ┌─────────┐      ┌────────────┐    ┌──────────────┐    ┌────────┐
    │ dishes  │      │ingredients │    │    sales     │    │  ...   │
    └─────────┘      └────────────┘    └──────────────┘    └────────┘
         │                  │                  │
         ▼                  ▼                  ▼
    ┌──────────┐    ┌──────────────────┐  ┌──────────┐
    │saleItems │    │ingredientDonations│  │deliveries│
    └──────────┘    └──────────────────┘  └──────────┘
```

## Tablas

### 1. `users`

Almacena información de los usuarios del sistema.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO INCREMENT | Identificador único |
| `openId` | VARCHAR(64) | UNIQUE, NOT NULL | ID de OAuth de Manus |
| `name` | TEXT | NULLABLE | Nombre del usuario |
| `email` | VARCHAR(320) | NULLABLE | Email del usuario |
| `loginMethod` | VARCHAR(64) | NULLABLE | Método de login utilizado |
| `role` | ENUM | DEFAULT 'user' | Rol del usuario: 'user' \| 'admin' |
| `createdAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `updatedAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de última actualización |
| `lastSignedIn` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Última vez que inició sesión |

**Índices:**
- PRIMARY KEY: `id`
- UNIQUE: `openId`

**Ejemplo de datos:**
```sql
INSERT INTO users (openId, name, email, role)
VALUES ('oauth_123456', 'Hugo Nex', 'hugo@example.com', 'user');
```

### 2. `kermesses`

Almacena información de los eventos benéficos.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO INCREMENT | Identificador único |
| `organizerId` | INT | FOREIGN KEY (users.id) | Usuario que organiza la kermesse |
| `title` | VARCHAR(255) | NOT NULL | Nombre de la kermesse |
| `description` | TEXT | NULLABLE | Descripción detallada |
| `beneficiaryName` | VARCHAR(255) | NOT NULL | Nombre del beneficiario |
| `beneficiaryReason` | TEXT | NOT NULL | Motivo de la ayuda |
| `contactPhone` | VARCHAR(20) | NOT NULL | Teléfono de contacto |
| `contactEmail` | VARCHAR(320) | NULLABLE | Email de contacto |
| `eventDate` | TIMESTAMP | NOT NULL | Fecha del evento |
| `status` | ENUM | DEFAULT 'planning' | Estado: 'planning' \| 'active' \| 'completed' \| 'cancelled' |
| `createdAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `updatedAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de última actualización |

**Índices:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `organizerId` → `users.id`
- INDEX: `organizerId`, `status`, `eventDate`

**Ejemplo de datos:**
```sql
INSERT INTO kermesses (organizerId, title, beneficiaryName, beneficiaryReason, contactPhone, eventDate)
VALUES (1, 'Kermesse para María', 'María García', 'Operación de corazón', '+591 7123456', '2025-12-15');
```

### 3. `dishes`

Almacena los platos disponibles en cada kermesse.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO INCREMENT | Identificador único |
| `kerMesseId` | INT | FOREIGN KEY (kermesses.id) | Kermesse a la que pertenece |
| `name` | VARCHAR(255) | NOT NULL | Nombre del plato |
| `description` | TEXT | NULLABLE | Descripción del plato |
| `category` | VARCHAR(50) | NOT NULL | Categoría: 'Oriente' \| 'Occidente' |
| `priceInBs` | INT | NOT NULL | Precio en centavos (ej: 1500 = 15 bs) |
| `quantityAvailable` | INT | NOT NULL | Cantidad total disponible |
| `quantitySold` | INT | DEFAULT 0 | Cantidad vendida |
| `createdAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `updatedAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de última actualización |

**Índices:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `kerMesseId` → `kermesses.id`
- INDEX: `kerMesseId`, `category`

**Ejemplo de datos:**
```sql
INSERT INTO dishes (kerMesseId, name, category, priceInBs, quantityAvailable)
VALUES (1, 'Salteña', 'Oriente', 1500, 50);
```

**Nota:** Los precios se almacenan en centavos para evitar problemas de precisión decimal.

### 4. `collaborators`

Almacena los colaboradores de cada kermesse.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO INCREMENT | Identificador único |
| `kerMesseId` | INT | FOREIGN KEY (kermesses.id) | Kermesse |
| `userId` | INT | FOREIGN KEY (users.id) | Usuario colaborador |
| `role` | ENUM | NOT NULL | Rol: 'cook' \| 'seller' \| 'distributor' |
| `joinedAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de unión |
| `createdAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `updatedAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de última actualización |

**Índices:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `kerMesseId` → `kermesses.id`
- FOREIGN KEY: `userId` → `users.id`
- UNIQUE: (`kerMesseId`, `userId`)

**Ejemplo de datos:**
```sql
INSERT INTO collaborators (kerMesseId, userId, role)
VALUES (1, 2, 'seller');
```

### 5. `ingredients`

Almacena los ingredientes necesarios para cada kermesse.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO INCREMENT | Identificador único |
| `kerMesseId` | INT | FOREIGN KEY (kermesses.id) | Kermesse |
| `name` | VARCHAR(255) | NOT NULL | Nombre del ingrediente |
| `quantity` | VARCHAR(50) | NOT NULL | Cantidad requerida |
| `unit` | VARCHAR(50) | NOT NULL | Unidad: 'kg' \| 'litro' \| 'unidad' \| 'docena' |
| `quantityNeeded` | INT | NOT NULL | Cantidad necesaria (en unidades) |
| `quantityDonated` | INT | DEFAULT 0 | Cantidad donada |
| `isDonated` | BOOLEAN | DEFAULT FALSE | ¿Está completamente donado? |
| `createdAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `updatedAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de última actualización |

**Índices:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `kerMesseId` → `kermesses.id`
- INDEX: `kerMesseId`, `isDonated`

**Ejemplo de datos:**
```sql
INSERT INTO ingredients (kerMesseId, name, unit, quantityNeeded)
VALUES (1, 'Harina de trigo', 'kg', 10);
```

### 6. `ingredientDonations`

Registra las donaciones de ingredientes.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO INCREMENT | Identificador único |
| `ingredientId` | INT | FOREIGN KEY (ingredients.id) | Ingrediente donado |
| `donorName` | VARCHAR(255) | NOT NULL | Nombre del donante |
| `donorEmail` | VARCHAR(320) | NULLABLE | Email del donante |
| `donorPhone` | VARCHAR(20) | NULLABLE | Teléfono del donante |
| `quantityDonated` | INT | NOT NULL | Cantidad donada |
| `donatedAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de donación |
| `createdAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |

**Índices:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `ingredientId` → `ingredients.id`
- INDEX: `ingredientId`, `donatedAt`

**Ejemplo de datos:**
```sql
INSERT INTO ingredientDonations (ingredientId, donorName, quantityDonated)
VALUES (1, 'Juan Pérez', 5);
```

### 7. `sales`

Almacena las transacciones de venta.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO INCREMENT | Identificador único |
| `kerMesseId` | INT | FOREIGN KEY (kermesses.id) | Kermesse |
| `sellerId` | INT | FOREIGN KEY (users.id) | Usuario que vende |
| `buyerName` | VARCHAR(255) | NOT NULL | Nombre del comprador |
| `buyerPhone` | VARCHAR(20) | NULLABLE | Teléfono del comprador |
| `totalAmountInBs` | INT | NOT NULL | Monto total en centavos |
| `status` | ENUM | DEFAULT 'pending' | Estado: 'pending' \| 'delivered' \| 'cancelled' |
| `saleDate` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de venta |
| `createdAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `updatedAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de última actualización |

**Índices:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `kerMesseId` → `kermesses.id`
- FOREIGN KEY: `sellerId` → `users.id`
- INDEX: `kerMesseId`, `sellerId`, `status`, `saleDate`

**Ejemplo de datos:**
```sql
INSERT INTO sales (kerMesseId, sellerId, buyerName, totalAmountInBs)
VALUES (1, 2, 'Carlos López', 3500);
```

### 8. `saleItems`

Almacena los detalles de platos vendidos en cada venta.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO INCREMENT | Identificador único |
| `saleId` | INT | FOREIGN KEY (sales.id) | Venta a la que pertenece |
| `dishId` | INT | FOREIGN KEY (dishes.id) | Plato vendido |
| `quantity` | INT | NOT NULL | Cantidad vendida |
| `pricePerUnitInBs` | INT | NOT NULL | Precio unitario en centavos |
| `subtotalInBs` | INT | NOT NULL | Subtotal en centavos |
| `createdAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |

**Índices:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `saleId` → `sales.id`
- FOREIGN KEY: `dishId` → `dishes.id`
- INDEX: `saleId`, `dishId`

**Ejemplo de datos:**
```sql
INSERT INTO saleItems (saleId, dishId, quantity, pricePerUnitInBs, subtotalInBs)
VALUES (1, 1, 2, 1500, 3000);
```

### 9. `deliveries`

Almacena el control de entregas de ventas.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO INCREMENT | Identificador único |
| `saleId` | INT | FOREIGN KEY (sales.id) | Venta a entregar |
| `distributorId` | INT | FOREIGN KEY (users.id) | Usuario que reparte |
| `deliveryDate` | TIMESTAMP | NULLABLE | Fecha de entrega |
| `status` | ENUM | DEFAULT 'pending' | Estado: 'pending' \| 'in_transit' \| 'delivered' |
| `notes` | TEXT | NULLABLE | Notas sobre la entrega |
| `createdAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación |
| `updatedAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de última actualización |

**Índices:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `saleId` → `sales.id`
- FOREIGN KEY: `distributorId` → `users.id`
- INDEX: `saleId`, `distributorId`, `status`

**Ejemplo de datos:**
```sql
INSERT INTO deliveries (saleId, distributorId, status)
VALUES (1, 3, 'pending');
```

## Relaciones

### Relaciones Principales

| Tabla 1 | Tabla 2 | Tipo | Descripción |
|---------|---------|------|-------------|
| `users` | `kermesses` | 1:N | Un usuario organiza múltiples kermesses |
| `users` | `collaborators` | 1:N | Un usuario colabora en múltiples kermesses |
| `users` | `sales` | 1:N | Un usuario realiza múltiples ventas |
| `users` | `deliveries` | 1:N | Un usuario realiza múltiples entregas |
| `kermesses` | `dishes` | 1:N | Una kermesse tiene múltiples platos |
| `kermesses` | `ingredients` | 1:N | Una kermesse necesita múltiples ingredientes |
| `kermesses` | `collaborators` | 1:N | Una kermesse tiene múltiples colaboradores |
| `kermesses` | `sales` | 1:N | Una kermesse genera múltiples ventas |
| `dishes` | `saleItems` | 1:N | Un plato aparece en múltiples ventas |
| `ingredients` | `ingredientDonations` | 1:N | Un ingrediente recibe múltiples donaciones |
| `sales` | `saleItems` | 1:N | Una venta contiene múltiples platos |
| `sales` | `deliveries` | 1:N | Una venta genera una entrega |

## Consultas Comunes

### Obtener todas las kermesses activas

```sql
SELECT * FROM kermesses
WHERE status = 'active'
AND eventDate >= NOW()
ORDER BY eventDate ASC;
```

### Obtener platos disponibles de una kermesse

```sql
SELECT * FROM dishes
WHERE kerMesseId = $1
AND quantityAvailable > quantitySold
ORDER BY category, name;
```

### Calcular ganancias totales de una kermesse

```sql
SELECT 
  SUM(totalAmountInBs) as totalRecaudado,
  COUNT(*) as totalVentas
FROM sales
WHERE kerMesseId = $1
AND status = 'delivered';
```

### Obtener ganancias por vendedor

```sql
SELECT 
  u.id,
  u.name,
  COUNT(s.id) as totalVentas,
  SUM(s.totalAmountInBs) as totalRecaudado
FROM sales s
JOIN users u ON s.sellerId = u.id
WHERE s.kerMesseId = $1
GROUP BY u.id, u.name
ORDER BY totalRecaudado DESC;
```

### Obtener ingredientes faltantes

```sql
SELECT * FROM ingredients
WHERE kerMesseId = $1
AND isDonated = FALSE
ORDER BY quantityNeeded - quantityDonated DESC;
```

### Obtener entregas pendientes

```sql
SELECT 
  d.*,
  s.buyerName,
  s.buyerPhone,
  s.totalAmountInBs
FROM deliveries d
JOIN sales s ON d.saleId = s.id
WHERE d.status IN ('pending', 'in_transit')
ORDER BY d.createdAt ASC;
```

## Migraciones

Las migraciones se gestionan con **Drizzle Kit**. Para crear una nueva migración:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

## Copias de Seguridad

Se recomienda realizar copias de seguridad regulares de la base de datos:

```bash
# Backup completo
pg_dump -U postgres ksol > backup.sql

# Restaurar desde backup
psql -U postgres ksol < backup.sql
```

## Rendimiento

### Índices Recomendados

Los índices siguientes están configurados para optimizar consultas frecuentes:

```sql
-- Búsqueda rápida de kermesses activas
CREATE INDEX idx_kermesses_status_eventDate ON kermesses(status, eventDate);

-- Búsqueda rápida de platos por kermesse
CREATE INDEX idx_dishes_kerMesseId ON dishes(kerMesseId);

-- Búsqueda rápida de ventas por kermesse
CREATE INDEX idx_sales_kerMesseId_status ON sales(kerMesseId, status);

-- Búsqueda rápida de entregas pendientes
CREATE INDEX idx_deliveries_status ON deliveries(status);
```

## Escalabilidad Futura

Para mejorar rendimiento con grandes volúmenes de datos:

1. **Particionamiento:** Particionar tabla `sales` por rango de fechas
2. **Archivado:** Mover datos antiguos a tabla de archivo
3. **Caché:** Usar Redis para datos frecuentemente consultados
4. **Replicación:** Configurar réplicas para lectura

---

**Última actualización:** Noviembre 2025
