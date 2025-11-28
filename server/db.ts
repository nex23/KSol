import { eq, and, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  kermesses,
  dishes,
  collaborators,
  ingredients,
  ingredientDonations,
  sales,
  saleItems,
  deliveries
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ KERMESSES ============

export async function createKermesse(data: {
  organizerId: number;
  title: string;
  description?: string;
  beneficiaryName: string;
  beneficiaryReason: string;
  contactPhone: string;
  contactEmail?: string;
  eventDate: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(kermesses).values({
    organizerId: data.organizerId,
    title: data.title,
    description: data.description || null,
    beneficiaryName: data.beneficiaryName,
    beneficiaryReason: data.beneficiaryReason,
    contactPhone: data.contactPhone,
    contactEmail: data.contactEmail || null,
    eventDate: data.eventDate,
    status: "planning",
  });

  return result;
}

export async function getKermesseById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(kermesses).where(eq(kermesses.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getActiveKermesses() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(kermesses)
    .where(eq(kermesses.status, "active"))
    .orderBy(desc(kermesses.eventDate));
}

export async function getAllKermesses() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(kermesses)
    .orderBy(desc(kermesses.createdAt));
}

export async function getKermessesByOrganizer(organizerId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(kermesses)
    .where(eq(kermesses.organizerId, organizerId))
    .orderBy(desc(kermesses.createdAt));
}

export async function updateKermesse(id: number, data: Partial<{
  title: string;
  description: string;
  beneficiaryName: string;
  beneficiaryReason: string;
  contactPhone: string;
  contactEmail: string;
  eventDate: Date;
  status: "planning" | "active" | "completed" | "cancelled";
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(kermesses).set(data).where(eq(kermesses.id, id));
}

// ============ DISHES ============

export async function createDish(data: {
  kerMesseId: number;
  name: string;
  description?: string;
  category: string;
  priceInBs: number;
  quantityAvailable: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(dishes).values({
    kerMesseId: data.kerMesseId,
    name: data.name,
    description: data.description || null,
    category: data.category,
    priceInBs: data.priceInBs,
    quantityAvailable: data.quantityAvailable,
    quantitySold: 0,
  });
}

export async function getDishesForKermesse(kerMesseId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(dishes)
    .where(eq(dishes.kerMesseId, kerMesseId))
    .orderBy(asc(dishes.category), asc(dishes.name));
}

export async function getDishById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(dishes).where(eq(dishes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateDish(id: number, data: Partial<{
  name: string;
  description: string;
  category: string;
  priceInBs: number;
  quantityAvailable: number;
  quantitySold: number;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(dishes).set(data).where(eq(dishes.id, id));
}

export async function deleteDish(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(dishes).where(eq(dishes.id, id));
}

// ============ COLLABORATORS ============

export async function addCollaborator(data: {
  kerMesseId: number;
  userId: number;
  role: "cook" | "seller" | "distributor";
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(collaborators).values(data);
}

export async function getCollaboratorsForKermesse(kerMesseId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(collaborators)
    .where(eq(collaborators.kerMesseId, kerMesseId))
    .orderBy(asc(collaborators.role));
}

export async function removeCollaborator(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(collaborators).where(eq(collaborators.id, id));
}

// ============ INGREDIENTS ============

export async function createIngredient(data: {
  kerMesseId: number;
  name: string;
  quantity: string;
  unit: string;
  quantityNeeded: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(ingredients).values({
    kerMesseId: data.kerMesseId,
    name: data.name,
    quantity: data.quantity,
    unit: data.unit,
    quantityNeeded: data.quantityNeeded,
    quantityDonated: 0,
    isDonated: false,
  });
}

export async function getIngredientsForKermesse(kerMesseId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(ingredients)
    .where(eq(ingredients.kerMesseId, kerMesseId))
    .orderBy(asc(ingredients.name));
}

export async function getIngredientById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(ingredients).where(eq(ingredients.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateIngredient(id: number, data: Partial<{
  name: string;
  quantity: string;
  unit: string;
  quantityNeeded: number;
  quantityDonated: number;
  isDonated: boolean;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(ingredients).set(data).where(eq(ingredients.id, id));
}

export async function deleteIngredient(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(ingredients).where(eq(ingredients.id, id));
}

// ============ INGREDIENT DONATIONS ============

export async function createIngredientDonation(data: {
  ingredientId: number;
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  quantityDonated: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(ingredientDonations).values({
    ingredientId: data.ingredientId,
    donorName: data.donorName,
    donorEmail: data.donorEmail || null,
    donorPhone: data.donorPhone || null,
    quantityDonated: data.quantityDonated,
  });
}

export async function getDonationsForIngredient(ingredientId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(ingredientDonations)
    .where(eq(ingredientDonations.ingredientId, ingredientId))
    .orderBy(desc(ingredientDonations.donatedAt));
}

// ============ SALES ============

export async function createSale(data: {
  kerMesseId: number;
  sellerId: number;
  buyerName: string;
  buyerPhone?: string;
  totalAmountInBs: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(sales).values({
    kerMesseId: data.kerMesseId,
    sellerId: data.sellerId,
    buyerName: data.buyerName,
    buyerPhone: data.buyerPhone || null,
    totalAmountInBs: data.totalAmountInBs,
    status: "pending",
  });
}

export async function getSalesForKermesse(kerMesseId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(sales)
    .where(eq(sales.kerMesseId, kerMesseId))
    .orderBy(desc(sales.saleDate));
}

export async function getSalesForSeller(sellerId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(sales)
    .where(eq(sales.sellerId, sellerId))
    .orderBy(desc(sales.saleDate));
}

export async function getSaleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(sales).where(eq(sales.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateSaleStatus(id: number, status: "pending" | "delivered" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(sales).set({ status }).where(eq(sales.id, id));
}

// ============ SALE ITEMS ============

export async function createSaleItem(data: {
  saleId: number;
  dishId: number;
  quantity: number;
  pricePerUnitInBs: number;
  subtotalInBs: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(saleItems).values(data);
}

export async function getSaleItemsForSale(saleId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(saleItems)
    .where(eq(saleItems.saleId, saleId));
}

// ============ DELIVERIES ============

export async function createDelivery(data: {
  saleId: number;
  distributorId: number;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(deliveries).values({
    saleId: data.saleId,
    distributorId: data.distributorId,
    notes: data.notes || null,
    status: "pending",
  });
}

export async function getDeliveriesForKermesse(kerMesseId: number) {
  const db = await getDb();
  if (!db) return [];

  // This requires a join with sales table
  return await db
    .select()
    .from(deliveries)
    .innerJoin(sales, eq(deliveries.saleId, sales.id))
    .where(eq(sales.kerMesseId, kerMesseId))
    .orderBy(desc(deliveries.createdAt));
}

export async function getDeliveriesForDistributor(distributorId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(deliveries)
    .where(eq(deliveries.distributorId, distributorId))
    .orderBy(desc(deliveries.createdAt));
}

export async function updateDeliveryStatus(id: number, status: "pending" | "in_transit" | "delivered") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(deliveries).set({ status }).where(eq(deliveries.id, id));
}

export async function getDeliveryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(deliveries).where(eq(deliveries.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
