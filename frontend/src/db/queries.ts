import { db } from '@/db'
import { products, builderOptions, orders, orderItems } from '@/db/schema'
import { eq, desc, and, sql } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'
import { experimental_taintObjectReference as taintObjectReference } from 'react'
import 'server-only'

/**
 * Get top selling products for home page.
 * Cached for 1 hour.
 */
export const getTopSellingProducts = unstable_cache(
    async (limit = 3) => {
        return await db.query.products.findMany({
            where: and(
                eq(products.status, true),
                eq(products.isDeleted, false)
            ),
            orderBy: [desc(products.soldCount)],
            limit: limit,
        })
    },
    ['top-selling-products'],
    { revalidate: 3600, tags: ['products'] }
)

/**
 * Get all active products.
 */
export const getActiveProducts = unstable_cache(
    async () => {
        return await db.query.products.findMany({
            where: eq(products.isDeleted, false),
            orderBy: [desc(products.id)],
        })
    },
    ['active-products'],
    { revalidate: 3600, tags: ['products'] }
)

/**
 * Get deleted products (history).
 */
export async function getDeletedProducts() {
    return await db.query.products.findMany({
        where: eq(products.isDeleted, true),
        orderBy: [desc(products.id)],
    })
}

/**
 * Get active builder options.
 */
export const getBuilderOptions = unstable_cache(
    async (category?: string) => {
        const whereClause = category 
            ? and(eq(builderOptions.isDeleted, false), eq(builderOptions.category, category))
            : eq(builderOptions.isDeleted, false);

        return await db.query.builderOptions.findMany({
            where: whereClause,
            orderBy: [desc(builderOptions.name)],
        })
    },
    ['builder-options'],
    { revalidate: 3600, tags: ['builder-options'] }
)

/**
 * Get dashboard stats for admin.
 * Performed using SQL aggregations for maximum efficiency.
 */
export const getDashboardStats = unstable_cache(
    async () => {
        try {
            // Parallel execution of aggregation queries
            const [orderStats, productCount, optionCount] = await Promise.all([
                db.select({
                    totalOrders: sql<number>`count(*)`,
                    revenue: sql<number>`sum(case when status in ('paid', 'completed', 'shipped', 'dp_paid') then paid_amount else 0 end)`,
                    pendingOrders: sql<number>`count(*) filter (where status in ('pending', 'dp_paid'))`
                }).from(orders),
                
                db.select({ count: sql<number>`count(*)` })
                    .from(products)
                    .where(eq(products.isDeleted, false)),
                
                db.select({ count: sql<number>`count(*)` })
                    .from(builderOptions)
                    .where(eq(builderOptions.isDeleted, false))
            ]);

            return {
                totalOrders: Number(orderStats[0].totalOrders) || 0,
                revenue: Number(orderStats[0].revenue) || 0,
                pendingOrders: Number(orderStats[0].pendingOrders) || 0,
                totalProducts: Number(productCount[0].count) || 0,
                totalOptions: Number(optionCount[0].count) || 0
            };
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
            return { totalOrders: 0, revenue: 0, pendingOrders: 0, totalProducts: 0, totalOptions: 0 };
        }
    },
    ['dashboard-stats'],
    { revalidate: 600, tags: ['orders', 'products', 'builder-options'] }
)

/**
 * Get all products for admin management (including deleted/inactive).
 */
export async function getAllProductsAdmin() {
    return await db.query.products.findMany({
        orderBy: [desc(products.createdAt)],
    });
}

/**
 * Get all builder options for admin management.
 */
export async function getAllBuilderOptionsAdmin() {
    return await db.query.builderOptions.findMany({
        orderBy: [desc(builderOptions.createdAt)],
    });
}

/**
 * Get 5 most recent orders for dashboard.
 */
export async function getRecentOrders(limit = 5) {
    try {
        const results = await db.query.orders.findMany({
            columns: {
                id: true,
                orderNumber: true,
                customerName: true,
                totalAmount: true,
                status: true,
                createdAt: true,
                // Exclude customerPhone and customerAddress for dashboard view
            },
            with: {
                items: {
                    with: {
                        product: {
                            columns: {
                                id: true,
                                name: true,
                                imageUrl: true,
                            }
                        }
                    }
                }
            },
            orderBy: [desc(orders.createdAt)],
            limit
        });

        // Taint sensitive fields if they were retrieved (though we excluded them above)
        // This is a safety measure in case a column selection is missed later
        results.forEach((order: any) => {
            // @ts-ignore - taintObjectReference is experimental
            taintObjectReference('Sensitive Order PII leaked to client', order);
        });

        return results;
    } catch (error) {
        console.error('Failed to fetch recent orders:', error);
        return [];
    }
}
