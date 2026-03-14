'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { products, builderOptions } from '@/db/schema'
import { createClient } from '@/utils/supabase/server'

import { ProductSchema, BuilderOptionSchema } from '@/lib/validations'

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
        
        // Convert FormData to entries object for Zod
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

        revalidatePath('/express')
        revalidatePath('/admin/products')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('[Action Error] Failed to create product:', error)
        const message = error instanceof Error ? error.message : 'Gagal membuat produk'
        throw new Error(message)
    }
}

export async function updateProduct(id: string, formData: FormData) {
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

        revalidatePath('/express')
        revalidatePath('/admin/products')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('[Action Error] Failed to update product:', error)
        throw new Error(error instanceof Error ? error.message : 'Gagal memperbarui produk')
    }
}

export async function deleteProduct(id: string) {
    try {
        await ensureAdmin()
        await db.update(products).set({ isDeleted: true }).where(eq(products.id, id))

        revalidatePath('/express')
        revalidatePath('/admin/products')
        revalidatePath('/')
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
        
        const rawData = Object.fromEntries(formData.entries())
        const validated = BuilderOptionSchema.parse(rawData)

        await db.insert(builderOptions).values({
            ...validated,
            isDeleted: false,
        })

        revalidatePath('/custom')
        revalidatePath('/admin/builder')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('[Action Error] Failed to create builder option:', error)
        throw new Error(error instanceof Error ? error.message : 'Gagal membuat opsi rakitan')
    }
}

export async function updateBuilderOption(id: string, formData: FormData) {
    try {
        await ensureAdmin()

        const rawData = Object.fromEntries(formData.entries())
        const validated = BuilderOptionSchema.parse(rawData)

        await db.update(builderOptions).set({
            ...validated,
        }).where(eq(builderOptions.id, id))

        revalidatePath('/custom')
        revalidatePath('/admin/builder')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('[Action Error] Failed to update builder option:', error)
        throw new Error(error instanceof Error ? error.message : 'Gagal memperbarui opsi rakitan')
    }
}

export async function deleteBuilderOption(id: string) {
    try {
        await ensureAdmin()
        await db.update(builderOptions).set({ isDeleted: true }).where(eq(builderOptions.id, id))

        revalidatePath('/custom')
        revalidatePath('/admin/builder')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('[Action Error] Failed to delete builder option:', error)
        throw new Error(error instanceof Error ? error.message : 'Gagal menghapus opsi rakitan')
    }
}
