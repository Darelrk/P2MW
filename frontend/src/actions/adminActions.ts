'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { products, builderOptions } from '@/db/schema'
import { createClient } from '@/utils/supabase/server'

async function ensureAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized: Admin access required')
    }
}

// ==========================================
// PRODUCTS (EXPRESS CATALOG)
// ==========================================

export async function createProduct(formData: FormData) {
    try {
        await ensureAdmin()
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const priceAffordable = parseInt(formData.get('priceAffordable') as string) || 0
        const priceStandard = parseInt(formData.get('priceStandard') as string) || 0
        const pricePremium = parseInt(formData.get('pricePremium') as string) || 0
        const priceSpecial = parseInt(formData.get('priceSpecial') as string) || 0
        const mainTier = formData.get('mainTier') as string
        const allowAffordable = mainTier === 'affordable'
        const allowStandard = mainTier === 'standard'
        const allowPremium = mainTier === 'premium'
        const allowSpecial = formData.get('allowSpecial') === 'true'

        const stock = parseInt(formData.get('stock') as string) || 0
        const imageUrl = formData.get('imageUrl') as string
        const status = formData.get('status') === 'true'

        await db.insert(products).values({
            name,
            description,
            priceAffordable,
            priceStandard,
            pricePremium,
            priceSpecial,
            allowAffordable,
            allowStandard,
            allowPremium,
            allowSpecial,
            stock,
            imageUrl: imageUrl || null,
            status: status !== undefined ? status : true,
        })

        revalidatePath('/express')
        revalidatePath('/admin/products')
        return { success: true }
    } catch (error) {
        console.error('[Action Error] Failed to create product:', error)
        throw new Error(error instanceof Error ? error.message : 'Gagal membuat produk')
    }
}

export async function updateProduct(id: string, formData: FormData) {
    try {
        await ensureAdmin()
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const priceAffordable = parseInt(formData.get('priceAffordable') as string) || 0
        const priceStandard = parseInt(formData.get('priceStandard') as string) || 0
        const pricePremium = parseInt(formData.get('pricePremium') as string) || 0
        const priceSpecial = parseInt(formData.get('priceSpecial') as string) || 0
        const mainTier = formData.get('mainTier') as string
        const allowAffordable = mainTier === 'affordable'
        const allowStandard = mainTier === 'standard'
        const allowPremium = mainTier === 'premium'
        const allowSpecial = formData.get('allowSpecial') === 'true'

        const stock = parseInt(formData.get('stock') as string) || 0
        const imageUrl = formData.get('imageUrl') as string
        const status = formData.get('status') === 'true'

        await db.update(products).set({
            name,
            description,
            priceAffordable,
            priceStandard,
            pricePremium,
            priceSpecial,
            allowAffordable,
            allowStandard,
            allowPremium,
            allowSpecial,
            stock,
            imageUrl: imageUrl || null,
            status,
        }).where(eq(products.id, id))

        revalidatePath('/express')
        revalidatePath('/admin/products')
        return { success: true }
    } catch (error) {
        console.error('[Action Error] Failed to update product:', error)
        throw new Error(error instanceof Error ? error.message : 'Gagal memperbarui produk')
    }
}

export async function deleteProduct(id: string) {
    try {
        await ensureAdmin()
        await db.delete(products).where(eq(products.id, id))

        revalidatePath('/express')
        revalidatePath('/admin/products')
        return { success: true }
    } catch (error) {
        console.error('[Action Error] Failed to delete product:', error)
        throw new Error(error instanceof Error ? error.message : 'Gagal menghapus produk')
    }
}

// ==========================================
// BUILDER OPTIONS (CUSTOM PATH)
// ==========================================

export async function createBuilderOption(formData: FormData) {
    try {
        await ensureAdmin()
        const name = formData.get('name') as string
        const category = formData.get('category') as string
        const priceAdjustment = parseInt(formData.get('priceAdjustment') as string)
        const imageUrl = formData.get('imageUrl') as string
        const isAvailable = formData.get('isAvailable') !== 'false' // defaults to true unless 'false'

        await db.insert(builderOptions).values({
            name,
            category,
            priceAdjustment: isNaN(priceAdjustment) ? 0 : priceAdjustment,
            imageUrl: imageUrl || null,
            isAvailable,
        })

        revalidatePath('/custom')
        revalidatePath('/admin/builder')
        return { success: true }
    } catch (error) {
        console.error('[Action Error] Failed to create builder option:', error)
        throw new Error(error instanceof Error ? error.message : 'Gagal membuat opsi rakitan')
    }
}

export async function updateBuilderOption(id: string, formData: FormData) {
    try {
        await ensureAdmin()
        const name = formData.get('name') as string
        const category = formData.get('category') as string
        const priceAdjustment = parseInt(formData.get('priceAdjustment') as string)
        const imageUrl = formData.get('imageUrl') as string
        const isAvailable = formData.get('isAvailable') === 'true'

        await db.update(builderOptions).set({
            name,
            category,
            priceAdjustment: isNaN(priceAdjustment) ? 0 : priceAdjustment,
            imageUrl: imageUrl || null,
            isAvailable,
        }).where(eq(builderOptions.id, id))

        revalidatePath('/custom')
        revalidatePath('/admin/builder')
        return { success: true }
    } catch (error) {
        console.error('[Action Error] Failed to update builder option:', error)
        throw new Error(error instanceof Error ? error.message : 'Gagal memperbarui opsi rakitan')
    }
}

export async function deleteBuilderOption(id: string) {
    try {
        await ensureAdmin()
        await db.delete(builderOptions).where(eq(builderOptions.id, id))

        revalidatePath('/custom')
        revalidatePath('/admin/builder')
        return { success: true }
    } catch (error) {
        console.error('[Action Error] Failed to delete builder option:', error)
        throw new Error(error instanceof Error ? error.message : 'Gagal menghapus opsi rakitan')
    }
}
