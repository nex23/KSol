# Documentación de APIs tRPC - KSol

## Introducción

KSol utiliza **tRPC** para proporcionar APIs type-safe entre el frontend y el backend. Todas las llamadas a API son automáticamente tipadas, lo que elimina errores en tiempo de ejecución.

## Estructura General

Todas las APIs siguen este patrón:

```typescript
// Frontend
const { data, isLoading, error } = trpc.router.procedure.useQuery(input);
const mutation = trpc.router.procedure.useMutation();

// Backend
router({
  procedure: publicProcedure
    .input(z.object({ /* validación */ }))
    .query(async ({ input, ctx }) => {
      // lógica
    })
})
```

## Autenticación

### `auth.me`

Obtiene información del usuario actual.

**Tipo:** `publicProcedure` (sin autenticación requerida)

**Input:** Ninguno

**Output:**
```typescript
{
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
} | null
```

**Ejemplo:**
```typescript
const { data: user } = trpc.auth.me.useQuery();
if (user) {
  console.log(`Bienvenido, ${user.name}`);
}
```

### `auth.logout`

Cierra la sesión del usuario actual.

**Tipo:** `publicProcedure`

**Input:** Ninguno

**Output:**
```typescript
{ success: true }
```

**Ejemplo:**
```typescript
const logout = trpc.auth.logout.useMutation({
  onSuccess: () => {
    window.location.href = '/';
  }
});

logout.mutate();
```

## Kermesses

### `kermesses.getActive`

Obtiene todas las kermesses activas (públicas).

**Tipo:** `publicProcedure`

**Input:** Ninguno

**Output:**
```typescript
Array<{
  id: number;
  organizerId: number;
  title: string;
  description: string | null;
  beneficiaryName: string;
  beneficiaryReason: string;
  contactPhone: string;
  contactEmail: string | null;
  eventDate: Date;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}>
```

**Ejemplo:**
```typescript
const { data: kermesses } = trpc.kermesses.getActive.useQuery();
```

### `kermesses.getAll`

Obtiene todas las kermesses (públicas).

**Tipo:** `publicProcedure`

**Input:** Ninguno

**Output:** Array de kermesses (igual a `getActive`)

**Ejemplo:**
```typescript
const { data: allKermesses } = trpc.kermesses.getAll.useQuery();
```

### `kermesses.getById`

Obtiene una kermesse específica por ID.

**Tipo:** `publicProcedure`

**Input:**
```typescript
{
  id: number
}
```

**Output:** Objeto kermesse o `null`

**Ejemplo:**
```typescript
const { data: kermesse } = trpc.kermesses.getById.useQuery(
  { id: 1 },
  { enabled: id > 0 }
);
```

### `kermesses.getMine`

Obtiene todas las kermesses creadas por el usuario actual.

**Tipo:** `protectedProcedure` (requiere autenticación)

**Input:** Ninguno

**Output:** Array de kermesses

**Ejemplo:**
```typescript
const { data: myKermesses } = trpc.kermesses.getMine.useQuery(undefined, {
  enabled: isAuthenticated
});
```

### `kermesses.create`

Crea una nueva kermesse.

**Tipo:** `protectedProcedure`

**Input:**
```typescript
{
  title: string;                    // Nombre de la kermesse
  description?: string;             // Descripción opcional
  beneficiaryName: string;          // Nombre del beneficiario
  beneficiaryReason: string;        // Motivo de la ayuda
  contactPhone: string;             // Teléfono de contacto
  contactEmail?: string;            // Email opcional
  eventDate: Date;                  // Fecha del evento
}
```

**Output:**
```typescript
{
  insertId: number;  // ID de la kermesse creada
}
```

**Ejemplo:**
```typescript
const createKermesse = trpc.kermesses.create.useMutation({
  onSuccess: (result) => {
    console.log(`Kermesse creada con ID: ${result.insertId}`);
  }
});

createKermesse.mutate({
  title: 'Kermesse para María',
  beneficiaryName: 'María García',
  beneficiaryReason: 'Operación de corazón',
  contactPhone: '+591 7123456',
  eventDate: new Date('2025-12-15')
});
```

### `kermesses.update`

Actualiza una kermesse existente (solo el organizador).

**Tipo:** `protectedProcedure`

**Input:**
```typescript
{
  id: number;
  title?: string;
  description?: string;
  beneficiaryName?: string;
  beneficiaryReason?: string;
  contactPhone?: string;
  contactEmail?: string;
  eventDate?: Date;
  status?: 'planning' | 'active' | 'completed' | 'cancelled';
}
```

**Output:** Resultado de actualización

**Ejemplo:**
```typescript
const updateKermesse = trpc.kermesses.update.useMutation();

updateKermesse.mutate({
  id: 1,
  status: 'active'
});
```

## Platos (Dishes)

### `dishes.getForKermesse`

Obtiene todos los platos de una kermesse.

**Tipo:** `publicProcedure`

**Input:**
```typescript
{
  kerMesseId: number
}
```

**Output:**
```typescript
Array<{
  id: number;
  kerMesseId: number;
  name: string;
  description: string | null;
  category: string;              // 'Oriente' | 'Occidente'
  priceInBs: number;            // Precio en centavos
  quantityAvailable: number;
  quantitySold: number;
  createdAt: Date;
  updatedAt: Date;
}>
```

**Ejemplo:**
```typescript
const { data: dishes } = trpc.dishes.getForKermesse.useQuery(
  { kerMesseId: 1 }
);
```

### `dishes.create`

Crea un nuevo plato en una kermesse.

**Tipo:** `protectedProcedure`

**Input:**
```typescript
{
  kerMesseId: number;
  name: string;
  description?: string;
  category: string;              // 'Oriente' | 'Occidente'
  priceInBs: number;            // Precio en centavos (ej: 1500 = 15 bs)
  quantityAvailable: number;
}
```

**Output:** Resultado de creación

**Ejemplo:**
```typescript
const createDish = trpc.dishes.create.useMutation();

createDish.mutate({
  kerMesseId: 1,
  name: 'Salteña',
  category: 'Oriente',
  priceInBs: 1500,              // 15 bs
  quantityAvailable: 50
});
```

### `dishes.update`

Actualiza un plato existente.

**Tipo:** `protectedProcedure`

**Input:**
```typescript
{
  id: number;
  name?: string;
  description?: string;
  category?: string;
  priceInBs?: number;
  quantityAvailable?: number;
}
```

**Output:** Resultado de actualización

### `dishes.delete`

Elimina un plato.

**Tipo:** `protectedProcedure`

**Input:**
```typescript
{
  id: number
}
```

**Output:** Resultado de eliminación

## Ingredientes (Ingredients)

### `ingredients.getForKermesse`

Obtiene todos los ingredientes de una kermesse.

**Tipo:** `publicProcedure`

**Input:**
```typescript
{
  kerMesseId: number
}
```

**Output:**
```typescript
Array<{
  id: number;
  kerMesseId: number;
  name: string;
  quantity: string;
  unit: string;                  // 'kg', 'litro', 'unidad', etc
  quantityNeeded: number;
  quantityDonated: number;
  isDonated: boolean;
  createdAt: Date;
  updatedAt: Date;
}>
```

### `ingredients.create`

Crea un nuevo ingrediente.

**Tipo:** `protectedProcedure`

**Input:**
```typescript
{
  kerMesseId: number;
  name: string;
  quantity: string;
  unit: string;
  quantityNeeded: number;
}
```

**Output:** Resultado de creación

### `ingredients.update`

Actualiza un ingrediente.

**Tipo:** `protectedProcedure`

**Input:**
```typescript
{
  id: number;
  name?: string;
  quantity?: string;
  unit?: string;
  quantityNeeded?: number;
  quantityDonated?: number;
  isDonated?: boolean;
}
```

### `ingredients.delete`

Elimina un ingrediente.

**Tipo:** `protectedProcedure`

**Input:**
```typescript
{
  id: number
}
```

## Donaciones de Ingredientes

### `ingredientDonations.getForIngredient`

Obtiene todas las donaciones de un ingrediente.

**Tipo:** `publicProcedure`

**Input:**
```typescript
{
  ingredientId: number
}
```

**Output:**
```typescript
Array<{
  id: number;
  ingredientId: number;
  donorName: string;
  donorEmail: string | null;
  donorPhone: string | null;
  quantityDonated: number;
  donatedAt: Date;
  createdAt: Date;
}>
```

### `ingredientDonations.create`

Registra una donación de ingrediente (público, no requiere login).

**Tipo:** `publicProcedure`

**Input:**
```typescript
{
  ingredientId: number;
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  quantityDonated: number;
}
```

**Output:** Resultado de creación

**Ejemplo:**
```typescript
const donate = trpc.ingredientDonations.create.useMutation();

donate.mutate({
  ingredientId: 5,
  donorName: 'Juan Pérez',
  donorPhone: '+591 7654321',
  quantityDonated: 2  // 2 kg
});
```

## Ventas (Sales)

### `sales.getForKermesse`

Obtiene todas las ventas de una kermesse (solo organizador).

**Tipo:** `protectedProcedure`

**Input:**
```typescript
{
  kerMesseId: number
}
```

**Output:**
```typescript
Array<{
  id: number;
  kerMesseId: number;
  sellerId: number;
  buyerName: string;
  buyerPhone: string | null;
  totalAmountInBs: number;      // En centavos
  status: 'pending' | 'delivered' | 'cancelled';
  saleDate: Date;
  createdAt: Date;
  updatedAt: Date;
}>
```

### `sales.getMySales`

Obtiene todas las ventas del vendedor actual.

**Tipo:** `protectedProcedure`

**Input:** Ninguno

**Output:** Array de ventas

### `sales.create`

Registra una nueva venta.

**Tipo:** `protectedProcedure`

**Input:**
```typescript
{
  kerMesseId: number;
  buyerName: string;
  buyerPhone?: string;
  items: Array<{
    dishId: number;
    quantity: number;
    pricePerUnitInBs: number;
  }>;
}
```

**Output:**
```typescript
{
  id: number;
  totalAmountInBs: number;
}
```

**Ejemplo:**
```typescript
const registerSale = trpc.sales.create.useMutation();

registerSale.mutate({
  kerMesseId: 1,
  buyerName: 'Carlos López',
  buyerPhone: '+591 7111111',
  items: [
    { dishId: 1, quantity: 2, pricePerUnitInBs: 1500 },  // 2 salteñas a 15 bs
    { dishId: 2, quantity: 1, pricePerUnitInBs: 2000 }   // 1 empanada a 20 bs
  ]
});
```

### `sales.updateStatus`

Actualiza el estado de una venta.

**Tipo:** `protectedProcedure`

**Input:**
```typescript
{
  id: number;
  status: 'pending' | 'delivered' | 'cancelled';
}
```

## Artículos de Venta (Sale Items)

### `saleItems.getForSale`

Obtiene todos los artículos de una venta.

**Tipo:** `protectedProcedure`

**Input:**
```typescript
{
  saleId: number
}
```

**Output:**
```typescript
Array<{
  id: number;
  saleId: number;
  dishId: number;
  quantity: number;
  pricePerUnitInBs: number;
  subtotalInBs: number;
  createdAt: Date;
}>
```

## Colaboradores (Collaborators)

### `collaborators.getForKermesse`

Obtiene todos los colaboradores de una kermesse.

**Tipo:** `publicProcedure`

**Input:**
```typescript
{
  kerMesseId: number
}
```

**Output:**
```typescript
Array<{
  id: number;
  kerMesseId: number;
  userId: number;
  role: 'cook' | 'seller' | 'distributor';
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}>
```

### `collaborators.add`

Agrega un colaborador a una kermesse (solo organizador).

**Tipo:** `protectedProcedure`

**Input:**
```typescript
{
  kerMesseId: number;
  userId: number;
  role: 'cook' | 'seller' | 'distributor';
}
```

**Output:** Resultado de creación

### `collaborators.remove`

Elimina un colaborador.

**Tipo:** `protectedProcedure`

**Input:**
```typescript
{
  id: number
}
```

## Entregas (Deliveries)

### `deliveries.getForKermesse`

Obtiene todas las entregas de una kermesse (solo organizador).

**Tipo:** `protectedProcedure`

**Input:**
```typescript
{
  kerMesseId: number
}
```

**Output:**
```typescript
Array<{
  deliveries: {
    id: number;
    saleId: number;
    distributorId: number;
    deliveryDate: Date | null;
    status: 'pending' | 'in_transit' | 'delivered';
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  sales: {
    id: number;
    buyerName: string;
    buyerPhone: string | null;
    totalAmountInBs: number;
    saleDate: Date;
  };
}>
```

### `deliveries.getMyDeliveries`

Obtiene todas las entregas del repartidor actual.

**Tipo:** `protectedProcedure`

**Input:** Ninguno

**Output:** Array de entregas

### `deliveries.create`

Crea una nueva entrega (solo organizador).

**Tipo:** `protectedProcedure`

**Input:**
```typescript
{
  saleId: number;
  distributorId: number;
  notes?: string;
}
```

**Output:** Resultado de creación

### `deliveries.updateStatus`

Actualiza el estado de una entrega.

**Tipo:** `protectedProcedure`

**Input:**
```typescript
{
  id: number;
  status: 'pending' | 'in_transit' | 'delivered';
}
```

**Output:** Resultado de actualización

## Manejo de Errores

Todos los endpoints pueden retornar errores tRPC:

```typescript
{
  code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'BAD_REQUEST' | 'INTERNAL_SERVER_ERROR';
  message: string;
}
```

**Ejemplo de manejo de errores:**

```typescript
const mutation = trpc.kermesses.create.useMutation({
  onError: (error) => {
    if (error.code === 'UNAUTHORIZED') {
      // Redirigir a login
    } else {
      // Mostrar mensaje de error
      toast.error(error.message);
    }
  }
});
```

## Mejores Prácticas

### 1. Usar `enabled` para queries condicionales

```typescript
const { data } = trpc.kermesses.getById.useQuery(
  { id: kerMesseId },
  { enabled: kerMesseId > 0 }  // Solo ejecutar si kerMesseId es válido
);
```

### 2. Invalidar caché después de mutaciones

```typescript
const mutation = trpc.dishes.create.useMutation({
  onSuccess: () => {
    trpc.useUtils().dishes.getForKermesse.invalidate();
  }
});
```

### 3. Usar optimistic updates

```typescript
const mutation = trpc.sales.create.useMutation({
  onMutate: async (newSale) => {
    // Actualizar UI inmediatamente
    await trpc.useUtils().sales.getMySales.cancel();
    const previousSales = trpc.useUtils().sales.getMySales.getData();
    // ...
  },
  onError: (err, newSale, context) => {
    // Revertir cambios si hay error
    trpc.useUtils().sales.getMySales.setData(undefined, context?.previousSales);
  }
});
```

---

**Última actualización:** Noviembre 2025
