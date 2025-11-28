/**
 * Script de Seed para KSol
 * 
 * Este script crea datos de ejemplo en la base de datos para demostración.
 * Ejecutar con: node seed.mjs
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  users,
  kermesses,
  dishes,
  ingredients,
  collaborators,
  sales,
  saleItems,
  deliveries,
  ingredientDonations,
} from './drizzle/schema.js';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://ksol_user:contraseña_segura@localhost:5432/ksol';

// Crear conexión a la base de datos
const client = postgres(DATABASE_URL);
const db = drizzle(client);

// Datos de ejemplo
const exampleUsers = [
  {
    openId: 'user_organizer_1',
    name: 'María García',
    email: 'maria@example.com',
    loginMethod: 'oauth',
    role: 'user',
  },
  {
    openId: 'user_seller_1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    loginMethod: 'oauth',
    role: 'user',
  },
  {
    openId: 'user_seller_2',
    name: 'Rosa López',
    email: 'rosa@example.com',
    loginMethod: 'oauth',
    role: 'user',
  },
  {
    openId: 'user_distributor_1',
    name: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    loginMethod: 'oauth',
    role: 'user',
  },
  {
    openId: 'user_cook_1',
    name: 'Ana Martínez',
    email: 'ana@example.com',
    loginMethod: 'oauth',
    role: 'user',
  },
];

const exampleKermesses = [
  {
    organizerId: 1, // María García
    title: 'Kermesse para la Salud de María',
    description: 'Kermesse benéfica para ayudar con los gastos de operación de corazón de María García. Toda la recaudación será destinada a su tratamiento médico.',
    beneficiaryName: 'María García López',
    beneficiaryReason: 'Operación de corazón - Gastos médicos urgentes',
    contactPhone: '+591 7123456',
    contactEmail: 'maria@example.com',
    eventDate: new Date('2025-12-15T10:00:00'),
    status: 'active',
  },
  {
    organizerId: 1, // María García
    title: 'Kermesse Solidaria - Educación para Juanito',
    description: 'Recaudación de fondos para la educación de Juanito, un niño de 8 años que necesita apoyo para continuar sus estudios.',
    beneficiaryName: 'Juanito Flores',
    beneficiaryReason: 'Educación - Gastos escolares y útiles',
    contactPhone: '+591 7654321',
    contactEmail: 'familia@example.com',
    eventDate: new Date('2025-12-22T11:00:00'),
    status: 'planning',
  },
];

// Platos típicos de Bolivia - Oriente
const dishesOriente = [
  {
    name: 'Salteña',
    description: 'Empanada rellena de carne, papa y salsa picante. Típica del oriente boliviano.',
    category: 'Oriente',
    priceInBs: 1500, // 15 bs
    quantityAvailable: 100,
  },
  {
    name: 'Empanada de Queso',
    description: 'Empanada rellena de queso fresco y cebolla.',
    category: 'Oriente',
    priceInBs: 1200, // 12 bs
    quantityAvailable: 80,
  },
  {
    name: 'Pastel de Choclo',
    description: 'Pastel de maíz tierno con relleno de carne y huevo.',
    category: 'Oriente',
    priceInBs: 2000, // 20 bs
    quantityAvailable: 50,
  },
  {
    name: 'Sopa de Maní',
    description: 'Sopa tradicional de maní con carne y verduras.',
    category: 'Oriente',
    priceInBs: 1800, // 18 bs
    quantityAvailable: 60,
  },
  {
    name: 'Locro',
    description: 'Guiso de maíz, papa y carne.',
    category: 'Oriente',
    priceInBs: 2200, // 22 bs
    quantityAvailable: 40,
  },
];

// Platos típicos de Bolivia - Occidente
const dishesOccidente = [
  {
    name: 'Anticuchos',
    description: 'Brochetas de carne marinada en vinagre y especias.',
    category: 'Occidente',
    priceInBs: 2500, // 25 bs
    quantityAvailable: 70,
  },
  {
    name: 'Huminta',
    description: 'Pastel de maíz tierno envuelto en hojas de choclo.',
    category: 'Occidente',
    priceInBs: 1500, // 15 bs
    quantityAvailable: 90,
  },
  {
    name: 'Caldo de Camarones',
    description: 'Caldo tradicional con camarones y verduras.',
    category: 'Occidente',
    priceInBs: 2800, // 28 bs
    quantityAvailable: 30,
  },
  {
    name: 'Picante de Pollo',
    description: 'Pollo en salsa picante con papas.',
    category: 'Occidente',
    priceInBs: 2500, // 25 bs
    quantityAvailable: 60,
  },
  {
    name: 'Causa Limeña',
    description: 'Puré de papa con relleno de pollo o atún.',
    category: 'Occidente',
    priceInBs: 1800, // 18 bs
    quantityAvailable: 50,
  },
  {
    name: 'Ceviche',
    description: 'Pescado marinado en limón con cebolla y ají.',
    category: 'Occidente',
    priceInBs: 3000, // 30 bs
    quantityAvailable: 25,
  },
];

const exampleIngredients = [
  {
    name: 'Harina de trigo',
    quantity: '10 kg',
    unit: 'kg',
    quantityNeeded: 10,
  },
  {
    name: 'Carne molida',
    quantity: '15 kg',
    unit: 'kg',
    quantityNeeded: 15,
  },
  {
    name: 'Papa',
    quantity: '20 kg',
    unit: 'kg',
    quantityNeeded: 20,
  },
  {
    name: 'Cebolla',
    quantity: '5 kg',
    unit: 'kg',
    quantityNeeded: 5,
  },
  {
    name: 'Ají rojo',
    quantity: '2 kg',
    unit: 'kg',
    quantityNeeded: 2,
  },
  {
    name: 'Queso fresco',
    quantity: '8 kg',
    unit: 'kg',
    quantityNeeded: 8,
  },
  {
    name: 'Huevos',
    quantity: '5 docenas',
    unit: 'docena',
    quantityNeeded: 5,
  },
  {
    name: 'Leche',
    quantity: '10 litros',
    unit: 'litro',
    quantityNeeded: 10,
  },
  {
    name: 'Maní molido',
    quantity: '3 kg',
    unit: 'kg',
    quantityNeeded: 3,
  },
  {
    name: 'Pollo',
    quantity: '12 kg',
    unit: 'kg',
    quantityNeeded: 12,
  },
];

async function seed() {
  console.log('🌱 Iniciando seed de datos...\n');

  try {
    // 1. Limpiar datos existentes (opcional, comentar si quieres preservar datos)
    console.log('🗑️  Limpiando datos existentes...');
    // await db.delete(ingredientDonations);
    // await db.delete(deliveries);
    // await db.delete(saleItems);
    // await db.delete(sales);
    // await db.delete(collaborators);
    // await db.delete(ingredients);
    // await db.delete(dishes);
    // await db.delete(kermesses);
    // await db.delete(users);
    // console.log('✅ Datos limpiados\n');

    // 2. Crear usuarios
    console.log('👥 Creando usuarios...');
    const createdUsers = await db.insert(users).values(exampleUsers).returning();
    console.log(`✅ ${createdUsers.length} usuarios creados\n`);

    // 3. Crear kermesses
    console.log('🎉 Creando kermesses...');
    const createdKermesses = await db
      .insert(kermesses)
      .values(exampleKermesses)
      .returning();
    console.log(`✅ ${createdKermesses.length} kermesses creadas\n`);

    // 4. Crear platos para la primera kermesse
    console.log('🍽️  Creando platos...');
    const allDishes = [...dishesOriente, ...dishesOccidente];
    const dishesWithKermesseId = allDishes.map((dish) => ({
      ...dish,
      kerMesseId: createdKermesses[0].id,
    }));
    const createdDishes = await db
      .insert(dishes)
      .values(dishesWithKermesseId)
      .returning();
    console.log(`✅ ${createdDishes.length} platos creados\n`);

    // 5. Crear ingredientes para la primera kermesse
    console.log('🥘 Creando ingredientes...');
    const ingredientsWithKermesseId = exampleIngredients.map((ingredient) => ({
      ...ingredient,
      kerMesseId: createdKermesses[0].id,
    }));
    const createdIngredients = await db
      .insert(ingredients)
      .values(ingredientsWithKermesseId)
      .returning();
    console.log(`✅ ${createdIngredients.length} ingredientes creados\n`);

    // 6. Crear colaboradores
    console.log('🤝 Creando colaboradores...');
    const collaboratorData = [
      {
        kerMesseId: createdKermesses[0].id,
        userId: createdUsers[1].id, // Juan Pérez - vendedor
        role: 'seller',
      },
      {
        kerMesseId: createdKermesses[0].id,
        userId: createdUsers[2].id, // Rosa López - vendedora
        role: 'seller',
      },
      {
        kerMesseId: createdKermesses[0].id,
        userId: createdUsers[3].id, // Carlos Rodríguez - repartidor
        role: 'distributor',
      },
      {
        kerMesseId: createdKermesses[0].id,
        userId: createdUsers[4].id, // Ana Martínez - cocinera
        role: 'cook',
      },
    ];
    const createdCollaborators = await db
      .insert(collaborators)
      .values(collaboratorData)
      .returning();
    console.log(`✅ ${createdCollaborators.length} colaboradores creados\n`);

    // 7. Crear donaciones de ingredientes
    console.log('🎁 Creando donaciones de ingredientes...');
    const donationData = [
      {
        ingredientId: createdIngredients[0].id, // Harina
        donorName: 'Supermercado Central',
        donorPhone: '+591 7111111',
        quantityDonated: 5,
      },
      {
        ingredientId: createdIngredients[1].id, // Carne
        donorName: 'Carnicería Don José',
        donorPhone: '+591 7222222',
        quantityDonated: 8,
      },
      {
        ingredientId: createdIngredients[5].id, // Queso
        donorName: 'Quesería Familiar',
        donorPhone: '+591 7333333',
        quantityDonated: 4,
      },
    ];
    const createdDonations = await db
      .insert(ingredientDonations)
      .values(donationData)
      .returning();
    console.log(`✅ ${createdDonations.length} donaciones creadas\n`);

    // 8. Crear ventas
    console.log('💰 Creando ventas...');
    const salesData = [
      {
        kerMesseId: createdKermesses[0].id,
        sellerId: createdUsers[1].id, // Juan Pérez
        buyerName: 'Pedro Gómez',
        buyerPhone: '+591 7444444',
        totalAmountInBs: 4500, // 45 bs
        status: 'delivered',
      },
      {
        kerMesseId: createdKermesses[0].id,
        sellerId: createdUsers[2].id, // Rosa López
        buyerName: 'Laura Sánchez',
        buyerPhone: '+591 7555555',
        totalAmountInBs: 6000, // 60 bs
        status: 'delivered',
      },
      {
        kerMesseId: createdKermesses[0].id,
        sellerId: createdUsers[1].id, // Juan Pérez
        buyerName: 'Miguel Torres',
        buyerPhone: '+591 7666666',
        totalAmountInBs: 5500, // 55 bs
        status: 'pending',
      },
      {
        kerMesseId: createdKermesses[0].id,
        sellerId: createdUsers[2].id, // Rosa López
        buyerName: 'Carmen Flores',
        buyerPhone: '+591 7777777',
        totalAmountInBs: 3500, // 35 bs
        status: 'pending',
      },
    ];
    const createdSales = await db
      .insert(sales)
      .values(salesData)
      .returning();
    console.log(`✅ ${createdSales.length} ventas creadas\n`);

    // 9. Crear items de venta
    console.log('🛒 Creando items de venta...');
    const saleItemsData = [
      // Venta 1: Pedro Gómez
      {
        saleId: createdSales[0].id,
        dishId: createdDishes[0].id, // Salteña
        quantity: 2,
        pricePerUnitInBs: 1500,
        subtotalInBs: 3000,
      },
      {
        saleId: createdSales[0].id,
        dishId: createdDishes[1].id, // Empanada de Queso
        quantity: 1,
        pricePerUnitInBs: 1200,
        subtotalInBs: 1200,
      },
      // Venta 2: Laura Sánchez
      {
        saleId: createdSales[1].id,
        dishId: createdDishes[5].id, // Anticuchos
        quantity: 2,
        pricePerUnitInBs: 2500,
        subtotalInBs: 5000,
      },
      {
        saleId: createdSales[1].id,
        dishId: createdDishes[6].id, // Huminta
        quantity: 1,
        pricePerUnitInBs: 1500,
        subtotalInBs: 1000,
      },
      // Venta 3: Miguel Torres
      {
        saleId: createdSales[2].id,
        dishId: createdDishes[2].id, // Pastel de Choclo
        quantity: 2,
        pricePerUnitInBs: 2000,
        subtotalInBs: 4000,
      },
      {
        saleId: createdSales[2].id,
        dishId: createdDishes[3].id, // Sopa de Maní
        quantity: 1,
        pricePerUnitInBs: 1800,
        subtotalInBs: 1800,
      },
      // Venta 4: Carmen Flores
      {
        saleId: createdSales[3].id,
        dishId: createdDishes[6].id, // Huminta
        quantity: 2,
        pricePerUnitInBs: 1500,
        subtotalInBs: 3000,
      },
      {
        saleId: createdSales[3].id,
        dishId: createdDishes[7].id, // Caldo de Camarones
        quantity: 1,
        pricePerUnitInBs: 2800,
        subtotalInBs: 2800,
      },
    ];
    const createdSaleItems = await db
      .insert(saleItems)
      .values(saleItemsData)
      .returning();
    console.log(`✅ ${createdSaleItems.length} items de venta creados\n`);

    // 10. Crear entregas
    console.log('🚚 Creando entregas...');
    const deliveriesData = [
      {
        saleId: createdSales[0].id,
        distributorId: createdUsers[3].id, // Carlos Rodríguez
        status: 'delivered',
        deliveryDate: new Date(),
        notes: 'Entrega completada sin problemas',
      },
      {
        saleId: createdSales[1].id,
        distributorId: createdUsers[3].id, // Carlos Rodríguez
        status: 'delivered',
        deliveryDate: new Date(),
        notes: 'Cliente muy satisfecho',
      },
      {
        saleId: createdSales[2].id,
        distributorId: createdUsers[3].id, // Carlos Rodríguez
        status: 'pending',
        notes: 'Pendiente de entrega',
      },
      {
        saleId: createdSales[3].id,
        distributorId: createdUsers[3].id, // Carlos Rodríguez
        status: 'in_transit',
        notes: 'En camino hacia el cliente',
      },
    ];
    const createdDeliveries = await db
      .insert(deliveries)
      .values(deliveriesData)
      .returning();
    console.log(`✅ ${createdDeliveries.length} entregas creadas\n`);

    // Resumen final
    console.log('═══════════════════════════════════════════');
    console.log('✨ SEED COMPLETADO EXITOSAMENTE ✨');
    console.log('═══════════════════════════════════════════\n');
    console.log('📊 Resumen de datos creados:');
    console.log(`   • Usuarios: ${createdUsers.length}`);
    console.log(`   • Kermesses: ${createdKermesses.length}`);
    console.log(`   • Platos: ${createdDishes.length}`);
    console.log(`   • Ingredientes: ${createdIngredients.length}`);
    console.log(`   • Colaboradores: ${createdCollaborators.length}`);
    console.log(`   • Donaciones: ${createdDonations.length}`);
    console.log(`   • Ventas: ${createdSales.length}`);
    console.log(`   • Items de venta: ${createdSaleItems.length}`);
    console.log(`   • Entregas: ${createdDeliveries.length}`);
    console.log('\n📝 Usuarios de prueba:');
    console.log('   • María García (Organizadora): maria@example.com');
    console.log('   • Juan Pérez (Vendedor): juan@example.com');
    console.log('   • Rosa López (Vendedora): rosa@example.com');
    console.log('   • Carlos Rodríguez (Repartidor): carlos@example.com');
    console.log('   • Ana Martínez (Cocinera): ana@example.com');
    console.log('\n🎉 ¡La base de datos está lista para usar!');
    console.log('═══════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  }
}

// Ejecutar seed
seed();
