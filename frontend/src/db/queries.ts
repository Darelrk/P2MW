import { db } from '@/db'
import { products, builderOptions } from '@/db/schema'
import { eq, desc, and, ne } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'

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
export async function getActiveProducts() {
    return await db.query.products.findMany({
        where: eq(products.isDeleted, false),
        orderBy: [desc(products.id)],
    })
}

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
 * Get active builder options by category.
 */
export async function getBuilderOptions(category?: string) {
    if (category) {
        return await db.query.builderOptions.findMany({
            where: and(
                eq(builderOptions.isDeleted, false),
                eq(builderOptions.category, category)
            ),
            orderBy: [desc(builderOptions.name)],
        })
    }
    return await db.query.builderOptions.findMany({
        where: eq(builderOptions.isDeleted, false),
        orderBy: [desc(builderOptions.name)],
    })
}
