import {
  int,
  varchar,
  text,
  timestamp,
  mysqlEnum,
  mysqlTable,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Kermesses table
export const kermesses = mysqlTable("kermesses", {
  id: int("id").autoincrement().primaryKey(),
  organizerId: int("organizerId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  beneficiaryName: varchar("beneficiaryName", { length: 255 }).notNull(),
  beneficiaryReason: text("beneficiaryReason").notNull(),
  contactPhone: varchar("contactPhone", { length: 20 }).notNull(),
  contactEmail: varchar("contactEmail", { length: 320 }),
  eventDate: timestamp("eventDate").notNull(),
  status: mysqlEnum("status", ["planning", "active", "completed", "cancelled"])
    .default("planning")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Kermesse = typeof kermesses.$inferSelect;
export type InsertKermesse = typeof kermesses.$inferInsert;

// Dishes table
export const dishes = mysqlTable("dishes", {
  id: int("id").autoincrement().primaryKey(),
  kerMesseId: int("kerMesseId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(), // Oriente, Occidente
  priceInBs: int("priceInBs").notNull(), // Price in centavos
  quantityAvailable: int("quantityAvailable").notNull(),
  quantitySold: int("quantitySold").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Dish = typeof dishes.$inferSelect;
export type InsertDish = typeof dishes.$inferInsert;

// Images/Gallery table
export const dishImages = mysqlTable("dishImages", {
  id: int("id").autoincrement().primaryKey(),
  dishId: int("dishId").notNull(),
  imageUrl: text("imageUrl").notNull(),
  imageKey: varchar("imageKey", { length: 255 }).notNull(), // S3 key
  uploadedBy: int("uploadedBy").notNull(),
  caption: text("caption"),
  isMainImage: int("isMainImage").default(0).notNull(), // 0 or 1 for boolean
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DishImage = typeof dishImages.$inferSelect;
export type InsertDishImage = typeof dishImages.$inferInsert;

// Ingredients table
export const ingredients = mysqlTable("ingredients", {
  id: int("id").autoincrement().primaryKey(),
  kerMesseId: int("kerMesseId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  quantity: varchar("quantity", { length: 50 }).notNull(),
  unit: varchar("unit", { length: 50 }).notNull(),
  quantityNeeded: int("quantityNeeded").notNull(),
  quantityDonated: int("quantityDonated").default(0).notNull(),
  isDonated: int("isDonated").default(0).notNull(), // 0 or 1 for boolean
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Ingredient = typeof ingredients.$inferSelect;
export type InsertIngredient = typeof ingredients.$inferInsert;

// Ingredient Donations table
export const ingredientDonations = mysqlTable("ingredientDonations", {
  id: int("id").autoincrement().primaryKey(),
  ingredientId: int("ingredientId").notNull(),
  donorName: varchar("donorName", { length: 255 }).notNull(),
  donorEmail: varchar("donorEmail", { length: 320 }),
  donorPhone: varchar("donorPhone", { length: 20 }),
  quantityDonated: int("quantityDonated").notNull(),
  donatedAt: timestamp("donatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type IngredientDonation = typeof ingredientDonations.$inferSelect;
export type InsertIngredientDonation =
  typeof ingredientDonations.$inferInsert;

// Collaborators table
export const collaborators = mysqlTable("collaborators", {
  id: int("id").autoincrement().primaryKey(),
  kerMesseId: int("kerMesseId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["cook", "seller", "distributor"])
    .notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Collaborator = typeof collaborators.$inferSelect;
export type InsertCollaborator = typeof collaborators.$inferInsert;

// Sales table
export const sales = mysqlTable("sales", {
  id: int("id").autoincrement().primaryKey(),
  kerMesseId: int("kerMesseId").notNull(),
  sellerId: int("sellerId").notNull(),
  buyerName: varchar("buyerName", { length: 255 }).notNull(),
  buyerPhone: varchar("buyerPhone", { length: 20 }),
  totalAmountInBs: int("totalAmountInBs").notNull(),
  status: mysqlEnum("status", ["pending", "delivered", "cancelled"])
    .default("pending")
    .notNull(),
  saleDate: timestamp("saleDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Sale = typeof sales.$inferSelect;
export type InsertSale = typeof sales.$inferInsert;

// Sale Items table
export const saleItems = mysqlTable("saleItems", {
  id: int("id").autoincrement().primaryKey(),
  saleId: int("saleId").notNull(),
  dishId: int("dishId").notNull(),
  quantity: int("quantity").notNull(),
  pricePerUnitInBs: int("pricePerUnitInBs").notNull(),
  subtotalInBs: int("subtotalInBs").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SaleItem = typeof saleItems.$inferSelect;
export type InsertSaleItem = typeof saleItems.$inferInsert;

// Deliveries table
export const deliveries = mysqlTable("deliveries", {
  id: int("id").autoincrement().primaryKey(),
  saleId: int("saleId").notNull(),
  distributorId: int("distributorId").notNull(),
  deliveryDate: timestamp("deliveryDate"),
  status: mysqlEnum("status", ["pending", "in_transit", "delivered"])
    .default("pending")
    .notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Delivery = typeof deliveries.$inferSelect;
export type InsertDelivery = typeof deliveries.$inferInsert;
