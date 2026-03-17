'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { eq, sql } from 'drizzle-orm'
import { db } from '@/db'
import { products, builderOptions, orders } from '@/db/schema'
import { createClient } from '@/utils/supabase/server'
import { logger } from '@/utils/logger'
import { AuthError, AppError } from '@/lib/errors'

import { ProductSchema, BuilderOptionSchema } from '@/lib/validations'

async function ensureAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new AuthError('Anda harus login sebagai admin')
    }
}

// ==========================================
// PRODUCTS (EXPRESS CATALOG)
// ==========================================

export async function createProduct(formData: FormData) {
    const ACTION = 'createProduct'
    try {
        await ensureAdmin()
        
        const rawData = Object.fromEntries(formData.entries())
        const validated = ProductSchema.parse(rawData)

        const mainTier = formData.get('mainTier') as string
        const allowAffordable = mainTier === 'affordable'
        const allowStandard = mainTier === 'standard'
        const allowPremium = mainTier === 'premium'
        const allowSpecial = formData.get('allowSpecial') === 'true'

        await db.insert(products).values({
            ...validated,
            allowAffordable,
            allowStandard,
            allowPremium,
            allowSpecial,
            isDeleted: false,
        })

        logger.info(ACTION, 'Product created successfully', { name: validated.name })
        revalidateTag('products', 'default')
        revalidateTag('dashboard-stats', 'default')
        revalidatePath('/express')
        revalidatePath('/admin/products')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        logger.error(ACTION, 'Failed to create product', error)
        throw error // Controller/UI should handle this
    }
}

export async function updateProduct(id: string, formData: FormData) {
    const ACTION = 'updateProduct'
    try {
        await ensureAdmin()
        
        const rawData = Object.fromEntries(formData.entries())
        const validated = ProductSchema.parse(rawData)

        const mainTier = formData.get('mainTier') as string
        const allowAffordable = mainTier === 'affordable'
        const allowStandard = mainTier === 'standard'
        const allowPremium = mainTier === 'premium'
        const allowSpecial = formData.get('allowSpecial') === 'true'

        await db.update(products).set({
            ...validated,
            allowAffordable,
            allowStandard,
            allowPremium,
            allowSpecial,
        }).where(eq(products.id, id))

        logger.info(ACTION, 'Product updated successfully', { id, name: validated.name })
        revalidateTag('products', 'default')
        revalidateTag('dashboard-stats', 'default')
        revalidatePath('/express')
        revalidatePath('/admin/products')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        logger.error(ACTION, 'Failed to update product', error, { id })
        throw error
    }
}

export async function deleteProduct(id: string) {
    const ACTION = 'deleteProduct'
    try {
        await ensureAdmin()
        await db.update(products).set({ isDeleted: true }).where(eq(products.id, id))

        logger.info(ACTION, 'Product marked as deleted', { id })
        revalidateTag('products', 'default')
        revalidateTag('dashboard-stats', 'default')
        revalidatePath('/express')
        revalidatePath('/admin/products')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        logger.error(ACTION, 'Failed to delete product', error, { id })
        throw error
    }
}

// ==========================================
// BUILDER OPTIONS (CUSTOM PATH)
// ==========================================

export async function createBuilderOption(formData: FormData) {
    const ACTION = 'createBuilderOption'
    try {
        await ensureAdmin()
        
        const rawData = Object.fromEntries(formData.entries())
        const validated = BuilderOptionSchema.parse(rawData)

        await db.insert(builderOptions).values({
            ...validated,
            isDeleted: false,
        })

        logger.info(ACTION, 'Builder option created', { name: validated.name })
        revalidateTag('builder-options', 'default')
        revalidateTag('dashboard-stats', 'default')
        revalidatePath('/custom')
        revalidatePath('/admin/builder')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        logger.error(ACTION, 'Failed to create builder option', error)
        throw error
    }
}

export async function updateBuilderOption(id: string, formData: FormData) {
    const ACTION = 'updateBuilderOption'
    try {
        await ensureAdmin()

        const rawData = Object.fromEntries(formData.entries())
        const validated = BuilderOptionSchema.parse(rawData)

        await db.update(builderOptions).set({
            ...validated,
        }).where(eq(builderOptions.id, id))

        logger.info(ACTION, 'Builder option updated', { id, name: validated.name })
        revalidateTag('builder-options', 'default')
        revalidateTag('dashboard-stats', 'default')
        revalidatePath('/custom')
        revalidatePath('/admin/builder')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        logger.error(ACTION, 'Failed to update builder option', error, { id })
        throw error
    }
}

export async function deleteBuilderOption(id: string) {
    const ACTION = 'deleteBuilderOption'
    try {
        await ensureAdmin()
        await db.update(builderOptions).set({ isDeleted: true }).where(eq(builderOptions.id, id))

        logger.info(ACTION, 'Builder option marked as deleted', { id })
        revalidateTag('builder-options', 'default')
        revalidateTag('dashboard-stats', 'default')
        revalidatePath('/custom')
        revalidatePath('/admin/builder')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        logger.error(ACTION, 'Failed to delete builder option', error, { id })
        throw error
    }
}
