'use server'

import { db } from '@/db'
import { orders, orderItems, products } from '@/db/schema'
import { eq, desc, sql } from 'drizzle-orm'
import { revalidatePath, revalidateTag } from 'next/cache'
import { OrderSchema } from '@/lib/validations'
import { logger } from '@/utils/logger'
import { createSafeAction } from '@/actions/safe-action'
import { z } from 'zod'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Generates a unique order number in the format: AMR-YYMMDD-XXXX
 */
function generateOrderNumber(): string {
    const now = new Date()
    const yy = String(now.getFullYear()).slice(-2)
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')
    return `AMR-${yy}${mm}${dd}-${seq}`
}

/**
 * Creates a new order and returns the order details for WhatsApp redirect.
 */
export const createOrder = createSafeAction(
    'createOrder',
    OrderSchema,
    async (validated) => {
        const orderNumber = generateOrderNumber();
        const totalRounded = Math.round(validated.totalAmount);
        const dpAmount = validated.paymentMethod === 'dp' ? Math.round(totalRounded * 0.5) : 0;

        const [newOrder] = await db.insert(orders).values({
            orderNumber,
            customerName: validated.customerName,
            customerPhone: validated.customerPhone,
            customerAddress: validated.customerAddress,
            deliveryType: validated.deliveryType,
            totalAmount: totalRounded,
            paymentMethod: validated.paymentMethod,
            dpAmount,
            paidAmount: 0,
            status: 'pending',
        }).returning();

        if (validated.items.length > 0) {
            await insertOrderItems(newOrder.id, validated.items);
        }

        revalidateTag('orders', 'default');
        revalidatePath('/admin/orders');
        
        return { 
            id: newOrder.id, 
            orderNumber: newOrder.orderNumber,
            totalAmount: newOrder.totalAmount
        };
    },
    { requireAdmin: false }
);

/**
 * Validates and inserts order items for a specific order.
 */
async function insertOrderItems(orderId: string, items: any[]) {
    const itemsToInsert = items.map(item => {
        const isValidUuid = item.productId && UUID_REGEX.test(item.productId)
        
        if (item.productId && !isValidUuid) {
            console.warn(`Warning: Invalid productId "${item.productId}" detected.`)
        }

        return {
            orderId,
            itemType: item.itemType,
            productId: isValidUuid ? item.productId : null,
            customDetails: item.customDetails || null,
            quantity: item.quantity,
            subtotal: Math.round(item.subtotal),
        }
    })

    await db.insert(orderItems).values(itemsToInsert)
}

/**
 * Get all orders for the admin dashboard.
 */
export const getOrders = createSafeAction(
    'getOrders',
    z.any(),
    async () => {
        return await db.query.orders.findMany({
            with: {
                items: {
                    with: {
                        product: true
                    }
                }
            },
            orderBy: [desc(orders.createdAt)],
        });
    }
);

/**
 * Get a single order by its ID.
 */
export const getOrderById = createSafeAction(
    'getOrderById',
    z.string().uuid(),
    async (orderId) => {
        const order = await db.query.orders.findFirst({
            where: eq(orders.id, orderId),
        });
        if (!order) return null;

        const items = await db.query.orderItems.findMany({
            where: eq(orderItems.orderId, orderId),
        });

        return { ...order, items };
    }
);

/**
 * Get a single order by its order number.
 */
export const getOrderByNumber = createSafeAction(
    'getOrderByNumber',
    z.string(),
    async (orderNumber) => {
        const order = await db.query.orders.findFirst({
            where: eq(orders.orderNumber, orderNumber),
        });
        if (!order) return null;

        const items = await db.query.orderItems.findMany({
            where: eq(orderItems.orderId, order.id),
        });

        return { ...order, items };
    },
    { requireAdmin: false }
);

/**
 * Update order status and sync stock if necessary (Admin action).
 */
export const updateOrderStatus = createSafeAction(
    'updateOrderStatus',
    z.object({
        orderId: z.string().uuid(),
        status: z.string(),
        adminNotes: z.string().optional(),
    }),
    async ({ orderId, status, adminNotes }) => {
        const order = await db.query.orders.findFirst({
            where: eq(orders.id, orderId),
        });

        if (!order) {
            throw new Error('Pesanan tidak ditemukan.');
        }

        const updateData = calculateStatusUpdate(order, status, adminNotes);
        
        // Sync stock based on status transitions
        await syncStockOnStatusChange(orderId, order.status, status);

        await db.update(orders).set(updateData).where(eq(orders.id, orderId));

        revalidateTag('orders', 'default');
        revalidatePath('/admin/orders');
        
        return { id: orderId, status };
    }
);

/**
 * Calculates updated fields based on status change.
 */
function calculateStatusUpdate(order: any, nextStatus: string, adminNotes?: string) {
    const updateData: Record<string, unknown> = {
        status: nextStatus,
        updatedAt: new Date(),
    }

    if (nextStatus === 'dp_paid') {
        updateData.paidAmount = order.dpAmount
        updateData.verifiedAt = new Date()
    } else if (nextStatus === 'paid') {
        updateData.paidAmount = order.totalAmount
        updateData.verifiedAt = new Date()
    }

    if (adminNotes !== undefined) {
        updateData.adminNotes = adminNotes
    }

    return updateData
}

/**
 * Handles stock synchronization when order status changes.
 */
async function syncStockOnStatusChange(orderId: string, currentStatus: string, nextStatus: string) {
    const isActiveStatus = ['paid', 'dp_paid', 'processing', 'completed'].includes(nextStatus)
    const wasPending = currentStatus === 'pending'
    
    // 1. From Pending to any Active state -> Decrease stock
    if (isActiveStatus && wasPending) {
        await syncProductStock(orderId, 'decrease')
    }

    // 2. Cancelled from a confirmed/active state -> Restore stock
    const isActiveState = ['dp_paid', 'paid', 'processing', 'completed'].includes(currentStatus)
    if (nextStatus === 'cancelled' && isActiveState) {
        await syncProductStock(orderId, 'increase')
    }
}

/**
 * Helper to increase or decrease product stock and update sold count.
 */
async function syncProductStock(orderId: string, mode: 'increase' | 'decrease') {
    const items = await db.query.orderItems.findMany({
        where: eq(orderItems.orderId, orderId),
    })

    for (const item of items) {
        if (!item.productId) continue

        const adjustment = mode === 'increase' ? item.quantity : -item.quantity
        const soldAdjustment = mode === 'increase' ? -item.quantity : item.quantity

        await db.update(products)
            .set({
                stock: sql`${products.stock} + ${adjustment}`,
                soldCount: sql`${products.soldCount} + ${soldAdjustment}`,
            })
            .where(eq(products.id, item.productId))
    }

    // Clear relevant caches
    revalidateTag('products', 'default')
    revalidatePath('/express')
    revalidatePath('/')
    revalidatePath('/admin/products')
}
