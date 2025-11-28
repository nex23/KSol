import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ KERMESSES ============
  kermesses: router({
    // Get all active kermesses (public)
    getActive: publicProcedure.query(async () => {
      return await db.getActiveKermesses();
    }),

    // Get all kermesses (public, for discovery)
    getAll: publicProcedure.query(async () => {
      return await db.getAllKermesses();
    }),

    // Get kermesse by ID (public)
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getKermesseById(input.id);
      }),

    // Get kermesses created by current user (protected)
    getMine: protectedProcedure.query(async ({ ctx }) => {
      return await db.getKermessesByOrganizer(ctx.user.id);
    }),

    // Create new kermesse (protected)
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        beneficiaryName: z.string().min(1),
        beneficiaryReason: z.string().min(1),
        contactPhone: z.string().min(1),
        contactEmail: z.string().email().optional(),
        eventDate: z.date(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createKermesse({
          organizerId: ctx.user.id,
          ...input,
        });
      }),

    // Update kermesse (protected - only organizer)
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        beneficiaryName: z.string().optional(),
        beneficiaryReason: z.string().optional(),
        contactPhone: z.string().optional(),
        contactEmail: z.string().email().optional(),
        eventDate: z.date().optional(),
        status: z.enum(["planning", "active", "completed", "cancelled"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const kermesse = await db.getKermesseById(input.id);
        if (!kermesse || kermesse.organizerId !== ctx.user.id) {
          throw new Error("Not authorized");
        }
        const { id, ...updateData } = input;
        return await db.updateKermesse(id, updateData);
      }),
  }),

  // ============ DISHES ============
  dishes: router({
    // Get dishes for a kermesse (public)
    getForKermesse: publicProcedure
      .input(z.object({ kerMesseId: z.number() }))
      .query(async ({ input }) => {
        return await db.getDishesForKermesse(input.kerMesseId);
      }),

    // Create dish (protected - only kermesse organizer)
    create: protectedProcedure
      .input(z.object({
        kerMesseId: z.number(),
        name: z.string().min(1),
        description: z.string().optional(),
        category: z.string().min(1),
        priceInBs: z.number().positive(),
        quantityAvailable: z.number().positive(),
      }))
      .mutation(async ({ input, ctx }) => {
        const kermesse = await db.getKermesseById(input.kerMesseId);
        if (!kermesse || kermesse.organizerId !== ctx.user.id) {
          throw new Error("Not authorized");
        }
        return await db.createDish(input);
      }),

    // Update dish (protected)
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        priceInBs: z.number().positive().optional(),
        quantityAvailable: z.number().positive().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const dish = await db.getDishById(input.id);
        if (!dish) throw new Error("Dish not found");
        
        const kermesse = await db.getKermesseById(dish.kerMesseId);
        if (!kermesse || kermesse.organizerId !== ctx.user.id) {
          throw new Error("Not authorized");
        }
        
        const { id, ...updateData } = input;
        return await db.updateDish(id, updateData);
      }),

    // Delete dish (protected)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const dish = await db.getDishById(input.id);
        if (!dish) throw new Error("Dish not found");
        
        const kermesse = await db.getKermesseById(dish.kerMesseId);
        if (!kermesse || kermesse.organizerId !== ctx.user.id) {
          throw new Error("Not authorized");
        }
        
        return await db.deleteDish(input.id);
      }),
  }),

  // ============ COLLABORATORS ============
  collaborators: router({
    // Get collaborators for a kermesse (public)
    getForKermesse: publicProcedure
      .input(z.object({ kerMesseId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCollaboratorsForKermesse(input.kerMesseId);
      }),

    // Add collaborator (protected - only organizer)
    add: protectedProcedure
      .input(z.object({
        kerMesseId: z.number(),
        userId: z.number(),
        role: z.enum(["cook", "seller", "distributor"]),
      }))
      .mutation(async ({ input, ctx }) => {
        const kermesse = await db.getKermesseById(input.kerMesseId);
        if (!kermesse || kermesse.organizerId !== ctx.user.id) {
          throw new Error("Not authorized");
        }
        return await db.addCollaborator(input);
      }),

    // Remove collaborator (protected)
    remove: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // TODO: Add authorization check
        return await db.removeCollaborator(input.id);
      }),
  }),

  // ============ INGREDIENTS ============
  ingredients: router({
    // Get ingredients for a kermesse (public)
    getForKermesse: publicProcedure
      .input(z.object({ kerMesseId: z.number() }))
      .query(async ({ input }) => {
        return await db.getIngredientsForKermesse(input.kerMesseId);
      }),

    // Create ingredient (protected - only organizer or cook)
    create: protectedProcedure
      .input(z.object({
        kerMesseId: z.number(),
        name: z.string().min(1),
        quantity: z.string().min(1),
        unit: z.string().min(1),
        quantityNeeded: z.number().positive(),
      }))
      .mutation(async ({ input, ctx }) => {
        const kermesse = await db.getKermesseById(input.kerMesseId);
        if (!kermesse || kermesse.organizerId !== ctx.user.id) {
          throw new Error("Not authorized");
        }
        return await db.createIngredient(input);
      }),

    // Update ingredient (protected)
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        quantity: z.string().optional(),
        unit: z.string().optional(),
        quantityNeeded: z.number().positive().optional(),
        quantityDonated: z.number().optional(),
        isDonated: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const ingredient = await db.getIngredientById(input.id);
        if (!ingredient) throw new Error("Ingredient not found");
        
        const kermesse = await db.getKermesseById(ingredient.kerMesseId);
        if (!kermesse || kermesse.organizerId !== ctx.user.id) {
          throw new Error("Not authorized");
        }
        
        const { id, ...updateData } = input;
        return await db.updateIngredient(id, updateData);
      }),

    // Delete ingredient (protected)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const ingredient = await db.getIngredientById(input.id);
        if (!ingredient) throw new Error("Ingredient not found");
        
        const kermesse = await db.getKermesseById(ingredient.kerMesseId);
        if (!kermesse || kermesse.organizerId !== ctx.user.id) {
          throw new Error("Not authorized");
        }
        
        return await db.deleteIngredient(input.id);
      }),
  }),

  // ============ INGREDIENT DONATIONS ============
  ingredientDonations: router({
    // Get donations for an ingredient (public)
    getForIngredient: publicProcedure
      .input(z.object({ ingredientId: z.number() }))
      .query(async ({ input }) => {
        return await db.getDonationsForIngredient(input.ingredientId);
      }),

    // Create donation (public - anyone can donate)
    create: publicProcedure
      .input(z.object({
        ingredientId: z.number(),
        donorName: z.string().min(1),
        donorEmail: z.string().email().optional(),
        donorPhone: z.string().optional(),
        quantityDonated: z.number().positive(),
      }))
      .mutation(async ({ input }) => {
        const ingredient = await db.getIngredientById(input.ingredientId);
        if (!ingredient) throw new Error("Ingredient not found");
        
        // Create donation
        await db.createIngredientDonation(input);
        
        // Update ingredient with donated quantity
        const newQuantityDonated = ingredient.quantityDonated + input.quantityDonated;
        const isDonated = newQuantityDonated >= ingredient.quantityNeeded;
        
        return await db.updateIngredient(input.ingredientId, {
          quantityDonated: newQuantityDonated,
          isDonated,
        });
      }),
  }),

  // ============ SALES ============
  sales: router({
    // Get sales for a kermesse (protected - only organizer)
    getForKermesse: protectedProcedure
      .input(z.object({ kerMesseId: z.number() }))
      .query(async ({ input, ctx }) => {
        const kermesse = await db.getKermesseById(input.kerMesseId);
        if (!kermesse || kermesse.organizerId !== ctx.user.id) {
          throw new Error("Not authorized");
        }
        return await db.getSalesForKermesse(input.kerMesseId);
      }),

    // Get sales for current user as seller (protected)
    getMySales: protectedProcedure.query(async ({ ctx }) => {
      return await db.getSalesForSeller(ctx.user.id);
    }),

    // Create sale (protected - only sellers)
    create: protectedProcedure
      .input(z.object({
        kerMesseId: z.number(),
        buyerName: z.string().min(1),
        buyerPhone: z.string().optional(),
        items: z.array(z.object({
          dishId: z.number(),
          quantity: z.number().positive(),
          pricePerUnitInBs: z.number().positive(),
        })),
      }))
      .mutation(async ({ input, ctx }) => {
        const kermesse = await db.getKermesseById(input.kerMesseId);
        if (!kermesse) throw new Error("Kermesse not found");

        // Calculate total
        let totalAmountInBs = 0;
        for (const item of input.items) {
          totalAmountInBs += item.quantity * item.pricePerUnitInBs;
        }

        // Create sale
        const saleResult = await db.createSale({
          kerMesseId: input.kerMesseId,
          sellerId: ctx.user.id,
          buyerName: input.buyerName,
          buyerPhone: input.buyerPhone,
          totalAmountInBs,
        });

        // Get the sale ID from the result
        const saleId = (saleResult as any).insertId || (saleResult as any)[0]?.id;

        // Create sale items
        for (const item of input.items) {
          const subtotal = item.quantity * item.pricePerUnitInBs;
          await db.createSaleItem({
            saleId,
            dishId: item.dishId,
            quantity: item.quantity,
            pricePerUnitInBs: item.pricePerUnitInBs,
            subtotalInBs: subtotal,
          });

          // Update dish quantity sold
          const dish = await db.getDishById(item.dishId);
          if (dish) {
            await db.updateDish(item.dishId, {
              quantitySold: dish.quantitySold + item.quantity,
            });
          }
        }

        return { id: saleId, totalAmountInBs };
      }),

    // Update sale status (protected)
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "delivered", "cancelled"]),
      }))
      .mutation(async ({ input, ctx }) => {
        const sale = await db.getSaleById(input.id);
        if (!sale) throw new Error("Sale not found");
        
        const kermesse = await db.getKermesseById(sale.kerMesseId);
        if (!kermesse || (kermesse.organizerId !== ctx.user.id && sale.sellerId !== ctx.user.id)) {
          throw new Error("Not authorized");
        }
        
        return await db.updateSaleStatus(input.id, input.status);
      }),
  }),

  // ============ SALE ITEMS ============
  saleItems: router({
    // Get items for a sale (protected)
    getForSale: protectedProcedure
      .input(z.object({ saleId: z.number() }))
      .query(async ({ input }) => {
        return await db.getSaleItemsForSale(input.saleId);
      }),
  }),

  // ============ DELIVERIES ============
  deliveries: router({
    // Get deliveries for a kermesse (protected - only organizer)
    getForKermesse: protectedProcedure
      .input(z.object({ kerMesseId: z.number() }))
      .query(async ({ input, ctx }) => {
        const kermesse = await db.getKermesseById(input.kerMesseId);
        if (!kermesse || kermesse.organizerId !== ctx.user.id) {
          throw new Error("Not authorized");
        }
        return await db.getDeliveriesForKermesse(input.kerMesseId);
      }),

    // Get deliveries for current user as distributor (protected)
    getMyDeliveries: protectedProcedure.query(async ({ ctx }) => {
      return await db.getDeliveriesForDistributor(ctx.user.id);
    }),

    // Create delivery (protected - only organizer)
    create: protectedProcedure
      .input(z.object({
        saleId: z.number(),
        distributorId: z.number(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const sale = await db.getSaleById(input.saleId);
        if (!sale) throw new Error("Sale not found");
        
        const kermesse = await db.getKermesseById(sale.kerMesseId);
        if (!kermesse || kermesse.organizerId !== ctx.user.id) {
          throw new Error("Not authorized");
        }
        
        return await db.createDelivery(input);
      }),

    // Update delivery status (protected - only distributor or organizer)
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "in_transit", "delivered"]),
      }))
      .mutation(async ({ input, ctx }) => {
        const delivery = await db.getDeliveryById(input.id);
        if (!delivery) throw new Error("Delivery not found");
        
        if (delivery.distributorId !== ctx.user.id) {
          const sale = await db.getSaleById(delivery.saleId);
          if (!sale) throw new Error("Sale not found");
          
          const kermesse = await db.getKermesseById(sale.kerMesseId);
          if (!kermesse || kermesse.organizerId !== ctx.user.id) {
            throw new Error("Not authorized");
          }
        }
        
        return await db.updateDeliveryStatus(input.id, input.status);
      }),
  }),
});

export type AppRouter = typeof appRouter;
